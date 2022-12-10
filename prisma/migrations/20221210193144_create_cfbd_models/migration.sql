-- CreateTable
CREATE TABLE `Season` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Season_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FootballTeam` (
    `id` VARCHAR(191) NOT NULL,
    `apiId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FootballTeam_apiId_key`(`apiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FootballMatchup` (
    `id` VARCHAR(191) NOT NULL,
    `apiId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `week` INTEGER NOT NULL,
    `seasonType` VARCHAR(191) NOT NULL,
    `seasonId` VARCHAR(191) NOT NULL,
    `homeTeamId` VARCHAR(191) NOT NULL,
    `awayTeamId` VARCHAR(191) NOT NULL,

    INDEX `FootballMatchup_seasonId_idx`(`seasonId`),
    INDEX `FootballMatchup_homeTeamId_idx`(`homeTeamId`),
    INDEX `FootballMatchup_awayTeamId_idx`(`awayTeamId`),
    UNIQUE INDEX `FootballMatchup_apiId_key`(`apiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Participant` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `Participant_userId_idx`(`userId`),
    UNIQUE INDEX `Participant_email_key`(`email`),
    UNIQUE INDEX `Participant_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParticipantTeam` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ParticipantTeam_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParticipantTeamMember` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `participantId` VARCHAR(191) NOT NULL,

    INDEX `ParticipantTeamMember_teamId_idx`(`teamId`),
    UNIQUE INDEX `ParticipantTeamMember_participantId_key`(`participantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Account_userId_idx` ON `Account`(`userId`);

-- CreateIndex
CREATE INDEX `Session_userId_idx` ON `Session`(`userId`);
