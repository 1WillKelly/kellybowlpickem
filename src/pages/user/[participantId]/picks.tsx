import { formatTime } from "components/date-time";
import FullScreenLoading from "components/FullScreenLoading";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { type PickWithMatchupAndTeam } from "types/admin-types";
import { trpc } from "utils/trpc";

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
        <title>{data.participant.name} | Bowl Pick&apos;em</title>
      </Head>
      <div className="mx-auto py-6">
        <h1 className="text-center text-3xl font-medium uppercase text-indigo-800">
          {data.participant.name}
        </h1>
        <div className="mt-4 text-center text-lg text-slate-600">
          {data.season.displayName} Picks
        </div>
        <div className="mt-6 divide-y">
          <div className="border-b-1 grid grid-cols-3 space-x-2 border-slate-400 bg-slate-100 px-2 py-1">
            <div>Bowl</div>
            <div>Your Pick</div>
            <div>Time</div>
          </div>
          {data.picks.map((pick) => (
            <div key={pick.id} className="grid grid-cols-3 space-x-2 px-2 py-1">
              <div>{pick.matchup.name}</div>
              <div>
                <PickCell pick={pick} />
              </div>
              <div>{formatTime(pick.matchup.startDate)}</div>
            </div>
          ))}
          {data.championshipPick.map((pick) => (
            <div key={pick.id} className="grid grid-cols-3 space-x-2">
              <div>CHAMPIONSHIP GAME</div>
              <div>{pick.team.name}</div>
              <div className="text-red-500">Edit here!!!</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ParticipantPicksPage;
