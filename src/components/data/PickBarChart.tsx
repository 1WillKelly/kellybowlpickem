import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { type RouterOutputs } from "utils/trpc";

type Picks = RouterOutputs["picks"]["participantPicks"]["picks"];

interface Props {
  picks: Picks;
  height?: number;
}

const pointsForPick = (pick: Picks[number]): number => {
  if (pick.teamId === pick.matchup.homeTeamId) {
    return pick.matchup.homePointValue ?? 0;
  }

  if (pick.teamId === pick.matchup.awayTeamId) {
    return pick.matchup.awayPointValue ?? 0;
  }

  // Special case for championship
  return 0;
};

const PickBarChart: React.FC<Props> = ({ picks, height = 80 }) => {
  const picksWithPoints = picks.map((pick) => ({
    id: pick.id,
    correct: pick.correct,
    settled: pick.settled,
    points: pointsForPick(pick),
  }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={picksWithPoints} barGap={20}>
        <YAxis hide />
        <XAxis dataKey="week" hide />
        <Bar type="natural" dataKey="points" radius={2}>
          {picksWithPoints.map((pick) => {
            const fillColor = pick.settled
              ? pick.correct
                ? "#27ae60"
                : "hsla(230, 7%, 84%, 0.4)"
              : // : "hsla(230, 7%, 84%, 0.4)";
                "hsla(226, 7%, 84%, 1)";
            return <Cell key={pick.id} fill={fillColor} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PickBarChart;
