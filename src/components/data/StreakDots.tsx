import { type RouterOutputs } from "utils/trpc";

interface Props {
  picks: RouterOutputs["participants"]["participantsWithScores"]["participants"][number]["completedPicks"];
}

const StreakDots: React.FC<Props> = ({ picks }) => {
  const streak = picks.slice(picks.length - 10);

  return (
    <div className="flex flex-shrink-0 flex-row space-x-1">
      {streak.map((pick, idx) => {
        const hideOnMobile = idx < streak.length - 5 ? "hidden sm:block" : "";
        const color = pick.correct ? "bg-green-correct" : "bg-red-incorrect";
        return (
          <div
            key={pick.id}
            className={`h-[6px] w-[6px] rounded-sm ${color} ${hideOnMobile}`}
          />
        );
      })}
    </div>
  );
};

export default StreakDots;
