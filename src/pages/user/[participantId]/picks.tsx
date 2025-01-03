import Image from "next/image";
import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import { useRouter } from "next/router";

import FullScreenLoading from "components/FullScreenLoading";
import Nav from "components/navigation/Nav";
import { formatTime } from "components/date-time";

import CirclePickCorrect from "assets/images/circle-pick-correct.svg";
import CirclePickIncorrect from "assets/images/circle-pick-incorrect.svg";

import type { GameWithTeam, PickWithMatchupAndTeam } from "types/admin-types";
import { trpc } from "utils/trpc";

import tableStyles from "components/table/index.module.scss";
import styles from "./index.module.scss";
import PickPossiblePoints from "components/PickPossiblePoints";
import { CHAMPIONSHIP_POINT_VALUE } from "server/constants/point-constants";
import HeadMetadata from "components/HeadMetadata";
import { createSSG } from "server/trpc/ssg";
import { type DehydratedState } from "@tanstack/react-query";
import PickBarChart from "components/data/PickBarChart";

interface PickCellProps {
  pick: PickWithMatchupAndTeam;
}

const PickCell: React.FC<PickCellProps> = (props) => {
  const teamLogo = props.pick.team.logo && (
    <Image
      alt={props.pick.team.name}
      width={20}
      height={20}
      src={props.pick.team.logo}
    />
  );

  if (!props.pick.settled) {
    return (
      <div className="flex flex-row space-x-2 pr-6">
        {teamLogo}
        <div>
          {props.pick.team.name} <PickPossiblePoints pick={props.pick} />
        </div>
      </div>
    );
  }

  return (
    <span
      className={[styles["your-pick"], "flex flex-row space-x-2"].join(" ")}
    >
      {teamLogo}
      <div>
        {props.pick.team.name} ({props.pick.settledPoints ?? 0})
      </div>
    </span>
  );
};

interface MatchupStatusCellProps {
  matchup: GameWithTeam;
}

const MatchupStatusCell: React.FC<MatchupStatusCellProps> = (props) => {
  if (props.matchup.completed) {
    return (
      <>
        <div className={styles.matchup}>
          <span className={styles["matchup-line"]}>
            <span className={styles["team-name"]}>
              {props.matchup.homeTeam.name}
            </span>
            <span>{props.matchup.homeScore}</span>
          </span>
          <span className={styles["matchup-line"]}>
            <span className={styles["team-name"]}>
              {props.matchup.awayTeam.name}
            </span>
            <span>{props.matchup.awayScore}</span>
          </span>
        </div>
      </>
    );
  }
  return <span className="text-xs font-medium text-gray-400">TBD</span>;
};

const ParticipantPicksPage: NextPage = () => {
  const { query } = useRouter();
  const { data, isLoading } = trpc.picks.participantPicks.useQuery(
    {
      participantId: query.participantId as string,
    },
    {
      enabled: !!query.participantId,
      retry: false,
    }
  );

  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (!data?.participant || !data?.picks) {
    return <div>Sorry, we&#39;re unable to load data for this participant</div>;
  }

  const hasChampionshipPick =
    data.picks.find((p) => p.matchup.isChampionship) !== undefined;

  return (
    <>
      <HeadMetadata />
      <main>
        <Nav />
        <div className={styles["participant-intro"]}>
          <h1>{data.participant.name}</h1>
          <h2>{data.season.displayName} Picks</h2>
        </div>
        <div className="mx-4 mb-4 flex flex-row justify-center">
          <div className="h-14 w-full max-w-xl sm:h-20">
            <PickBarChart
              picks={data.picks}
              championshipPick={data.championshipPick}
            />
          </div>
        </div>
        <section className={styles["picks-wrapper"]}>
          <div className={tableStyles.view}>
            <div className={tableStyles["table-wrapper"]}>
              <table className={tableStyles["standings-table"]}>
                <thead>
                  <tr>
                    <th>Bowl</th>
                    <th>Your Pick</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data.picks.map((pick) => {
                    return (
                      <tr
                        key={pick.id}
                        className={`
                        ${styles["bowl-row"]}
                        ${pick.correct ? styles.correct : ""}
                        ${pick.settled && !pick.correct ? styles.incorrect : ""}
                      `}
                      >
                        <td className={styles["bowl-cell"]}>
                          <span
                            className={`
                            ${styles["status-circle"]}
                            ${styles.tbd}
                          `}
                          ></span>
                          <Image
                            src={CirclePickCorrect.src}
                            alt="Kelly Bowl Pick'em"
                            width={24}
                            height={24}
                            className={`
                            ${styles["status-circle"]}
                            ${styles.correct}
                          `}
                          />
                          <Image
                            src={CirclePickIncorrect.src}
                            alt="Kelly Bowl Pick'em"
                            width={24}
                            height={24}
                            className={`
                            ${styles["status-circle"]}
                            ${styles.incorrect}
                          `}
                          />
                          <div>
                            <span className={styles["bowl-name"]}>
                              {pick.matchup.name}
                            </span>
                            <span className={styles["date-time"]}>
                              {formatTime(pick.matchup.startDate)}
                              {!pick.settled &&
                                pick.matchup.tvChannel &&
                                ` on ${pick.matchup.tvChannel}`}
                            </span>
                          </div>
                        </td>
                        <td>
                          <PickCell pick={pick} />
                        </td>
                        <td className={styles["matchup-cell"]}>
                          <MatchupStatusCell matchup={pick.matchup} />
                        </td>
                      </tr>
                    );
                  })}
                  {!hasChampionshipPick &&
                    data.championshipPick.map((pick) => (
                      <tr key={pick.id}>
                        <td className={styles["bowl-cell"]}>
                          <span
                            className={`
                            ${styles["status-circle"]}
                            ${styles.tbd}
                          `}
                          ></span>
                          <div>
                            <span className={styles["bowl-name"]}>
                              National Championship
                            </span>
                            <span className={styles["date-time"]}>
                              Tue, Jan 11 - 5:00 PM
                            </span>
                          </div>
                        </td>
                        <td>
                          {pick.team.name}{" "}
                          <span className="text-slate-500">
                            ({CHAMPIONSHIP_POINT_VALUE})
                          </span>
                        </td>
                        <td>
                          <span className="text-xs text-gray-400">TBD</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export const getStaticProps = (async (context) => {
  const ssg = createSSG();
  if (!context.params) {
    throw new Error("No params");
  }
  await ssg.picks.participantPicks.prefetch({
    participantId: context.params.participantId as string,
  });
  return { props: { trpcState: ssg.dehydrate() }, revalidate: 60 };
}) satisfies GetStaticProps<{ trpcState: DehydratedState }>;

export const getStaticPaths = (async () => {
  const ssg = createSSG();
  const participants = await ssg.participants.participants.fetch();
  return {
    paths: participants.map((p) => ({
      params: {
        participantId: p.id,
      },
    })),
    fallback: true, // false or "blocking"
  };
}) satisfies GetStaticPaths;

export default ParticipantPicksPage;
