import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {useEffect, useState} from "react";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {QueryClient} from "@cosmjs/stargate";
import {setupWasmExtension} from "@cosmjs/cosmwasm-stargate";

export default function Home() {
  const [tasksContractAddr, setTasksContractAddr] = useState('')
  const [selectedOption, setSelectedOption] = useState('Neutron');

  // Run at beginning
  useEffect(() => {
    const fetchData = async () => {
      const tmClient = await Tendermint34Client.connect('https://uni-rpc.reece.sh');
      let queryClient = QueryClient.withExtensions(tmClient, setupWasmExtension);
      console.log('queryClient', queryClient);
      let croncatContracts = await queryClient.wasm.queryContractSmart('juno1mc4wfy9unvy2mwx7dskjqhh6v7qta3vqsxmkayclg4c2jude76es0jcp38', {
        "latest_contracts":{}
      })
      console.log('aloha croncatContracts', croncatContracts)
      const tasksContract = croncatContracts.filter(contract => contract['contract_name'] === "tasks")[0];
      console.log('aloha tasksContracts', tasksContract)
      const tasksContractAddr = tasksContract['metadata']['contract_addr']
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
    setSelectedOption(event.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <h1 className={styles.title} id={"create-task"}>Create a CronCat task</h1>

        <div id={"network"}>
          <select value={selectedOption} onChange={handleChange} style={{
            padding: '13px',
            fontSize: '19px',
            boxShadow: '0 3px 6px rgba(255, 255, 255, 0.9)',
            border: '13px dashed #357d92',
          }}>
            <option value="Neutron">Neutron</option>
            <option value="Stargaze">Stargaze</option>
            <option value="Osmosis">Osmosis</option>
            <option value="Juno">Juno</option>
          </select>
        </div>

        <div className={styles.grid}>
          <a href="/create/simple" className={styles.card}>
            <h3>Simple &rarr;</h3>
            <p>Send another person a small amount attached to a task.</p>
            <hr className={'cartoon'}/>
            <p>✅ Bank Send tokens</p>
            <p>❌ If-this-then-that</p>
          </a>

          <a href="/create/contract" className={styles.card}>
            <h3>Call contract &rarr;</h3>
            <p>Call a simple smart contract with a task.</p>
            <hr className={'cartoon'}/>
            <p>✅ Wasm Execute method</p>
            <p>❌ If-this-then-that</p>
          </a>

          <a
            href="/create/query"
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
            href="/create/query-transform"
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
          margin-top: 12px;
          background: transparent;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
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
      `}</style>
    </div>
  )
}
