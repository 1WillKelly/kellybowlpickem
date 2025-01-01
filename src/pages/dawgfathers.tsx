import { type NextPage } from "next";

import styles from "../styles/Home.module.scss";
import Nav from "components/navigation/Nav";
import Table from "components/table/Table";
import BigLogoHeader from "components/BigLogoHeader/BigLogoHeader";
import HeadMetadata from "components/HeadMetadata";

const Home: NextPage = () => {
  const participantIds = [
    // Dawgfather user IDs
    "cm5886qi30013fa98bzjpkh3t",
    "cm5880loq001g2gk6a4pqre6w",
    "cm588566o00392gk6qg6mcrja",
    "cm58851qb000dfa98mdeyllkj",
    "cm58841f5002r2gk6hd9ra1jd",
    "cm5884hmo0007fa98luc2rgxq",
    "cm5884bww0003fa984lcag8k7",
  ];
  return (
    <>
      <HeadMetadata />
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
