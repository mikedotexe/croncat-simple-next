import '../styles/globals.css'
import * as React from 'react';

import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
// import { wallets } from '@cosmos-kit/keplr';
import { wallets } from '@cosmos-kit/keplr-extension';

// Import this in your top-level route/layout
import "@interchain-ui/react/styles";
import Home from "./index";
import {WalletConnectOptions} from "@cosmos-kit/core/cjs/types/wallet";
import {MainWalletBase} from "@cosmos-kit/core";

export default function CosmosApp() {
    console.log('honua wallets', wallets)
    console.log('honua chains', chains)
    // const wallet = new KeplrExtensionWallet();

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
