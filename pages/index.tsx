import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React, {useEffect, useState} from "react";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {calculateFee, coin, QueryClient} from "@cosmjs/stargate";
import {setupWasmExtension, SigningCosmWasmClient} from "@cosmjs/cosmwasm-stargate";
import {useChain, useWalletClient} from "@cosmos-kit/react";
import { chains, assets } from 'chain-registry'
import { GasPrice } from '@cosmjs/stargate';
import {MsgExecuteContract} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import {toBase64, toUtf8} from "@cosmjs/encoding";
import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {CRONCAT_FACTORY_MAP, getMockWallet, getWorkingClient, getWorkingEndpoint} from './_app'
import { CroncatTasksClient } from '../public/CroncatTasks.client'
import {convertChain} from "@cosmos-kit/core";
import ContractCreateTask from "./create/contract";
import {TaskRequest} from "../public/CroncatTasks.types";

export default function Home() {
  console.log('aloha CRONCAT_FACTORY_MAP', CRONCAT_FACTORY_MAP);

  const [tasksContractAddr, setTasksContractAddr] = useState('')
  const [selectedChainName, setSelectedChainName] = useState('neutron');

  const chainContext = useChain(selectedChainName);
  const { openView, wallet, getSigningCosmWasmClient } = chainContext;

  const currentChainInfo = chains.filter(c => c.chain_name === selectedChainName)[0]
  const assetListInfo = assets.filter(c => c.chain_name === selectedChainName)[0]
  console.log('aloha assetListInfo', assetListInfo)
  const gasFee = GasPrice.fromString(`${currentChainInfo.fees.fee_tokens[0].average_gas_price}${currentChainInfo.fees.fee_tokens[0].denom}`) // this is quite hilarious, i'm sure
  console.log('aloha gasFee', gasFee)


  const demoSign = async () => {
    if (!wallet) {
      console.error("Wallet not connected. Please connect to wallet first.");
      return;
    }

    let task: TaskRequest = {
      actions: [
        {
          msg: {
            wasm: {
              execute: {
                contract_addr: 'neutron159uz95zucrfjyl73yfqlzc4p2pk9qul4cmkryecvfg8mgvcvjjgqumhfh4',
                funds: [],
                msg: toBase64(Buffer.from('{"toggle":{}}'))
              }
            }
          },
          gas_limit: 666_000,
        }
      ],
      boundary: null,
      cw20: null,
      interval: {
        block: 3
      },
      stop_on_fail: false,
      queries: null,
      transforms: null
    }
    console.log('aloha task', task)

    const signerAddress = chainContext.address

    console.log('aloha should i do this, Chat GPT?', selectedChainName)
    // console.log('aloha sClient', sClient.)
    // let signingClient = await getSigningCosmWasmClient();
    // const signingClient = await getSigningCosmWasmClient();
    // console.log('aloha signingClient', signingClient)
    const sClient = await getSigningCosmWasmClient();

    // const executeContractMsg = {
    //     typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    //     value: MsgExecuteContract.fromPartial({
    //         sender: signerAddress,
    //         contract: 'neutron12g9rc7uet8jqlhhjf72emd56ndk8rctfsmy30llekem4scsgd77sgnkvfa',
    //         msg: toUtf8(`{"remove_nominate_owner":{}}`),
    //         funds: [],
    //     }),
    // };
    // const memo = "";
    // const gasUsed = await sClient.simulate(signerAddress, [executeContractMsg], memo);

    // Create a mock wallet, even if it fails simulation, we'll get some idea
    // Then just multiply by some non-scientific number and move forward
    const mockWallet = await getMockWallet(currentChainInfo.bech32_prefix);
    let delme2 = await mockWallet.getAccounts();
    const catAccount = delme2[0].address
    console.log('aloha catAccountz', catAccount)
    console.log('aloha currentChainInfo.bech32_prefix', currentChainInfo.bech32_prefix)

    const defaultSigningOptions = {
      broadcastPollIntervalMs: 300,
      broadcastTimeoutMs: 8_000,
      gasPrice: gasFee,
    };

    const options = { ...defaultSigningOptions, prefix: selectedChainName };
    console.log('aloha selectedChainName', selectedChainName)
    let rpcAddresses = currentChainInfo.apis.rpc
    console.log('aloha rpcAddresses', rpcAddresses)
    let firstRpcAddress = currentChainInfo.apis.rpc.pop().address
    console.log('aloha firstRpcAddress', firstRpcAddress)
    const mockClient = await getWorkingClient(selectedChainName, mockWallet, options)
    const realClient = await getWorkingClient(selectedChainName, wallet, options)
    console.log('aloha mockClient', mockClient)

    // let catAccounts = await mockClient.getAccounts()
    // let catAccount = catAccounts[0].address
    // console.log('aloha catAccount', catAccount)
    const executeContractMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: catAccount,
        contract: tasksContractAddr,
        msg: toUtf8(JSON.stringify({
          create_task: {
            task
          }
        })),
        funds: [],
      }),
    };
    const memo = "davai davai!";
    // Set default to some number
    let gasUsed = 666_000
    try {
      let simRes = await mockClient.simulate(catAccount, [executeContractMsg], memo);
      console.log('aloha simRes', simRes)
    } catch (e) {
      console.error('aloha error simulating from mock account', e)
      let regex = /gas used: '(\d+)'/;
      let match = e.toString().match(regex);

      // whatever, give it buffer.
      // if anything, everything's too cheap anyway
      gasUsed = Math.floor(match[1] * 1.666)
    }
    console.log('aloha gasUsed (with arbitrary multiple)', gasUsed)

    // let sim = await sClient.simulate(signerAddress, )
    const executeFee = calculateFee(gasUsed, gasFee);
    console.log('aloha executeFee', executeFee)
    console.log('aloha tasksContractAddr', tasksContractAddr)

    // let createCronCatTaskMessage = new CroncatTasksClient(client, chainContext.address, tasksContractAddr);
    console.log('aloha chainContext.address', chainContext.address)
    // window.realClient = realClient
    // console.log('aloha realClient', realClient)

    // const delme = realClient.getAccounts()
    // let createCronCatTaskMessage = new CroncatTasksClient(realClient, chainContext.address, tasksContractAddr);
    // console.log('aloha createCronCatTaskMessage', createCronCatTaskMessage)
    /*
    export interface TaskRequest {
      actions: ActionForEmpty[];
      boundary?: Boundary | null;
      cw20?: Cw20Coin | null;
      interval: Interval;
      queries?: CosmosQueryForWasmQuery[] | null;
      stop_on_fail: boolean;
      transforms?: Transform[] | null;
    }
     */

    /*
    wtf bish

   TypeError: this.signer.getAccounts is not a function

    let createTaskRes = await createCronCatTaskMessage.createTask({
      task: {
        actions: [
          {
            msg: {
              wasm: {
                execute: {
                  contract_addr: 'neutron159uz95zucrfjyl73yfqlzc4p2pk9qul4cmkryecvfg8mgvcvjjgqumhfh4',
                  funds: [],
                  msg: toBase64('{"toggle":{}}')
                }
              }
            },
            gas_limit: 666_000,
          }
        ],
        boundary: null,
        cw20: null,
        interval: {
          block: 3
        },
        stop_on_fail: false,
        queries: null,
        transforms: null
      }
    })
    console.log('aloha createTaskRes', createTaskRes)
  */
    // createCronCatTaskMessage.createTask

    console.log('aloha chainContext.address', chainContext.address)
    console.log('aloha tasksContractAddr', tasksContractAddr)
    let execRes
    try {
      execRes = await sClient.execute(chainContext.address, tasksContractAddr, {'create_task': { task }}, executeFee, 'Your ad here, lol. but seriously…', [coin(1_000_000, currentChainInfo.fees.fee_tokens[0].denom)]);
      // execRes = await sClient.execute(chainContext.address, tasksContractAddr, {'create_task': { task }}, executeFee, 'Your ad here, lol. but seriously…', [coin(1_000_000, currentChainInfo.fees.fee_tokens[0].denom)]);
      console.log('aloha execRes', execRes)
      // console.log('aloha sClient', sClient)

    } catch (e) {
      console.error('aloha honua e', e)
    }
  }

  // Saw this on: https://docs.cosmoskit.com/cookbook/connect-multi-chains#case-2-no-specific-wallets-modal-required
  const { status, client } = useWalletClient();
  let oldChain = currentChainInfo
  let newChain = convertChain(currentChainInfo, assetListInfo.assets, {
    signingCosmwasm: () => {
      console.log('aloha gasFee', gasFee)
      return {
        registry: null,
        aminoTypes: null,
        broadcastPollIntervalMs: 300,
        broadcastTimeoutMs: 8_000,
        gasPrice: gasFee
      }
    }
  })

  // client.addChain

  useEffect(() => {
    console.log('aloha status', status)
    if (status === "Done") {
      console.log('honua hi there')
      client.enable?.(["cosmoshub-4", "osmosis-1", "juno-1"]);
      client.getAccount?.("juno-4").then((account) => console.log(account));
      client.getAccount?.("osmosis-1").then((account) => console.log(account));
      client
        .getAccount?.("cosmoshub-4")
        .then((account) => console.log(account));
    }
  }, [status]);

  // Run at beginning
  useEffect(() => {
    const fetchData = async () => {
      const mockWallet = await getMockWallet(currentChainInfo.bech32_prefix);
      const defaultSigningOptions = {
        broadcastPollIntervalMs: 300,
        broadcastTimeoutMs: 8_000,
        gasPrice: gasFee,
      };

      const options = { ...defaultSigningOptions, prefix: selectedChainName };

      const endpoint = await getWorkingEndpoint(selectedChainName, mockWallet, options)
      const tmClient = await Tendermint34Client.connect(endpoint);
      let queryClient = QueryClient.withExtensions(tmClient, setupWasmExtension);
      console.log('queryClient', queryClient);
      console.log('aloha CronCat factories', CRONCAT_FACTORY_MAP);
      console.log('aloha selectedChainName', selectedChainName);

      const factoryAddr = CRONCAT_FACTORY_MAP[selectedChainName].factory;
      console.log('aloha factoryAddr', factoryAddr);

      let croncatContracts = await queryClient.wasm.queryContractSmart(factoryAddr, {
        latest_contract: {
          contract_name: 'tasks'
        }
      })
      // console.log('aloha croncatContracts', croncatContracts)
      // const tasksContract = croncatContracts.filter(contract => contract['contract_name'] === "tasks")[0];
      // console.log('aloha tasksContracts', tasksContract)
      const tasksContractAddr = croncatContracts['metadata']['contract_addr']
      console.log('aloha tasksContractAddr', tasksContractAddr)
      setTasksContractAddr(tasksContractAddr)
    };

    fetchData()
  }, [])

  // Once we've got the tasks contract address
  useEffect(() => {
    console.log('useeffect for tasksContractAddr', tasksContractAddr)
    // Fill out

  }, [tasksContractAddr])

  const handleChange = (event) => {
    setSelectedChainName(event.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>CronCat task creation</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <h1 className={styles.title} id={"create-task"}>Create CronCat task</h1>

        <div className="flexContainer">
          <div id={"network"}>
            <select className="cartoonBtn" value={selectedChainName} onChange={handleChange} style={{
              padding: '13px',
              fontSize: '23px',
              boxShadow: '0 3px 6px rgba(255, 255, 255, 0.9)',
              border: '13px dotted #357d92',
            }}>
              <option value="neutron">Neutron</option>
              <option value="stargaze">Stargaze</option>
              <option value="osmosis">Osmosis</option>
              <option value="juno">Juno</option>
            </select>
          </div>

          {/*Fun debugging <div id={"alohabro"}>{status}</div>*/}

          {status !== "Init" ? (
            <div id={"connect"} style={{ textAlign: "center", zIndex: 4 }}>
              <div className="cartoonBtn" onClick={openView} style={{
                padding: '13px',
                fontSize: '23px',
                boxShadow: '0 3px 6px rgba(255, 255, 255, 0.9)',
                border: '10px dotted #357d92',
              }}>My Wallet</div>
            </div>
          ) : (
            <div id={"connect"} style={{ textAlign: "center", zIndex: 4 }}>
              <div className="cartoonBtn" onClick={openView} style={{
                padding: '13px',
                fontSize: '23px',
                boxShadow: '0 3px 6px rgba(255, 255, 255, 0.9)',
                border: '10px dotted #357d92',
              }}>Connect Wallet</div>
            </div>
          )}
        </div>

        <div id={"ez-test"} className={styles.ez} onClick={demoSign}>
          <p>demo sign real quick</p>
        </div>

        <div className={styles.grid}>
          <a href="/create/simple.ts" className={styles.card}>
            <h3>Simple &rarr;</h3>
            <p>Send another person a small amount attached to a task.</p>
            <hr className={'cartoon'}/>
            <p>✅ Bank Send tokens</p>
            <p>❌ If-this-then-that</p>
          </a>

          <a href="/create/contract.ts" className={styles.card}>
            <h3>Call contract &rarr;</h3>
            <p>Call a simple smart contract with a task.</p>
            <hr className={'cartoon'}/>
            <p>✅ Wasm Execute method</p>
            <p>❌ If-this-then-that</p>
          </a>

          <a
            href="/create/query.ts"
            className={styles.card}
          >
            <h3>Query &rarr;</h3>
            <p>Use a query to determine when your task should execute.</p>
            <hr className={'cartoon'}/>
            <p>✅ Wasm Execute method</p>
            <p>✅ Depends on query</p>
            <p>❌ Doesn't insert query's value</p>
          </a>

          <a
            href="/create/query-transform.ts"
            className={styles.card}
          >
            <h3>Query & Transform &rarr;</h3>
            <p>Use value of query in your future execution/action.</p>
            <hr className={'cartoon'}/>
            <p>✅ Wasm Execute method</p>
            <p>✅ Depends on query</p>
            <p>✅ Insert query's value into placeholder</p>
          </a>
        </div>
      </main>

      <footer></footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 31px;
          border-top: 1px solid #eaeaea;
          background: radial-gradient(circle at center, #222 23%, #357d92 91%);
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        footer:before,
        footer:after {
          content: '';
          position: absolute;
          top: -10%; /* adjust as needed */
          left: -10%; /* adjust as needed */
          width: 120%; /* adjust as needed */
          height: 120%; /* adjust as needed */
          background: inherit;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
          DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        hr.cartoon {
          border: none;
          border-top: 6px dotted #357d92;
          width: 66%;
          height: 16px;
          margin: 12px auto;
          background: transparent;
        }

        .flexContainer {
          display: flex;
          gap: 20px;
          justify-content: center;
          align-items: center;
        }

        .cartoonBtn {
          background-color: #357d92;
          color: white;
          border: none;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          transition-duration: 0.4s;
          cursor: pointer;
          box-shadow: 0 9px #999;
          border-radius: 12px;
        }

        .cartoonBtn:hover {
          background-color: #11596e;
          color: white;
          box-shadow: 0 5px #666;
          transform: translateY(4px);
        }

        .cartoonBtn:active {
          box-shadow: 0 5px #666;
          transform: translateY(4px);
        }

      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-weight: lighter;
          font-family: Sniglet, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
          Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
          sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        h1 {
          color: whitesmoke;
          position: relative;
          text-shadow: -6px 0 black, 0 6px black, 6px 0 black, 0 -6px black;
          background: radial-gradient(ellipse closest-side, white, #357d92 119%);
          animation: gradient-loop 19s infinite linear;
          //font-weight: 300;

          //background-color: #357d92;
          padding: 20px;
          border-radius: 45%;
          box-shadow: 0 0 0 19px #357d92,
          19px 19px 0 23px #357d92,
            23px -19px 0 31px #357d92;
        }
        @keyframes gradient-loop {
          0% {
            background-size: 150% 150%;
          }
          50% {
            background-size: 100% 66%;
          }
          70% {
            background-size: 100% 100%;
          }
          100% {
            background-size: 150% 150%;
          }
        }
        #network {
          z-index: 1;
        }

        h1::before {
          content: '';
          position: absolute;
          top: -19px;
          left: -19px;
          right: -19px;
          bottom: -19px;
          background: linear-gradient(270deg, rgba(53, 125, 146, 0.06), rgba(255, 255, 0, 0.12), rgba(0, 128, 0, 0.12), rgba(17, 89, 110, 0.06), rgba(53, 125, 146, 0.06));
          background-size: 200% 100%;
          z-index: 5;
          border-radius: inherit;
          clip-path: inset(0 0 0 19px);
          animation: gradient-loop2 6s linear infinite;
        }

        @keyframes gradient-loop2 {
          0% { background-position: 0%; }
          50% { background-position: 100%; }
          100% { background-position: 0%; }
        }

      `}</style>
    </div>
  )
}
