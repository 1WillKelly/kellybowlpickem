/*
  Warnings:

  - Added the required column `completed` to the `FootballMatchup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FootballMatchup` ADD COLUMN `awayPointValue` INTEGER NULL,
    ADD COLUMN `awayScore` INTEGER NULL,
    ADD COLUMN `completed` BOOLEAN NOT NULL,
    ADD COLUMN `homePointValue` INTEGER NULL,
    ADD COLUMN `homeScore` INTEGER NULL;

-- AlterTable
ALTER TABLE `FootballTeam` ADD COLUMN `conference` VARCHAR(191) NULL;
