import { router, publicProcedure } from "../trpc";
import { getSeason } from "server/sync/season";

export const participantsRouter = router({
  allParticipants: publicProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const participants = await ctx.prisma.participant.findMany();
    return {
      participants,
    };
  }),
});
