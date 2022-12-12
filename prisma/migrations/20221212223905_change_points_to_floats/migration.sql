/*
  Warnings:

  - You are about to alter the column `awayPointValue` on the `FootballMatchup` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `homePointValue` on the `FootballMatchup` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `FootballMatchup` MODIFY `awayPointValue` DOUBLE NULL,
    MODIFY `homePointValue` DOUBLE NULL;
