import { type NextPage } from "next";
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
    // TODO add a real loading state
    return <div>Loading...</div>;
  }

  if (!data?.participant || !data?.picks) {
    return <div>Whoops! Unable to load data for this user</div>;
  }

  return (
    <div className="mx-auto max-w-lg py-6">
      <h1 className="text-center text-xl">
        {data.participant.name}&apos;s picks
      </h1>
      <div className="mt-6 divide-y">
        {data.picks.map((pick) => (
          <div key={pick.id} className="grid grid-cols-2">
            <div>{pick.matchup.name}</div>
            <div>{pick.team.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantPicksPage;
