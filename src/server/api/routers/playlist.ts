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

  createPlaylist: withAuthProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, { message: "Please enter in playlist name" })
          .max(70),
        picture: z.string().url("Please enter in valid picture URL!").min(1),
        genre: z.string().max(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorName = ctx.username;

      const playlist = await ctx.prisma.playlist
        .create({
          data: {
            name: input.name,
            authorName: authorName,
            genre: input.genre,
            pictureUrl: input.picture,
          },
        })
        .then((err) => {
          // https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
          console.log("y34234ui234u234i23i4iooo" ,err)
        });

      return playlist;
    }),
});
