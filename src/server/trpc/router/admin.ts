import { type FootballMatchup } from "@prisma/client";
import { syncScores } from "server/sync/scores";
import { getSeason, syncBowlGames } from "server/sync/season";
import { z } from "zod";
import { router, adminProcedure } from "../trpc";

export const adminRouter = router({
  isAdmin: adminProcedure.query(() => {
    return { ok: true };
  }),
  syncGames: adminProcedure.mutation(async () => {
    return await syncBowlGames();
  }),
  syncScores: adminProcedure.mutation(async () => {
    return await syncScores();
  }),
  listGames: adminProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const matchups = await ctx.prisma.footballMatchup.findMany({
      orderBy: {
        startDate: "asc",
      },
      where: {
        season,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
    return {
      season,
      matchups,
    };
  }),
  updateGame: adminProcedure
    .input(
      z.object({
        gameId: z.string(),
        homePointValue: z.number().optional(),
        awayPointValue: z.number().optional(),
        name: z.string().optional(),
        isChampionship: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dataToUpdate: Partial<FootballMatchup> = {};
      if (input.name) {
        dataToUpdate.name = input.name;
      }
      if (input.homePointValue) {
        dataToUpdate.homePointValue = input.homePointValue;
      }
      if (input.awayPointValue) {
        dataToUpdate.awayPointValue = input.awayPointValue;
      }
      if (input.isChampionship !== undefined) {
        dataToUpdate.isChampionship = input.isChampionship;
      }
      return await ctx.prisma.footballMatchup.update({
        where: {
          id: input.gameId,
        },
        data: dataToUpdate,
      });
    }),
});
