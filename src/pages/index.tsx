import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.scss";
import BigLogo from "../assets/images/bowlpickem-logo.svg";
import Nav from "components/navigation/Nav";
import Table from "components/table/Table";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Bowl Pick&apos;em 2022-23</title>
        <meta name="description" content="Kelly Bowl Pick'em 2022-23" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Nav />
        <section className="flex w-full items-center justify-center py-14">
          <Image src={BigLogo.src} alt="test" width={390} height={160} />
        </section>
        <section className={styles["individual-standings"]}>
          <Table />
        </section>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2"></div>
        </div>
      </main>
    </>
  );
};

export default Home;
