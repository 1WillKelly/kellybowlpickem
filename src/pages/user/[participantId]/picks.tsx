import { formatTime } from "components/date-time";
import FullScreenLoading from "components/FullScreenLoading";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

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
        <title>{data.participant.name}&apos;s picks</title>
      </Head>
      <div className="mx-auto py-6">
        <h1 className="text-center text-xl">
          {data.participant.name}&apos;s picks
        </h1>
        <div className="mt-6 divide-y">
          {data.picks.map((pick) => (
            <div key={pick.id} className="grid grid-cols-3 space-x-2">
              <div>{pick.matchup.name}</div>
              <div>{pick.team.name}</div>
              <div>{formatTime(pick.matchup.startDate)}</div>
            </div>
          ))}
          {data.championshipPick.map((pick) => (
            <div key={pick.id} className="grid grid-cols-3 space-x-2">
              <div>CHAMPIONSHIP GAME</div>
              <div>{pick.team.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ParticipantPicksPage;
