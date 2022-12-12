import { type FootballMatchup } from "@prisma/client";
import { getSeason } from "server/sync/season";
import { z } from "zod";
import { router, adminProcedure } from "../trpc";

export const adminRouter = router({
  listGames: adminProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const matchups = await ctx.prisma.footballMatchup.findMany({
      orderBy: {
        startDate: "asc",
      },
      where: {
        season,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
    return {
      season,
      matchups,
    };
  }),
  updateGame: adminProcedure
    .input(
      z.object({
        gameId: z.string(),
        homePointValue: z.number().optional(),
        awayPointValue: z.number().optional(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dataToUpdate: Partial<FootballMatchup> = {};
      if (input.name) {
        dataToUpdate.name = input.name;
      }
      if (input.homePointValue) {
        dataToUpdate.homePointValue = input.homePointValue;
      }
      if (input.awayPointValue) {
        dataToUpdate.awayPointValue = input.homePointValue;
      }
      return await ctx.prisma.footballMatchup.update({
        where: {
          id: input.gameId,
        },
        data: dataToUpdate,
      });
    }),
  participants: adminProcedure.query(async ({ ctx }) => {
    const participants = await ctx.prisma.participant.findMany({
      include: {
        teamMembership: {
          include: {
            team: true,
          },
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
