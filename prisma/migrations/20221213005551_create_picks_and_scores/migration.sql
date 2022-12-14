-- CreateTable
CREATE TABLE `ParticipantPick` (
    `id` VARCHAR(191) NOT NULL,
    `seasonId` VARCHAR(191) NOT NULL,
    `participantId` VARCHAR(191) NOT NULL,
    `matchupId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `settled` BOOLEAN NOT NULL DEFAULT false,
    `correct` BOOLEAN NULL,
    `settledPoints` DOUBLE NULL,

    INDEX `ParticipantPick_participantId_idx`(`participantId`),
    INDEX `ParticipantPick_matchupId_idx`(`matchupId`),
    INDEX `ParticipantPick_seasonId_idx`(`seasonId`),
    INDEX `ParticipantPick_teamId_idx`(`teamId`),
    UNIQUE INDEX `ParticipantPick_participantId_matchupId_key`(`participantId`, `matchupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParticipantSeasonScore` (
    `id` VARCHAR(191) NOT NULL,
    `participantId` VARCHAR(191) NOT NULL,
    `seasonId` VARCHAR(191) NOT NULL,
    `points` DOUBLE NOT NULL DEFAULT 0,
    `possiblePoints` DOUBLE NOT NULL DEFAULT 0,

    INDEX `ParticipantSeasonScore_participantId_idx`(`participantId`),
    INDEX `ParticipantSeasonScore_seasonId_idx`(`seasonId`),
    UNIQUE INDEX `ParticipantSeasonScore_participantId_seasonId_key`(`participantId`, `seasonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
