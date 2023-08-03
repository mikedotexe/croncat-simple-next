import '../styles/globals.css'
import * as React from 'react';

import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { wallets } from '@cosmos-kit/keplr-extension';

// Import this in your top-level route/layout
import "@interchain-ui/react/styles";
import Home from "./index";
import {config} from "dotenv"
import {SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";
config({ path: '.env' })

export default function CosmosApp() {
    return (
        <ChainProvider
            chains={chains} // supported chains
            assetLists={assets} // supported asset lists
            wallets={wallets} // supported wallets
            walletConnectOptions={null}
        >
            <Home />
        </ChainProvider>
    );
}

export const CRONCAT_FACTORY_MAP = JSON.parse(process.env.CRONCAT_FACTORY_MAP);

// Function to shuffle array and select the first 5 elements
function getRandom(arr, num) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// We pass in the chain name, and set the default RPCs to what our NPM package for
// chain-registry has. Then we try to get the most updated version from the GitHub Raw URL
// which is provided in the .env file
export async function getWorkingEndpoint(chainName, wallet, options) {
    // So maybe here is where we actually call (with like axios) the GitHub raw URL,
    // and feed that into
    console.log('aloha chainName', chainName)

    // We get the GitHub raw URL for the most up-to-date chain-registry info
    const githubRawUrl = CRONCAT_FACTORY_MAP[chainName]['githubRaw']
    console.log('aloha githubRawUrl', githubRawUrl)

    const chainInfo = chains.filter(chain => chain.chain_name === chainName)[0]
    let rpcs = chainInfo.apis.rpc
    try {
        const response = await fetch(githubRawUrl);

        if (!response.ok) {
            console.error('Network response was not ok');
            return null
        }

        const data = await response.json();
        console.log('aloha data', data);
        rpcs = data['apis']['rpc']
        console.log('aloha rpcs', rpcs);

        // Use the data here
    } catch (error) {
        console.error('Error:', error);
    }

    // Select (up to) X random RPC endpoints
    const selectedEndpoints = getRandom(rpcs, 6);

    console.log('aloha selectedEndpoints', selectedEndpoints)
    console.log('aloha wallet', wallet)
    const promises = selectedEndpoints.map(endpoint => SigningCosmWasmClient.connectWithSigner(endpoint.address, wallet, options));

    let client
    try {
        // Use Promise.any() to find a working endpoint
        client = await Promise.any(promises);
        // client here will be the first successfully resolved promise
        // Add your logic here to handle the client
        console.log('aloha client', client)
        return client
    } catch (error) {
        // Handle the error when none of the promises are fulfilled
        console.log('aloha error', error);
        return null
    }

    // const client = await SigningCosmWasmClient.connectWithSigner(firstRpcAddress, mockWallet, options);
}
