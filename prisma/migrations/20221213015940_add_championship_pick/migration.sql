-- CreateTable
CREATE TABLE `ParticipantChampionshipPick` (
    `id` VARCHAR(191) NOT NULL,
    `seasonId` VARCHAR(191) NOT NULL,
    `participantId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,

    INDEX `ParticipantChampionshipPick_participantId_idx`(`participantId`),
    INDEX `ParticipantChampionshipPick_seasonId_idx`(`seasonId`),
    INDEX `ParticipantChampionshipPick_teamId_idx`(`teamId`),
    UNIQUE INDEX `ParticipantChampionshipPick_participantId_seasonId_key`(`participantId`, `seasonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
