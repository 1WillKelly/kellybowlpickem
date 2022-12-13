import { type ParticipantSeasonScore, type Season } from "@prisma/client";
import FullScreenLoading from "components/FullScreenLoading";
import { type NextPage } from "next";

import Head from "next/head";
import { type TeamWithScores } from "types/admin-types";
import { trpc } from "utils/trpc";

interface TeamSummaryProps {
  season: Season;
  teams: readonly TeamWithScores[];
}

interface TeamSummary extends TeamWithScores {
  teamTotal: number;
  teamPossibleTotal: number;
}

const getScores = (team: TeamWithScores): ParticipantSeasonScore[] => {
  return team.members.flatMap((m) => {
    return m.participant.seasonScores;
  });
};

const TeamSummary: React.FC<TeamSummaryProps> = (props) => {
  const teamSummaries: TeamSummary[] = props.teams
    .map((t) => {
      const scores = getScores(t);
      const teamTotal = scores.map((s) => s.points).reduce((a, b) => a + b, 0);
      const teamPossibleTotal = scores
        .map((s) => s.possiblePoints)
        .reduce((a, b) => a + b, 0);

      return {
        ...t,
        teamTotal,
        teamPossibleTotal,
      };
    })
    .sort((a, b) => b.teamTotal - a.teamTotal);

  return (
    <div>
      <h1 className="text-xl">
        Team Standings &mdash; {props.season.displayName}
      </h1>
      <div className="mt-4 flex flex-col space-y-4">
        <div className="grid grid-cols-3">
          <div>Name</div>
          <div>Average Score</div>
          <div>Possible Score</div>
        </div>
        {teamSummaries.map((team) => {
          return (
            <div key={team.id} className="grid grid-cols-3">
              <div>{team.name}</div>
              <div>{team.teamTotal / team.members.length}</div>
              <div>{team.teamPossibleTotal / team.members.length}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TeamsPage: NextPage = () => {
  const { data, isLoading } = trpc.teams.teamSummary.useQuery();
  return (
    <>
      <Head>
        <title>Teams - Kelly Bowl Pick&apos;em</title>
      </Head>
      <div>
        {isLoading ? (
          <FullScreenLoading />
        ) : data?.season && data?.teams ? (
          <TeamSummary season={data.season} teams={data.teams} />
        ) : (
          <div className="text-center">Unable to load teams</div>
        )}
      </div>
    </>
  );
};

export default TeamsPage;
