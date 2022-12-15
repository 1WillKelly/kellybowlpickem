import { router, publicProcedure } from "../trpc";
import { getSeason } from "server/sync/season";

export const participantsRouter = router({
  participantsWithScores: publicProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const participants = await ctx.prisma.participant.findMany({
      include: {
        seasonScores: {
          where: {
            season,
          }
        }
      }
    });
    return {
      // Strip out email so we don't leak it to the frontend
      participants: participants.map((p) => ({
        id: p.id,
        name: p.name,
        seasonScores: p.seasonScores,
      })),
    };
  }),
});
