import {
  type FootballMatchup,
  type FootballTeam,
  type Participant,
  type ParticipantTeam,
  type ParticipantTeamMember,
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
