import { type PickWithMatchup } from "types/admin-types";

interface PickPossiblePointsProps {
  pick: PickWithMatchup;
}

const PickPossiblePoints: React.FC<PickPossiblePointsProps> = (props) => {
  const possiblePoints =
    props.pick.teamId === props.pick.matchup.homeTeamId
      ? props.pick.matchup.homePointValue
      : props.pick.matchup.awayPointValue;

  if (!possiblePoints) {
    return null;
  }
  return <span className="text-slate-500">({possiblePoints})</span>;
};

export default PickPossiblePoints;
