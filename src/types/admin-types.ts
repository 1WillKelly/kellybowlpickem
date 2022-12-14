import {
  type ParticipantPick,
  type FootballMatchup,
  type FootballTeam,
  type Participant,
  type ParticipantTeam,
  type ParticipantTeamMember,
  type ParticipantSeasonScore,
} from "@prisma/client";

export type GameWithTeam = FootballMatchup & {
  homeTeam: FootballTeam;
  awayTeam: FootballTeam;
};

export type ParticipantWithTeam = Participant & {
  teamMembership:
    | (ParticipantTeamMember & {
        team: ParticipantTeam;
      })
    | null;
};

export type TeamWithParticipants = ParticipantTeam & {
  members: (ParticipantTeamMember & {
    participant: Participant;
  })[];
};

export type ParticipantWithPicks = Participant & {
  picks: ParticipantPick[];
};

export type TeamWithScores = ParticipantTeam & {
  members: (ParticipantTeamMember & {
    participant: Participant & {
      seasonScores: ParticipantSeasonScore[];
    };
  })[];
};

export type PickWithMatchupAndTeam = ParticipantPick & {
  team: FootballTeam;
  matchup: Pick<FootballMatchup, "id" | "name" | "startDate" | "completed">;
};
