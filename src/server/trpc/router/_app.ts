import { router } from "../trpc";
import { authRouter } from "./auth";
import { gamesRouter } from "./games";

export const appRouter = router({
  games: gamesRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
