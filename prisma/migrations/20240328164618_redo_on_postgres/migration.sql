-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballTeam" (
    "id" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conference" TEXT,
    "logo" TEXT,

    CONSTRAINT "FootballTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballMatchup" (
    "id" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "week" INTEGER NOT NULL,
    "seasonType" TEXT NOT NULL,
    "name" TEXT,
    "seasonId" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "isChampionship" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "tvChannel" TEXT,
    "homePointValue" DOUBLE PRECISION,
    "awayPointValue" DOUBLE PRECISION,

    CONSTRAINT "FootballMatchup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ParticipantTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantTeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "ParticipantTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantPick" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "matchupId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "settled" BOOLEAN NOT NULL DEFAULT false,
    "correct" BOOLEAN,
    "settledPoints" DOUBLE PRECISION,

    CONSTRAINT "ParticipantPick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantChampionshipPick" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "ParticipantChampionshipPick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipantSeasonScore" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "possiblePoints" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ParticipantSeasonScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Season_year_key" ON "Season"("year");

-- CreateIndex
CREATE UNIQUE INDEX "FootballTeam_apiId_key" ON "FootballTeam"("apiId");

-- CreateIndex
CREATE INDEX "FootballMatchup_seasonId_idx" ON "FootballMatchup"("seasonId");

-- CreateIndex
CREATE INDEX "FootballMatchup_homeTeamId_idx" ON "FootballMatchup"("homeTeamId");

-- CreateIndex
CREATE INDEX "FootballMatchup_awayTeamId_idx" ON "FootballMatchup"("awayTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "FootballMatchup_apiId_key" ON "FootballMatchup"("apiId");

-- CreateIndex
CREATE INDEX "Participant_userId_idx" ON "Participant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_userId_key" ON "Participant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantTeam_name_key" ON "ParticipantTeam"("name");

-- CreateIndex
CREATE INDEX "ParticipantTeamMember_teamId_idx" ON "ParticipantTeamMember"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantTeamMember_participantId_key" ON "ParticipantTeamMember"("participantId");

-- CreateIndex
CREATE INDEX "ParticipantPick_participantId_idx" ON "ParticipantPick"("participantId");

-- CreateIndex
CREATE INDEX "ParticipantPick_matchupId_idx" ON "ParticipantPick"("matchupId");

-- CreateIndex
CREATE INDEX "ParticipantPick_seasonId_idx" ON "ParticipantPick"("seasonId");

-- CreateIndex
CREATE INDEX "ParticipantPick_teamId_idx" ON "ParticipantPick"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantPick_participantId_matchupId_key" ON "ParticipantPick"("participantId", "matchupId");

-- CreateIndex
CREATE INDEX "ParticipantChampionshipPick_participantId_idx" ON "ParticipantChampionshipPick"("participantId");

-- CreateIndex
CREATE INDEX "ParticipantChampionshipPick_seasonId_idx" ON "ParticipantChampionshipPick"("seasonId");

-- CreateIndex
CREATE INDEX "ParticipantChampionshipPick_teamId_idx" ON "ParticipantChampionshipPick"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantChampionshipPick_participantId_seasonId_key" ON "ParticipantChampionshipPick"("participantId", "seasonId");

-- CreateIndex
CREATE INDEX "ParticipantSeasonScore_participantId_idx" ON "ParticipantSeasonScore"("participantId");

-- CreateIndex
CREATE INDEX "ParticipantSeasonScore_seasonId_idx" ON "ParticipantSeasonScore"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantSeasonScore_participantId_seasonId_key" ON "ParticipantSeasonScore"("participantId", "seasonId");
