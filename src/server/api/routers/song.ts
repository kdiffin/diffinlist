import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { songValidate } from "~/server/helpers/zodTypes";
import { createTRPCRouter, publicProcedure, withAuthProcedure } from "../trpc";

export const songRouter = createTRPCRouter({
  /* QUERIES */
  //gets the song for Song.tsx
  getSong: publicProcedure
    .input(
      z.object({
        songId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const song = await ctx.prisma.song.findUnique({
        where: {
          id: input.songId,
        },
      });

      return song;
    }),

  //the distinct is because u can add other ppls playlist to ur own, or copy a song from one playlist to another
  // this creates duplicate playlists just witha different playlistname/authorname which ruins the ui.
  getSongsByProfileName: publicProcedure
    .input(
      z.object({
        profileName: z.string(),
        takeLimit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const songs = await ctx.prisma.song.findMany({
        where: {
          authorName: input.profileName,
        },
        orderBy: [{ createdAt: "desc" }],
        take: input.takeLimit,
      });

      return songs;
    }),

  getAllSongs: publicProcedure.query(async ({ ctx }) => {
    const songs = await ctx.prisma.song.findMany({
      take: 8,
      orderBy: [{ createdAt: "desc" }],
    });

    return songs;
  }),

  /* MUTATIONS */
  createSong: withAuthProcedure
    .input(songValidate)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.song.create({
        data: {
          name: input.name,
          pictureUrl: input.pictureUrl,
          songUrl: input.songUrl,
          genre: input.genre,
          playlistName: input.playlistName,
          authorName: ctx.username,

          album: input.albumName,
          artist: input.artistName,
          description: input.description,
          rating: input.rating,

          playlists: {
            connect: {
              name_authorName: {
                name: input.playlistName,
                authorName: ctx.username,
              },
            },
          },
        },
      });
    }),

  // connects it to another playlist
  addSongToPlaylist: withAuthProcedure
    .input(
      z.object({
        currentSongId: z.string().min(1),
        newPlaylistName: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.song.update({
        where: {
          id: input.currentSongId,
        },

        data: {
          playlists: {
            connect: {
              name_authorName: {
                authorName: ctx.username,
                name: input.newPlaylistName,
              },
            },
          },
        },
      });
    }),

  deleteSong: withAuthProcedure
    .input(
      z.object({
        currentSongId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.song.delete({
        where: {
          id: input.currentSongId,
        },
      });
    }),

  //newValeus are the values to be udpated, the rest are the old values which are needed to see which song we should upate.
  //takes the songValidate function and removes the playlistname as a changable factor as that needs to be unchanged.
  updateSong: withAuthProcedure
    .input(
      z.object({
        newValues: songValidate
          .omit({
            playlistName: true,
          })
          .partial(),
        currentSongId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.song.update({
        where: {
          id: input.currentSongId,
        },

        data: {
          name: input.newValues.name,
          pictureUrl: input.newValues.pictureUrl,
          songUrl: input.newValues.songUrl,
          genre: input.newValues.genre,

          album: input.newValues.albumName,
          artist: input.newValues.artistName,
          description: input.newValues.description,
          rating: input.newValues.rating,
        },
      });
    }),
});
