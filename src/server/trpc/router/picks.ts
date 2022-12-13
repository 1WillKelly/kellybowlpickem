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
        where: {
          season,
          participantId: input.participantId,
        },
        include: {
          team: true,
          matchup: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        participant,
        picks,
      };
    }),
});
