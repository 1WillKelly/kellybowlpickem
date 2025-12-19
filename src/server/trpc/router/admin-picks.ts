import { getSeason } from "server/sync/season";
import { z } from "zod";
import { router, adminProcedure } from "../trpc";

export const adminPicksRouter = router({
  participantsWithPicks: adminProcedure.query(async ({ ctx }) => {
    const season = await getSeason();
    const participants = await ctx.prisma.participant.findMany({
      include: {
        picks: {
          where: {
            season,
          },
        },
      },
    });

    return {
      participants,
    };
  }),

  submitPicks: adminProcedure
    .input(
      z
        .object({
          participantId: z.string(),
          picks: z
            .object({
              matchupId: z.string().optional(),
              teamId: z.string(),
              isChampionship: z.boolean().optional(),
            })
            .array(),
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      const { id: seasonId } = await getSeason();
      const championshipsToCreate: {
        participantId: string;
        teamId: string;
        seasonId: string;
      }[] = [];
      const picksToCreate: {
        seasonId: string;
        participantId: string;
        teamId: string;
        matchupId: string;
      }[] = [];
      input.forEach(({ participantId, picks }) => {
        picks.forEach((pick) => {
          if (pick.isChampionship) {
            championshipsToCreate.push({
              seasonId,
              participantId,
              teamId: pick.teamId,
            });
          } else {
            if (!pick.matchupId) {
              throw new Error(
                "Non-championship game is missing matchup ID: " + pick
              );
            }
            picksToCreate.push({
              participantId,
              seasonId,
              matchupId: pick.matchupId,
              teamId: pick.teamId,
            });
          }
        });
      });

      // Check for duplicate participantId/matchupId pairs
      const pickKeys = new Set<string>();
      const duplicates: string[] = [];
      picksToCreate.forEach((pick) => {
        const key = `${pick.participantId}:${pick.matchupId}`;
        if (pickKeys.has(key)) {
          duplicates.push(key);
        }
        pickKeys.add(key);
      });

      if (duplicates.length > 0) {
        throw new Error(
          `Duplicate picks found for participantId:matchupId pairs: ${duplicates.join(", ")}`
        );
      }

      await ctx.prisma.participantPick.createMany({
        data: picksToCreate,
      });
      await ctx.prisma.participantChampionshipPick.createMany({
        data: championshipsToCreate,
      });
    }),
});
