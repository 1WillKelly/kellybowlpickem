import { type NextPage } from "next";

import styles from "../styles/Home.module.scss";
import Nav from "components/navigation/Nav";
import Table from "components/table/Table";
import BigLogoHeader from "components/BigLogoHeader/BigLogoHeader";
import { createSSG } from "server/trpc/ssg";
import HeadMetadata from "components/HeadMetadata";
import { seasonDisplayName } from "utils/datetime";

const Home: NextPage = () => {
  return (
    <>
      <HeadMetadata />
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

export async function generateMetadata() {
  const seasonName = seasonDisplayName();
  return {
    title: `Bowl Pick&apos;em ${seasonName}`,
  };
}

export const getStaticProps = async () => {
  const ssg = createSSG();
  await ssg.participants.participantsWithScores.prefetch({
    participantIds: undefined,
  });
  return { props: { trpcState: ssg.dehydrate() }, revalidate: 60 };
};

export default Home;
