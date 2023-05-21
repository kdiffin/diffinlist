import { withAuth, type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  withAuthProcedure,
} from "~/server/api/trpc";
import { isImage } from "~/server/helpers/ImageChecker";

export const playlistRouter = createTRPCRouter({
  /* QUERIES */
  getPlaylists: publicProcedure
    .input(z.object({ profileName: z.string(), takeLimit: z.number() }))
    .query(async ({ input, ctx }) => {
      const playlists = await ctx.prisma.playlist.findMany({
        where: {
          authorName: input.profileName,
        },
        orderBy: [{ createdAt: "desc" }],
        take: input.takeLimit,
      });

      return playlists;
    }),

  getPlaylist: publicProcedure
    .input(z.object({ profileName: z.string(), playlistName: z.string() }))
    .query(async ({ input, ctx }) => {
      const playlist = await ctx.prisma.playlist.findUnique({
        where: {
          name_authorName: {
            authorName: input.profileName,
            name: input.playlistName,
          },
        },
      });

      return playlist;
    }),

  getAllPlaylists: publicProcedure.query(async ({ ctx }) => {
    const playlists = await ctx.prisma.playlist.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 8,
    });

    return playlists;
  }),

  /* MUTATIONS */
  //withAuthProcedure gives the context the username and user info of the logged in user
  createPlaylist: withAuthProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, { message: "Please enter in playlist name" })
          .max(70, { message: "Playlist name too long" }),

        //it can either be an empty string or a url
        picture: z.union([
          z.string().url("Please enter in valid picture URL!").trim(),
          z.string().max(0),
        ]),
        genre: z.string().max(30),

        //this is for when ur not creating the playlist, but moving one playlist to another.
        // go to how this is used in useAdd.tsx, its used to add a playlist to ur own profile from another users profile
        authorName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorName = ctx.username;
      const isImageValid = isImage(input.picture);

      if (isImageValid === false) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Please make sure your URL is a picture URL.",
        });
      }

      const playlist = await ctx.prisma.playlist.create({
        data: {
          name: input.name,
          authorName: input.authorName || authorName,
          genre: input.genre,
          pictureUrl: input.picture,
        },
      });

      return playlist;
    }),

  deletePlaylist: withAuthProcedure
    .input(
      z.object({
        playlistName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.playlist.delete({
        where: {
          name_authorName: {
            authorName: ctx.username,
            name: input.playlistName,
          },
        },
      });
    }),
});
