import { z } from "zod";
import { createTRPCRouter, publicProcedure, withAuthProcedure } from "../trpc";

export const songRouter = createTRPCRouter({
  getSong: publicProcedure
    .input(
      z.object({
        shouldFetch: z.boolean(),
        profileName: z.string(),
        playlistName: z.string(),
        songName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      //input.shouldFetch makes sure that song only fetches when the modal is actually open
      const song = input.shouldFetch
        ? await ctx.prisma.song.findUnique({
            where: {
              name_playlistName_authorName: {
                authorName: input.profileName,
                name: input.songName,
                playlistName: input.playlistName,
              },
            },
          })
        : undefined;

      return song;
    }),

  getSongs: publicProcedure
    .input(
      z.object({
        profileName: z.string(),
        playlistName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const songs = await ctx.prisma.song.findMany({
        where: {
          authorName: input.profileName,
          playlistName: input.playlistName,
        },
        take: 50,
      });

      return songs;
    }),

  fakeCreateSong: withAuthProcedure
    .input(
      z.object({
        genre: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        pictureUrl: z.string().min(1).url().optional(),
        songUrl: z.string().min(1).url().optional(),
        playlistName: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.song.deleteMany({
        where: {
          description: "yea",
        },
      });
    }),
});
