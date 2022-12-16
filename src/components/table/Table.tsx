import Link from "next/link";
import { trpc } from "utils/trpc";
import styles from "./index.module.scss";

interface ParticipantWithScore {
  name: string;
  id: string;
  points?: number;
  possibleTotal?: number;
  upcomingPicks: string[];
}

const Table: React.FC = () => {
  const participantsQuery = trpc.participants.participantsWithScores.useQuery();

  const renderParticipants = () => {
    if (participantsQuery.isLoading) {
      return (
        <tr>
          <td colSpan={3}>Participants loading...</td>
        </tr>
      );
    }

    if (!participantsQuery.data?.participants) {
      return (
        <tr>
          <td colSpan={3}>Error loading participants :(</td>
        </tr>
      );
    }

    const sortedParticipants: ParticipantWithScore[] =
      participantsQuery.data.participants
        .map((p) => {
          const upcomingPicks = p.picks.map((pick) => pick.team.name);

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
        .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

    return (
      <>
        {sortedParticipants.map((participant, idx) => (
          <tr key={idx}>
            <td className={styles.rank}>{idx + 1}</td>
            <td>
              <Link href={`/user/${participant.id}/picks`}>
                {participant.name}
              </Link>
            </td>
            <td>{participant.points}</td>
            <td>{participant.possibleTotal}</td>
            {participant.upcomingPicks.map((pick, idx) => (
              <td key={idx}>{pick}</td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  return (
    <table
      className={`
      ${styles["standard-table"]}
      min-w-full text-left
      `}
    >
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Score</th>
          <th>Potential</th>
          {(
            participantsQuery.data?.upcomingGames.map((g) => g.name) ?? [
              "",
              "",
              "",
            ]
          ).map((name) => (
            <th>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white">{renderParticipants()}</tbody>
    </table>
  );
};

export default Table;
