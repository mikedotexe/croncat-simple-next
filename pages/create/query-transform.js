import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import {useEffect, useState} from "react";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {QueryClient} from "@cosmjs/stargate";
import {setupWasmExtension} from "@cosmjs/cosmwasm-stargate";

export default function QueriesTransformsCreateTask() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main>
                {/*<h1 className={styles.title} id={"create-task"} data-text="Your text here">Create a CronCat task</h1>*/}

                {/*<div id={"network"}>*/}
                {/*    <select value={selectedOption} onChange={handleChange} style={{*/}
                {/*        padding: '13px',*/}
                {/*        fontSize: '19px',*/}
                {/*        boxShadow: '0 2px 5px rgba(1, 1, 1, 0.65)',*/}
                {/*        border: '13px dashed #357d92',*/}
                {/*    }}>*/}
                {/*        <option value="Neutron">Neutron</option>*/}
                {/*        <option value="Stargaze">Stargaze</option>*/}
                {/*        <option value="Osmosis">Osmosis</option>*/}
                {/*        <option value="Juno">Juno</option>*/}
                {/*    </select>*/}
                {/*</div>*/}

                {/*<div className={styles.grid}>*/}
                {/*    <a href="https://nextjs.org/docs" className={styles.card}>*/}
                {/*        <h3>Documentation &rarr;</h3>*/}
                {/*        <p>Find in-depth information about Next.js features and API.</p>*/}
                {/*    </a>*/}

                {/*    <a href="https://nextjs.org/learn" className={styles.card}>*/}
                {/*        <h3>Learn &rarr;</h3>*/}
                {/*        <p>Learn about Next.js in an interactive course with quizzes!</p>*/}
                {/*    </a>*/}

                {/*    <a*/}
                {/*        href="https://github.com/vercel/next.js/tree/master/examples"*/}
                {/*        className={styles.card}*/}
                {/*    >*/}
                {/*        <h3>Examples &rarr;</h3>*/}
                {/*        <p>Discover and deploy boilerplate example Next.js projects.</p>*/}
                {/*    </a>*/}

                {/*    <a*/}
                {/*        href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"*/}
                {/*        className={styles.card}*/}
                {/*    >*/}
                {/*        <h3>Deploy &rarr;</h3>*/}
                {/*        <p>*/}
                {/*            Instantly deploy your Next.js site to a public URL with Vercel.*/}
                {/*        </p>*/}
                {/*    </a>*/}
                {/*</div>*/}
                aloha
            </main>

            <footer></footer>
        </div>
    )
}
