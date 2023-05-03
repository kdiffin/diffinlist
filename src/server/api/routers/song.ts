import { z } from "zod";
import { createTRPCRouter, publicProcedure, withAuthProcedure } from "../trpc";

export const songRouter = createTRPCRouter({
  getSong: publicProcedure
    .input(
      z.object({
        profileName: z.string(),
        playlistName: z.string(),
        songName: z.string(),
      })
    )
    .query(async ({ ctx }) => {
      ctx.prisma.song.deleteMany({ where: { name: "k" } });
    }),

  getSongs: publicProcedure
    .input(
      z.object({
        profileName: z.string(),
        playlistName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      ctx.prisma.song.findMany({
        where: {
          authorName: input.profileName,
          playlistName: input.playlistName,
        },
      });
    }),
});
