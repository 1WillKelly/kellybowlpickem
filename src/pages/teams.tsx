import { type ParticipantSeasonScore, type Season } from "@prisma/client";
import BigLogoHeader from "components/BigLogoHeader/BigLogoHeader";
import FullScreenLoading from "components/FullScreenLoading";
import Nav from "components/navigation/Nav";
import StandingsTable from "components/table/StandingsTable";
import { type NextPage } from "next";

import Head from "next/head";
import { type TeamWithScores } from "types/admin-types";
import styles from "../styles/Home.module.scss";
import { trpc } from "utils/trpc";

interface TeamSummaryProps {
  season: Season;
  teams: readonly TeamWithScores[];
}

interface TeamSummary extends TeamWithScores {
  teamTotal: number;
  teamAverage: number;
  teamPossibleTotal: number;
}

const getScores = (team: TeamWithScores): ParticipantSeasonScore[] => {
  return team.members.flatMap((m) => {
    return m.participant.seasonScores;
  });
};

const roundFloat = (input: number): number => {
  return Math.round(input * 100) / 100;
};

const TeamSummary: React.FC<TeamSummaryProps> = (props) => {
  const teamSummaries: TeamSummary[] = props.teams
    .map((t) => {
      const scores = getScores(t);
      const teamTotal = scores.map((s) => s.points).reduce((a, b) => a + b, 0);
      const teamAverage = teamTotal / t.members.length;
      const teamPossibleTotal = scores
        .map((s) => s.possiblePoints)
        .reduce((a, b) => a + b, 0);

      return {
        ...t,
        teamTotal,
        teamPossibleTotal,
        teamAverage,
      };
    })
    .sort((a, b) => b.teamAverage - a.teamAverage);

  return (
    <>
      <Head>
        <title>Bowl Pick&apos;em 2022-23</title>
        <meta name="description" content="Kelly Bowl Pick'em 2022-23" />
      </Head>
      <main>
        <Nav />
        <BigLogoHeader />
        <section className={styles["individual-standings"]}>
          <StandingsTable
            loading={false}
            items={teamSummaries}
            columnNames={() => ["Name", "Average Score", "Possible Score"]}
            renderItem={(team) => [
              team.name,
              roundFloat(team.teamAverage),
              roundFloat(team.teamPossibleTotal / team.members.length),
            ]}
          />
        </section>
      </main>
    </>
  );
};

const TeamsPage: NextPage = () => {
  const { data, isLoading } = trpc.teams.teamSummary.useQuery();
  return (
    <>
      <Head>
        <title>Teams - Kelly Bowl Pick&apos;em</title>
      </Head>
      {isLoading ? (
        <FullScreenLoading />
      ) : data?.season && data?.teams ? (
        <TeamSummary season={data.season} teams={data.teams} />
      ) : (
        <div className="text-center">Unable to load teams</div>
      )}
    </>
  );
};

export default TeamsPage;
