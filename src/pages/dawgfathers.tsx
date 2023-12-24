import { type NextPage } from "next";
import Head from "next/head";

import styles from "../styles/Home.module.scss";
import Nav from "components/navigation/Nav";
import Table from "components/table/Table";
import BigLogoHeader from "components/BigLogoHeader/BigLogoHeader";

const Home: NextPage = () => {
  const participantIds = [
    // Dawgfather user IDs
    "clbpimp7d000mmu0857uq0p8m",
    "clbqrtmog0014mh08u6d12mf6",
    "clbpvgnj70002i508dju21cwt",
    "clbqrs3v0000qmh08wl2c2z45",
    "clblg4pee000rla08ll9zsquy",
    "clbqrrjfy001ejs08az4ee57t",
    "clbqsequ80004l1084dp9u0nh",
  ];
  return (
    <>
      <Head>
        <title>Bowl Pick&apos;em 2023-24</title>
        <meta name="description" content="Kelly Bowl Pick'em 2023-24" />
      </Head>
      <main>
        <Nav />
        <BigLogoHeader />
        <section className={styles["individual-standings"]}>
          <Table participantIds={participantIds} />
        </section>
      </main>
    </>
  );
};

export default Home;
