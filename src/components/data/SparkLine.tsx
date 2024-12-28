import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { type RouterOutputs } from "utils/trpc";

interface Props {
  picks: RouterOutputs["participants"]["participantsWithScores"]["participants"][number]["completedPicks"];
  height?: number;
  width?: number;
}

const SparkLine: React.FC<Props> = ({ picks, height = 36, width = 84 }) => {
  const saturation = 82;
  // Cumulative sum of picks
  const cumulativePicks = picks.reduce((acc, pick, i) => {
    const prev = acc[i - 1]?.settledPoints ?? 0;
    acc.push({ ...pick, settledPoints: (pick.settledPoints ?? 0) + prev });
    return acc;
  }, [] as typeof picks);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={cumulativePicks} width={width}>
        <YAxis hide />
        <XAxis dataKey="week" hide />
        <Line
          type="natural"
          dataKey="settledPoints"
          strokeWidth={1.5}
          dot={false}
          stroke={`hsl(32, ${saturation}%, 58.4%)`}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparkLine;
