import { trpc } from "utils/trpc";

interface ParticipantWithScore {
  name: string;
  points?: number;
  possibleTotal?: number;
}

const Table: React.FC = () => {
  const participantsQuery = trpc.participants.participantsWithScores.useQuery();
  
  const renderParticipants = () => {
    if (participantsQuery.isLoading) {
      return <tr><td colSpan={3}>Participants loading...</td></tr>
    }

    if (!participantsQuery.data?.participants) {
      return <tr><td colSpan={3}>Error loading participants :(</td></tr>
    }

    const sortedParticipants: ParticipantWithScore[] = participantsQuery.data.participants.map((p) => {
      if (p.seasonScores?.length !== 1 || !p.seasonScores[0]) {
        return {
          name: p.name,
        };
      }
      const scoring = p.seasonScores[0];
      return {
        name: p.name,
        points: scoring.points,
        possibleTotal: scoring.possiblePoints
      };
    }).sort((a, b) => (b.points ?? 0) - (a.points ?? 0))

    return (
      <>
        {sortedParticipants.map((participant, idx) => (
          <tr key={idx} className="text-black">
            <td className="p-4">{participant.name}</td>
            <td className="p-4">{participant.points}</td>
            <td className="p-4">{participant.possibleTotal}</td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <table className="min-w-full divide-y divide-gray-300 text-left">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-4">
            Name
          </th>
          <th className="p-4">
            Score
          </th>
          <th className="p-4">
            Possible Total
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {renderParticipants()}
      </tbody>
    </table>
  );
};

export default Table;
