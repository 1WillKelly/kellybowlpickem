import styles from "../../styles/Home.module.scss";
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
    participantIds: [
      // Dawgfather user IDs
      "clbpimp7d000mmu0857uq0p8m",
      "clbqrtmog0014mh08u6d12mf6",
      "clbpvgnj70002i508dju21cwt",
      "clbqrs3v0000qmh08wl2c2z45",
      "clblg4pee000rla08ll9zsquy",
      "clbqrrjfy001ejs08az4ee57t",
      "clbqsequ80004l1084dp9u0nh",
    ],
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
