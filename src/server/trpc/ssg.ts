import { prisma } from "server/db/client";
import { appRouter } from "server/trpc/router/_app";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

export const createSSG = () => {
  return createProxySSGHelpers({
    router: appRouter,
    // No session, generated at build time
    ctx: { prisma: prisma, session: null },
    transformer: superjson,
  });
};
