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
    .query(async ({ ctx, input }) => {
      const song = await ctx.prisma.song.findUnique({
        where: {
          name_playlistName_authorName: {
            authorName: input.profileName,
            name: input.songName,
            playlistName: input.playlistName,
          },
        },
      });

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
        genre: z.string().min(1),
        name: z.string().min(1),
        pictureUrl: z.string().min(1).url(),
        songUrl: z.string().min(1).url(),
        playlistName: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      ctx.prisma.song.create({
        data: {
          genre: input.genre,
          authorName: ctx.username,
          playlistName: input.playlistName,
          name: input.name,
          pictureUrl: input.pictureUrl,
          songUrl: input.songUrl,
        },
      });
    }),
});
