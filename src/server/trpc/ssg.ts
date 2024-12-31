import { prisma } from "server/db/client";
import { appRouter } from "server/trpc/router/_app";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

export const createSSG = () => {
  return createServerSideHelpers({
    router: appRouter,
    // No session, generated at build time
    ctx: { prisma: prisma, session: null, headers: new Headers() },
    transformer: superjson,
  });
};
