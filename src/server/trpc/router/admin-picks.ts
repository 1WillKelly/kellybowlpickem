import { getSeason } from "server/sync/season";
import { router, adminProcedure } from "../trpc";

export const adminPicksRouter = router({
  participantsWithPicks: adminProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const participants = await ctx.prisma.participant.findMany({
      include: {
        picks: {
          where: {
            season,
          },
        },
      },
    });

    return {
      participants,
    };
  }),
});
