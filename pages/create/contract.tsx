import Head from 'next/head';
import styles from '../../styles/Home.module.css';

import {useEffect, useState} from "react";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {QueryClient} from "@cosmjs/stargate";
import {setupWasmExtension} from "@cosmjs/cosmwasm-stargate";

export default function ContractCreateTask() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Contract call — CronCat task</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main>
                <p></p>
            </main>

            <footer>big time</footer>
        </div>
    )
}
