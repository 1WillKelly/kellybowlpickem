import { router } from "../trpc";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import { gamesRouter } from "./games";

export const appRouter = router({
  games: gamesRouter,
  auth: authRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
