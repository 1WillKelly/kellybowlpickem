import { type RouterOutputs } from "utils/trpc";

interface Props {
  picks: RouterOutputs["participants"]["participantsWithScores"]["participants"][number]["completedPicks"];
}

const StreakDots: React.FC<Props> = ({ picks }) => {
  return (
    <div className="flex flex-shrink-0 flex-row space-x-1">
      {picks.slice(picks.length - 10).map((pick) => {
        const color = pick.correct ? "bg-green-correct" : "bg-red-incorrect";
        return (
          <div
            key={pick.id}
            className={`h-[6px] w-[6px] rounded-sm ${color}`}
          />
        );
      })}
    </div>
  );
};

export default StreakDots;
