import styles from "../styles/Home.module.scss";
import Nav from "components/navigation/Nav";
import Table from "components/table/Table";
import BigLogoHeader from "components/BigLogoHeader/BigLogoHeader";
import { createSSG } from "server/trpc/ssg";
import HeadMetadata from "components/HeadMetadata";
import { seasonDisplayName } from "utils/datetime";

export const revalidate = 60;

export default async function Page() {
  const ssg = createSSG();
  const participants = await ssg.participants.participantsWithScores.fetch({
    participantIds: undefined,
  });

  return (
    <>
      <HeadMetadata />
      <main>
        <Nav />
        <BigLogoHeader />
        <section className={styles["individual-standings"]}>
          <Table data={participants} />
        </section>
      </main>
    </>
  );
}

export async function generateMetadata() {
  const seasonName = seasonDisplayName();
  return {
    title: `Bowl Pick&apos;em ${seasonName}`,
  };
}
