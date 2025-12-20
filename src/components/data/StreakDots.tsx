import { type RouterOutputs } from "utils/trpc";

interface Props {
  picks: RouterOutputs["participants"]["participantsWithScores"]["participants"][number]["completedPicks"];
}

const StreakDots: React.FC<Props> = ({ picks }) => {
  const streak = picks.slice(-10);

  return (
    <div className="flex flex-shrink-0 flex-row space-x-[2px] sm:space-x-[3px]">
      {streak.map((pick, idx) => {
        const hideOnMobile = idx < streak.length - 5 ? "hidden sm:block" : "";
        const color = pick.correct ? "bg-green-correct" : "bg-red-incorrect";
        return (
          <div
            key={pick.id}
            className={`h-[5px] w-[5px] sm:h-[6px] sm:w-[6px] rounded-sm ${color} ${hideOnMobile}`}
            aria-label={pick.team.name}
          />
        );
      })}
    </div>
  );
};

export default StreakDots;
