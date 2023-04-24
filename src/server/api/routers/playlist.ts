import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  withAuthProcedure,
} from "~/server/api/trpc";

export const playlistRouter = createTRPCRouter({
  getPlaylistsByProfileName: publicProcedure
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
          name_authorName: {authorName: input.profileName, name: input.playlistName }
        },
      });

      return playlist;
    }),

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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorName = ctx.username;

      const playlist = await ctx.prisma.playlist.create({
        data: {
          name: input.name,
          authorName: authorName,
          genre: input.genre,
          pictureUrl: input.picture,
        },
      });

      return playlist;
    }),
});
