import { getSeason } from "server/sync/season";
import { z } from "zod";
import { router, adminProcedure } from "../trpc";

export const adminParticipantsRouter = router({
  participants: adminProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const participants = await ctx.prisma.participant.findMany({
      include: {
        teamMembership: {
          include: {
            team: true,
          },
        },
        picks: {
          where: { season },
          select: { id: true },
        },
        championshipPick: {
          where: { season },
          select: { id: true },
        },
      },
    });

    return {
      participants,
    };
  }),

  upsertParticipant: adminProcedure
    .input(
      z.object({
        participantId: z.string().optional(),
        name: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.participantId) {
        return await ctx.prisma.participant.update({
          where: {
            id: input.participantId,
          },
          data: {
            name: input.name,
            email: input.email,
          },
        });
      }
      return await ctx.prisma.participant.create({
        data: input,
      });
    }),

  deleteParticipant: adminProcedure
    .input(
      z.object({
        participantId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.participant.delete({
        where: {
          id: input.participantId,
        },
      });
    }),
});
