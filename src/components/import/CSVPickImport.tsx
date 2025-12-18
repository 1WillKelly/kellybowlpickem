import { type FootballTeam, type Season } from "@prisma/client";
import Button from "components/Button";
import { useState } from "react";
import {
  type ParticipantWithPicks,
  type GameWithTeam,
} from "types/admin-types";
import { trpc } from "utils/trpc";

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

  // Strip out sponsor names and normalize bowl names for 2025-26 season
  const cleaned = lowered
    // Legacy replacements
    .replace("sdccu ", "")
    .replace("bowl of beans", "bowl")
    .replace("hawaii", "hawai'i")
    .replace("hawai'i", "hawaiʻi")
    .replace("hawaiê»i", "hawaiʻi")
    .replace("cfp semi - ", "")
    // 2025-26 sponsor removals
    .replace("bucked up ", "")
    .replace(" hosted by gronk", "")
    .replace("is4s ", "")
    .replace("staffdna ", "")
    .replace("xbox ", "")
    .replace("famous ", "")
    .replace("bush's ", "")
    .replace(" of beans", "")
    .replace("scooter's coffee ", "")
    .replace("sheraton ", "")
    .replace("gameabove sports ", "")
    .replace("servpro ", "")
    .replace("rate ", "")
    .replace("go bowling ", "")
    .replace("bad boy mowers ", "")
    .replace("wasabi ", "")
    .replace("pop-tarts ", "")
    .replace("snoop dogg ", "")
    .replace("isleta ", "")
    .replace("taxslayer ", "")
    .replace("kinder's ", "")
    .replace("jlab ", "")
    .replace("radiance technologies ", "")
    .replace("liberty mutual ", "")
    .replace("valero ", "")
    .replace("reliaquest ", "")
    .replace("tony the tiger ", "")
    .replace("cheez-it ", "")
    .replace("srs distribution ", "")
    .replace("goodyear ", "")
    .replace("capital one ", "")
    .replace("prudential ", "")
    .replace("allstate ", "")
    .replace("lockheed martin ", "")
    .replace("autozone ", "")
    .replace("trust & will ", "")
    .replace("duke's mayo ", "")
    .replace("vrbo ", "")
    .replace("chick-fil-a ", "");

  return cleaned;
};

const cleanTeamName = (name: string): string => {
  return cleanName(name)
    .replace(/\(.*\)/, "")
    .replace(/^[0-9]+\./, "")
    .trim()
    .replace("Miami-OH", "Miami (OH)")
    .replace(/New Mexico St$/, "New Mexico State")
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

const PICK_COLUMN_START = 3;

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
  const [submitted, setSubmitted] = useState(false);
  const submitPicks = trpc.adminPicks.submitPicks.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  if (submitted) {
    return <div>All done with import</div>;
  }

  const csvLines = props.csvData.split("\n");

  if (csvLines.length < 2) {
    return (
      <div className="text-red-600">
        CSV doesn&apos;t have enough rows ({csvLines.length})
      </div>
    );
  }

  const bowlGameNames = csvLines[0]
    ?.split(",")
    .slice(PICK_COLUMN_START)
    .map(cleanName);
  if (!bowlGameNames) {
    return <div>No games</div>;
  }
  const columnsToGames = bowlGameNames.map((game) =>
    findGame(game, props.games)
  );

  const missingGames = columnsToGames
    .map((game, idx) => {
      if (!game) {
        return bowlGameNames[idx];
      }
    })
    .filter(Boolean);
  if (missingGames.length) {
    return (
      <div>
        No matchup on record for games:
        <ul>
          {missingGames.map((game, idx) => (
            <li key={idx}>{game}</li>
          ))}
        </ul>
      </div>
    );
  }

  // TODO: We currently can't upload championship picks because the
  // `FootballTeam`s don't exist in the DB yet. Remove this requirement for now.
  // const championshipMarkers = columnsToGames.filter(
  //   (g) => g && isChampionship(g)
  // ).length;
  //
  // if (championshipMarkers !== 1) {
  //   return <div>Could not find a championship game column :(</div>;
  // }

  const teams = props.games.flatMap((game) => [game.homeTeam, game.awayTeam]);

  // Header row verified, now to verify individual results
  const teamLookups: Record<string, FootballTeam> = {};
  const unknownTeams: string[] = [];
  csvLines.slice(1).forEach((line) => {
    line
      .split(",")
      .slice(PICK_COLUMN_START)
      .forEach((team) => {
        if (teamLookups[team]) {
          return;
        }
        const cleanedName = cleanTeamName(team);
        const foundTeam = teams.find((t) => t.name === cleanedName);
        if (foundTeam) {
          teamLookups[team] = foundTeam;
        } else {
          unknownTeams.push(cleanedName);
        }
      });
  });

  if (unknownTeams.length) {
    return <div>Unknown teams: {unknownTeams.join(" ")}</div>;
  }

  const nonParticipantEmails: string[] = [];

  const participantsAlreadySubmitted: string[] = [];

  const participantPicks: {
    participantId: string;
    email: string;
    picks: { matchupId?: string; teamId: string; isChampionship?: boolean }[];
  }[] = [];

  csvLines.slice(1).forEach((line) => {
    if (line.trim() === "") {
      return;
    }
    const parts = line.split(",");
    if (parts.length < 4) {
      throw new Error("Invalid line: " + line);
    }
    const email = cleanName(parts[1] ?? "");
    if (!email) {
      throw new Error("Invalid email: " + line);
    }
    const matchingParticipant = props.participants.find(
      (p) => p.email === email
    );
    if (!matchingParticipant) {
      nonParticipantEmails.push(email);
      return;
    }

    const picks = line
      .split(",")
      .slice(PICK_COLUMN_START)
      .map((teamName, idx) => {
        const matchup = columnsToGames[idx];
        if (!matchup) {
          throw new Error("Missing matchup: " + teamName + " for index " + idx);
        }
        const team = teamLookups[teamName];
        if (!team) {
          throw new Error("Participant team not found: " + teamName);
        }

        const isChampPick = isChampionship(matchup);
        return {
          teamId: team.id,
          matchupId: isChampPick ? undefined : matchup.id,
          isChampionship: isChampPick ? true : undefined,
        };
      })
      .filter((pick) => {
        const existingMatchup = matchingParticipant.picks.find(
          (p) => p.matchupId === pick.matchupId
        );
        return !existingMatchup;
      });

    participantPicks.push({
      participantId: matchingParticipant.id,
      email: matchingParticipant.email,
      picks,
    });
  });

  if (nonParticipantEmails.length) {
    return (
      <div>Missing participants by email: {nonParticipantEmails.join(" ")}</div>
    );
  }

  return (
    <div className="mt-2 flex flex-col overflow-scroll">
      {participantsAlreadySubmitted.length > 0 && (
        <div>
          <div className="text-lg">
            The following users were previously imported and will be ignored
          </div>
          <div className="text-red mt-4">
            {participantsAlreadySubmitted.map((email, idx) => (
              <div key={idx}>{email}</div>
            ))}
          </div>
        </div>
      )}
      {participantPicks.length > 0 && (
        <>
          <div className="mb-2 text-lg">Ready to import</div>
          {participantPicks.map(({ participantId, email }) => {
            return (
              <div key={participantId} className="flex flex-row space-x-2">
                <div className="inline-flex">{email}</div>
              </div>
            );
          })}

          <Button
            className="mt-4"
            onClick={() => submitPicks.mutate(participantPicks)}
          >
            Import it!
          </Button>
        </>
      )}
    </div>
  );
};

export default CSVPickImport;
