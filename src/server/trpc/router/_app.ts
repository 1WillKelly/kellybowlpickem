import { router } from "../trpc";
import { adminRouter } from "./admin";
import { adminParticipantsRouter } from "./admin-participants";
import { adminTeamsRouter } from "./admin-teams";
import { authRouter } from "./auth";
import { gamesRouter } from "./games";

export const appRouter = router({
  games: gamesRouter,
  auth: authRouter,
  admin: adminRouter,
  adminTeams: adminTeamsRouter,
  adminParticipants: adminParticipantsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
