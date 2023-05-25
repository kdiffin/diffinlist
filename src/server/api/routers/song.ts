import { nullable, z } from "zod";
import { createTRPCRouter, publicProcedure, withAuthProcedure } from "../trpc";
import { isImage } from "~/server/helpers/ImageChecker";
import { TRPCError } from "@trpc/server";
import { songValidate } from "~/server/helpers/zodTypes";

export const songRouter = createTRPCRouter({
  /* QUERIES */
  //gets the song for Song.tsx
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

  //when fetching for [playlist] it gets it with playlistname and profilename
  //when fetching for [profileName] it gets it with profilename
  getSongs: publicProcedure
    .input(
      z.object({
        profileName: z.string(),
        playlistName: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const songs = await ctx.prisma.song.findMany({
        where: {
          authorName: input.profileName,
          playlistName: input.playlistName,
        },
        orderBy: [{ createdAt: "desc" }],
      });

      return songs;
    }),

  getAllSongs: publicProcedure.query(async ({ ctx }) => {
    const songs = await ctx.prisma.song.findMany();

    return songs;
  }),

  /* MUTATIONS */
  createSong: withAuthProcedure
    .input(songValidate)
    .mutation(async ({ ctx, input }) => {
      const isImageValid = isImage(input.pictureUrl);

      if (isImageValid === false) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Please make sure your URL is a picture URL.",
        });
      }

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
        },
      });
    }),

  deleteSong: withAuthProcedure
    .input(
      z.object({
        name: z.string().min(1),
        playlistName: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.song.delete({
        where: {
          name_playlistName_authorName: {
            authorName: ctx.username,
            name: input.name,
            playlistName: input.playlistName,
          },
        },
      });
    }),

  //newValeus are the values to be udpated, the rest are the old values which are needed to see which song we should upate.
  //takes the songValidate function and removes the playlistname as a changable factor as that needs to be unchanged.
  updateSong: withAuthProcedure
    .input(
      z.object({
        newValues: songValidate.omit({
          playlistName: true,
        }),
        currentName: z.string().min(1),
        currentPlaylistName: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.song.update({
        where: {
          name_playlistName_authorName: {
            authorName: ctx.username,
            name: input.currentName,
            playlistName: input.currentPlaylistName,
          },
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
