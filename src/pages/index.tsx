import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import styles from '../styles/Home.module.scss'
import BigLogo from '../assets/images/bowlpickem-logo.svg';
import { trpc } from "../utils/trpc";
import Nav from "components/navigation/Nav";
import Table from "components/table/Table";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bowl Pick'em 2022-23</title>
        <meta name="description" content="Kelly Bowl Pick 'em 2022-23" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Nav />
        <section className="w-full flex items-center justify-center py-14">
          <Image src={BigLogo.src} alt="test" width={390} height={160} />
        </section>
        <section className={`${styles.standings} w-full`}>
          <Table />
        </section>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
