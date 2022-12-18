import { router, publicProcedure } from "../trpc";
import { getSeason } from "server/sync/season";

export const participantsRouter = router({
  participantsWithScores: publicProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const upcomingGames = await ctx.prisma.footballMatchup.findMany({
      where: {
        season,
        completed: false,
      },
      take: 3,
      orderBy: {
        startDate: "asc",
      },
    });
    const participants = await ctx.prisma.participant.findMany({
      include: {
        seasonScores: {
          where: {
            season,
          },
        },
        picks: {
          where: {
            matchupId: {
              in: upcomingGames.map((m) => m.id),
            },
          },
          orderBy: {
            matchup: {
              startDate: "asc",
            },
          },
          include: {
            team: {
              select: {
                name: true,
                logo: true,
              },
            },
            matchup: {
              select: {
                startDate: true,
              },
            },
          },
        },
      },
    });
    return {
      // Strip out email so we don't leak it to the frontend
      participants: participants.map((p) => ({
        id: p.id,
        name: p.name,
        seasonScores: p.seasonScores,
        picks: p.picks,
      })),
      upcomingGames,
    };
  }),
});
