import { type NextPage } from "next";
import Head from "next/head";

import styles from "../styles/Home.module.scss";
import Nav from "components/navigation/Nav";
import Table from "components/table/Table";
import BigLogoHeader from "components/BigLogoHeader/BigLogoHeader";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bowl Pick&apos;em 2022-23</title>
        <meta name="description" content="Kelly Bowl Pick'em 2022-23" />
      </Head>
      <main>
        <Nav />
        <BigLogoHeader />
        <section className={styles["individual-standings"]}>
          <Table />
        </section>
      </main>
    </>
  );
};

export default Home;
