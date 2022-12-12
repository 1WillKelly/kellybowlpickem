import { router, adminProcedure } from "../trpc";

export const adminRouter = router({
  whoAmI: adminProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});
