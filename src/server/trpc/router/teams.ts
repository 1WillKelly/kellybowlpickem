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
      teams: teams.map((t) => ({
        ...t,
        members: t.members.map((m) => ({
          ...m,
          // Remove email from returned data. Can't use `include` and `select`
          // on prisma sub-queries :(
          participant: {
            id: m.participant.id,
            seasonScores: m.participant.seasonScores,
          },
        })),
      })),
      season,
    };
  }),
});
