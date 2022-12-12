import { getSeason } from "server/sync/season";
import { router, adminProcedure } from "../trpc";

export const adminRouter = router({
  listGames: adminProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    return ctx.prisma.footballMatchup.findMany({
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
  }),
  whoAmI: adminProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});
