import { z } from "zod";
import { router, adminProcedure } from "../trpc";

export const adminTeamsRouter = router({
  teams: adminProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.participantTeam.findMany({
      include: {
        members: {
          include: {
            participant: true,
          },
        },
      },
    });

    return {
      teams,
    };
  }),

  upsertTeam: adminProcedure
    .input(
      z.object({
        teamId: z.string().optional(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.teamId) {
        return await ctx.prisma.participantTeam.update({
          where: {
            id: input.teamId,
          },
          data: {
            name: input.name,
          },
        });
      }

      return await ctx.prisma.participantTeam.create({
        data: {
          name: input.name,
        },
      });
    }),

  deleteTeam: adminProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.participantTeam.delete({
        where: {
          id: input.teamId,
        },
      });
    }),
});
