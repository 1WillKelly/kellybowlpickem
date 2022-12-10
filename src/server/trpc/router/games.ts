import { router, publicProcedure } from "../trpc";
import { getSeason } from "server/sync/season";

export const gamesRouter = router({
  bowlGames: publicProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const games = await ctx.prisma.footballMatchup.findMany({
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
      games,
    };
  }),
});
