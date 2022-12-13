import { FootballTeam, type Season } from "@prisma/client";
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

const cleanName = (name: string): string => {
  const cleaned = name.replaceAll('"', "").trim();
  return cleaned.split("/")[0] ?? cleaned;
};

const bowlNameToCandidate = (name: string): string => {
  const lowered = name.toLowerCase();
  return lowered
    .replace("sdccu ", "")
    .replace("hawaii", "hawai'i")
    .replace("gasparill", "gasparilla")
    .replace("cfp semi - ", "");
};

const cleanTeamName = (name: string): string => {
  return cleanName(name)
    .replace(/\(.*\)/, "")
    .replace(/^[0-9]+\./, "")
    .trim()
    .replace("Miami-OH", "Miami (OH)")
    .replace("Southern Miss", "Southern Mississippi")
    .replace("UConn", "Connecticut")
    .replace(/New Mexico St$/, "New Mexico State")
    .replace("UTSA", "UT San Antonio")
    .replace("San Jose", "San José");
};

interface ChampionShipMarker {
  isChampionship: true;
}

const isChampionship = (
  game: GameWithTeam | ChampionShipMarker
): game is ChampionShipMarker => {
  return "isChampionship" in game && game.isChampionship;
};

const findGame = (
  name: string,
  games: readonly GameWithTeam[]
): GameWithTeam | ChampionShipMarker | undefined => {
  const nameCandidate = bowlNameToCandidate(name);
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

  const bowlGameNames = csvLines[0]?.split(",").slice(3).map(cleanName);
  if (!bowlGameNames) {
    return <div>No games</div>;
  }
  const columnsToGames = bowlGameNames.map((game) =>
    findGame(game, props.games)
  );

  const championshipMarkers = columnsToGames.filter(
    (g) => g && isChampionship(g)
  ).length;

  if (championshipMarkers !== 1) {
    return <div>Could not find a championship game column :(</div>;
  }

  const teams = props.games.flatMap((game) => [game.homeTeam, game.awayTeam]);

  // Header row verified, now to verify individual results
  const teamLookups: Record<string, FootballTeam> = {};
  const unknownTeams: string[] = [];
  csvLines.slice(1).forEach((line) => {
    line
      .split(",")
      .slice(3)
      .forEach((team) => {
        // Already cleaned
        if (teamLookups[team]) {
          return;
        }
        const cleanedName = cleanTeamName(team);
        const foundTeam = teams.find((t) => t.name === cleanedName);
        console.log("Team", team, cleanedName);
        if (foundTeam) {
          teamLookups[team] = foundTeam;
        } else {
          unknownTeams.push(team);
        }
      });
  });

  if (unknownTeams.length) {
    return <div>Unknown teams: {unknownTeams.join(" ")}</div>;
  }

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
