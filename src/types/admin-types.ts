import {
  type ParticipantPick,
  type FootballMatchup,
  type FootballTeam,
  type Participant,
  type ParticipantTeam,
  type ParticipantTeamMember,
  type ParticipantSeasonScore,
  type ParticipantChampionshipPick,
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
    participant: Pick<Participant, "id"> & {
      seasonScores: ParticipantSeasonScore[];
    };
  })[];
};

export type PickWithMatchupAndTeam = ParticipantPick & {
  team: FootballTeam;
  matchup: FootballMatchup;
};

export type ChampionshipPickWithTeam = ParticipantChampionshipPick & {
  team: FootballTeam;
};
