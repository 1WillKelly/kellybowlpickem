import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { type RouterOutputs } from "utils/trpc";

interface Props {
  picks: RouterOutputs["participants"]["participantsWithScores"]["participants"][number]["completedPicks"];
  height?: number;
  width?: number;
}

const PickBarChart: React.FC<Props> = ({ picks, height = 36, width = 84 }) => {
  const saturation = 82;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={picks.slice(picks.length - 10)} width={width}>
        <YAxis hide />
        <XAxis dataKey="week" hide />
        <Bar
          type="natural"
          dataKey="settledPoints"
          strokeWidth={1.5}
          fill={`hsl(32, ${saturation}%, 58.4%)`}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PickBarChart;
