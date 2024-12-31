import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { type RouterOutputs } from "utils/trpc";

interface Props {
  picks: RouterOutputs["picks"]["participantPicks"]["picks"];
  height?: number;
  width?: number;
}

const PickBarChart: React.FC<Props> = ({ picks, height = 60, width = 84 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={picks} width={width}>
        <YAxis hide />
        <XAxis dataKey="week" hide />
        <Bar type="natural" dataKey="settledPoints" radius={2}>
          {picks.map((pick) => {
            const fillColor = pick.settled
              ? pick.correct
                ? "#27ae60"
                : "hsl(0, 100%, 50%)"
              : "hsla(230, 7%, 84%, 0.4)";
            return <Cell key={pick.id} fill={fillColor} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PickBarChart;
