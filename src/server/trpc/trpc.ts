import { initTRPC, TRPCError } from "@trpc/server";
import { env } from "env/server.mjs";
import { getServerAuthSessionApp } from "server/common/get-server-auth-session";
import superjson from "superjson";

import { type Context } from "./context";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSessionApp();

  return {
    prisma,
    session,
    ...opts,
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const ADMIN_ALLOWED_EMAILS = env.ADMIN_ALLOWED_EMAILS
  ? env.ADMIN_ALLOWED_EMAILS.split(",")
  : [];

const requireAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const isAdmin =
    // Skip email allowlist in dev
    (process.env.NODE_ENV === "development" &&
      ADMIN_ALLOWED_EMAILS.length === 0) ||
    (ctx.session.user.email &&
      ADMIN_ALLOWED_EMAILS.includes(ctx.session.user.email));

  if (!isAdmin) {
    console.error("Non-admin tried to access: ", ctx.session.user.email);
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Admin procedure
 **/
export const adminProcedure = t.procedure.use(isAuthed).use(requireAdmin);
