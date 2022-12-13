import { router } from "../trpc";
import { adminRouter } from "./admin";
import { adminParticipantsRouter } from "./admin-participants";
import { adminPicksRouter } from "./admin-picks";
import { adminTeamsRouter } from "./admin-teams";
import { authRouter } from "./auth";
import { gamesRouter } from "./games";
import { picksRouter } from "./picks";

export const appRouter = router({
  games: gamesRouter,
  auth: authRouter,
  admin: adminRouter,
  picks: picksRouter,
  adminTeams: adminTeamsRouter,
  adminParticipants: adminParticipantsRouter,
  adminPicks: adminPicksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
