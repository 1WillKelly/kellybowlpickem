import { type PickWithMatchup } from "types/admin-types";

interface PickPossiblePointsProps {
  pick: PickWithMatchup;
}

const calculatePickPoints = (pick: PickWithMatchup): number | null => {
  if (pick.teamId == pick.matchup.homeTeamId) {
    return pick.matchup.homePointValue;
  }
  if (pick.teamId == pick.matchup.awayTeamId) {
    return pick.matchup.awayPointValue;
  }
  // For championship game, they may have picked a team that isn't going to make
  // it
  return null;
};

const PickPossiblePoints: React.FC<PickPossiblePointsProps> = (props) => {
  const possiblePoints = calculatePickPoints(props.pick);

  if (!possiblePoints) {
    return null;
  }
  return <span className="text-slate-500">({possiblePoints})</span>;
};

export default PickPossiblePoints;
