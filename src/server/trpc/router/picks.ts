import { router, publicProcedure } from "../trpc";
import { getSeason } from "server/sync/season";
import { z } from "zod";

export const picksRouter = router({
  participantPicks: publicProcedure
    .input(
      z.object({
        participantId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const season = await getSeason();
      const participant = await ctx.prisma.participant.findUniqueOrThrow({
        where: {
          id: input.participantId,
        },
        select: {
          name: true,
        },
      });
      const picks = await ctx.prisma.participantPick.findMany({
        orderBy: {
          matchup: {
            startDate: "asc",
          },
        },
        where: {
          season,
          participantId: input.participantId,
        },
        include: {
          team: true,
          matchup: {
            include: {
              homeTeam: true,
              awayTeam: true,
            },
          },
        },
      });

      const championshipPick =
        await ctx.prisma.participantChampionshipPick.findMany({
          where: {
            season,
            participantId: input.participantId,
          },
          include: {
            team: true,
          },
        });

      return {
        season,
        championshipPick,
        participant,
        picks,
      };
    }),
});
