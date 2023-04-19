import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";


import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";




export const playlistRouter = createTRPCRouter({
    getPlaylistsByProfileId: publicProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const playlists = await ctx.prisma.playlist.findMany({
        where: {
            authorId: input.profileId
        }
      })

      return playlists
    }),

  });
  
  
  