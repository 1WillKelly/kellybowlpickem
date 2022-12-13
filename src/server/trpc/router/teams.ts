import { router, publicProcedure } from "../trpc";
import { getSeason } from "server/sync/season";

export const teamsRouter = router({
  teamSummary: publicProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const teams = await ctx.prisma.participantTeam.findMany({
      include: {
        members: {
          include: {
            participant: {
              include: {
                seasonScores: {
                  where: { season },
                },
              },
            },
          },
        },
      },
    });
    return {
      teams,
      season,
    };
  }),
});
