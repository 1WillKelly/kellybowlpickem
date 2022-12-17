import BigLogoHeader from "components/BigLogoHeader/BigLogoHeader";
import { formatTime } from "components/date-time";
import FullScreenLoading from "components/FullScreenLoading";
import Nav from "components/navigation/Nav";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import type { GameWithTeam, PickWithMatchupAndTeam } from "types/admin-types";
import { trpc } from "utils/trpc";

import styles from "../../../components/table/index.module.scss";

interface PickCellProps {
  pick: PickWithMatchupAndTeam;
}

const PickCell: React.FC<PickCellProps> = (props) => {
  if (!props.pick.settled) {
    return <>{props.pick.team.name}</>;
  }

  return (
    <span
      className={
        props.pick.correct ? "text-green-700" : "text-zinc-400 line-through"
      }
    >
      {props.pick.team.name} ({props.pick.settledPoints ?? 0})
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
        {props.matchup.homeTeam.name}: {props.matchup.homeScore} —{" "}
        {props.matchup.awayTeam.name}: {props.matchup.awayScore}
      </>
    );
  }
  return <p>Not completed</p>;
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
    return <div>Whoops! Unable to load data for this user</div>;
  }

  return (
    <>
      <Head>
        <title>Bowl Pick&apos;em 2022-23</title>
        <meta name="description" content="Kelly Bowl Pick'em 2022-23" />
      </Head>
      <main>
        <Nav />
        <BigLogoHeader />
        <h1 className="text-center text-3xl font-medium uppercase text-indigo-800">
          {data.participant.name}
        </h1>
        <div className="mt-4 mb-6 text-center text-lg text-slate-600">
          {data.season.displayName} Picks
        </div>
        <div className={styles.view}>
          <div className={styles["table-wrapper"]}>
            <table className={styles["standings-table"]}>
              <thead>
                <tr>
                  <th>Bowl</th>
                  <th>Your Pick</th>
                  <th>Time</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.picks.map((pick) => (
                  <tr key={pick.id}>
                    <td>{pick.matchup.name}</td>
                    <td>
                      <PickCell pick={pick} />
                    </td>
                    <td>{formatTime(pick.matchup.startDate)}</td>
                    <td>
                      <MatchupStatusCell matchup={pick.matchup} />
                    </td>
                  </tr>
                ))}
                {data.championshipPick.map((pick) => (
                  <tr key={pick.id}>
                    <td>Championship</td>
                    <td>{pick.team.name}</td>
                    <td>TODO</td>
                    <td>TODO</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default ParticipantPicksPage;
