import { type Season } from "@prisma/client";
import {
  type ParticipantWithPicks,
  type GameWithTeam,
} from "types/admin-types";

interface CSVPickImportProps {
  csvData: string;
  games: readonly GameWithTeam[];
  season: Season;
  participants: readonly ParticipantWithPicks[];
}

const cleanBowlName = (name: string): string => {
  const cleaned = name.replaceAll('"', "").trim();
  return cleaned.split("/")[0] ?? cleaned;
};

const nameToCandidate = (name: string): string => {
  const lowered = name.toLowerCase();
  return lowered
    .replace("sdccu ", "")
    .replace("hawaii", "hawai'i")
    .replace("gasparill", "gasparilla")
    .replace("cfp semi - ", "");
};

interface ChampionShipMarker {
  isChampionship: true;
}

const findGame = (
  name: string,
  games: readonly GameWithTeam[]
): GameWithTeam | ChampionShipMarker | undefined => {
  const nameCandidate = nameToCandidate(name);
  const found = games.find((game) =>
    game.name?.toLowerCase().includes(nameCandidate)
  );
  if (found) {
    return found;
  }

  if (nameCandidate.includes("championship")) {
    return { isChampionship: true };
  }

  return undefined;
};

const CSVPickImport: React.FC<CSVPickImportProps> = (props) => {
  const csvLines = props.csvData.split("\n");

  if (csvLines.length < 2) {
    return (
      <div className="text-red-600">
        CSV doesn&apos;t have enough rows ({csvLines.length})
      </div>
    );
  }

  const bowlGameNames = csvLines[0]?.split(",").slice(3).map(cleanBowlName);
  if (!bowlGameNames) {
    return <div>No games</div>;
  }
  const columnsToGames = bowlGameNames.map((game) =>
    findGame(game, props.games)
  );

  const championshipMarkers = columnsToGames.filter(
    (g) => g && "isChampionship" in g && g.isChampionship
  ).length;

  if (championshipMarkers !== 1) {
    return <div>Could not find a championship game column :(</div>;
  }

  // BIG FAT TODO
  return (
    <div className="flex flex-col">
      {bowlGameNames.map((name, idx) => {
        const foundGame = findGame(name, props.games);
        return (
          <div key={idx}>
            <div
              className={`inline-flex ${
                foundGame ? "bg-zinc-700" : "bg-red-600"
              } text-white`}
            >
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CSVPickImport;
