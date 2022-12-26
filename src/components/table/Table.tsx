import Image from "next/image";
import Link from "next/link";
import { trpc } from "utils/trpc";
import StandingsTable from "./StandingsTable";

const Table: React.FC = () => {
  const participantsQuery = trpc.participants.participantsWithScores.useQuery();

  const sortedParticipants = participantsQuery.data?.participants
    .map((p) => {
      const upcomingPicks = p.picks.map((pick) => {
        return (
          <div key={pick.id} className="flex flex-row space-x-2 pr-6">
            {pick.team.logo && (
              <Image
                alt={pick.team.name}
                width={20}
                height={20}
                src={pick.team.logo}
              />
            )}
            <div>{pick.team.name}</div>
          </div>
        );
      });

      if (p.seasonScores?.length !== 1 || !p.seasonScores[0]) {
        return {
          name: p.name,
          id: p.id,
          upcomingPicks,
        };
      }

      const scoring = p.seasonScores[0];

      return {
        name: p.name,
        id: p.id,
        points: scoring.points,
        possibleTotal: scoring.possiblePoints,
        upcomingPicks,
      };
    })
    .sort((a, b) => {
      const overallScore = (b.points ?? 0) - (a.points ?? 0);
      if (overallScore !== 0) {
        return overallScore;
      }
      return (b.possibleTotal ?? 0) - (a.possibleTotal ?? 0);
    });

  return (
    <StandingsTable
      individualtandings
      loading={participantsQuery.isLoading}
      items={sortedParticipants}
      columnNames={() => [
        "Name",
        "Score",
        "Potential",
        ...(participantsQuery.data?.upcomingGames.map((g) => g.name) ?? [
          "",
          "",
          "",
        ]),
      ]}
      renderItem={(participant) => [
        <Link key={participant.id} href={`/user/${participant.id}/picks`}>
          {participant.name}
        </Link>,
        participant.points,
        participant.possibleTotal,
        ...participant.upcomingPicks,
      ]}
    />
  );
};

export default Table;
