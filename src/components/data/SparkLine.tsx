import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type RouterOutputs } from "utils/trpc";

interface Props {
  picks: RouterOutputs["participants"]["participantsWithScores"]["participants"][number]["completedPicks"];
  height?: number;
  width?: number;
}

const SparkLine: React.FC<Props> = ({ picks, height = 36, width = 84 }) => {
  const saturation = 75;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={picks} width={width}>
        <YAxis hide />
        <XAxis dataKey="week" hide />
        <Tooltip
          cursor={false}
          content={({ active, payload }) => {
            if (
              active &&
              payload &&
              payload.length >= 0 &&
              payload[0]?.value != null
            ) {
              return (
                <div className="bg-black p-1 shadow-md">
                  {payload[0]?.value as number}
                </div>
              );
            }
          }}
        />
        <Line
          type="natural"
          dataKey="balance"
          strokeWidth={1.5}
          dot={false}
          stroke={`hsl(175, ${saturation}%, 32%)`}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparkLine;
