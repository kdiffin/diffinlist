import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  getFilteredItems: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const nameFilteredSongs = await ctx.prisma.song.findMany({
        where: {
          name: input.name,
        },
      });

      const nameFilteredPlaylists = await ctx.prisma.playlist.findMany({
        where: {
          name: input.name,
        },
      });

      const nameFilteredUsers = await clerkClient.users.getUserList({
        query: input.name,
      });

      return { nameFilteredSongs, nameFilteredPlaylists, nameFilteredUsers };
    }),
});
