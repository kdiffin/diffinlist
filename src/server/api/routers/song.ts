import { nullable, z } from "zod";
import { createTRPCRouter, publicProcedure, withAuthProcedure } from "../trpc";
import { isImage } from "~/server/helpers/ImageChecker";
import { TRPCError } from "@trpc/server";

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
    .input(
      z.object({
        name: z
          .string()
          .min(1, { message: "Please enter in a name for the song" }),
        pictureUrl: z.union([
          z.string().url("Please enter in valid picture URL!").trim(),
          z.string().max(0),
        ]),
        songUrl: z
          .string()
          .min(1, {
            message:
              "Please enter in a link for the song, (youtube, spotify, soundcloud etc.)",
          })
          .url(),
        genre: z
          .string()
          .min(1, { message: "Please enter in a genre for the song" }),
        playlistName: z.string().min(1),

        albumName: z.string().nullable().optional(),
        artistName: z.string().nullable().optional(),
        description: z.string().max(400).nullable().optional(),
        rating: z
          .number()
          .min(0, { message: "Please enter a number above 0" })
          .max(10, { message: "Please enter a number below 10" })
          .nullable()
          .optional(),
        authorName: z.string().optional(),
      })
    )
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
          authorName: input.authorName || ctx.username,

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
});
