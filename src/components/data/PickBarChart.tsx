import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type RouterOutputs } from "utils/trpc";

type Picks = RouterOutputs["picks"]["participantPicks"]["picks"];

interface Props {
  picks: Picks;
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

const PickBarChart: React.FC<Props> = ({ picks }) => {
  const picksWithPoints = picks.map((pick) => ({
    id: pick.id,
    correct: pick.correct,
    settled: pick.settled,
    points: pointsForPick(pick),
    name: pick.matchup.name,
    miss: pick.settled && !pick.correct ? 2 : undefined,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={picksWithPoints} barGap={30}>
        <YAxis hide />
        <XAxis dataKey="week" hide />
        <Tooltip
          content={({ active, payload }) => {
            if (
              active &&
              payload &&
              payload.length >= 0 &&
              payload[0]?.value != null &&
              payload[0]?.payload != null
            ) {
              return (
                <div className="bg-white p-1 shadow-md">
                  {payload[0].payload.name}
                </div>
              );
            }
          }}
        />
        <Bar
          stackId="a"
          type="natural"
          dataKey="miss"
          radius={2}
          fill="hsla(3, 77%, 69%, 1)"
        />
        <Bar type="natural" dataKey="points" radius={2} stackId="a">
          {picksWithPoints.map((pick) => {
            const fillColor = pick.settled
              ? pick.correct
                ? "#27ae60"
                : "hsla(230, 7%, 84%, 0.4)"
              : "hsla(226, 7%, 84%, 1)";
            return <Cell key={pick.id} fill={fillColor} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PickBarChart;
