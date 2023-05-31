import { clerkClient } from "@clerk/nextjs/server";
import { Url } from "next/dist/shared/lib/router/router";
import { z } from "zod";
import { CardValues } from "~/components/Section";
import { createTRPCRouter, publicProcedure } from "../trpc";

// okay so im gonna make all of these return a custom typing because I want the typing to be consistent,
// so I can use my SectionCard component effectively.
// this means that some maps can look dumb, and have pointless values. But its needed and those values wont effect the security/usability of the component.

export const searchRouter = createTRPCRouter({
  getFilteredItems: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "No items with this name found" }),

        query: z.any(),
      })
    )
    .query(async ({ ctx, input }) => {
      const nameFilteredSongs = await ctx.prisma.song.findMany({
        where: {
          name: { contains: input.name },
        },
      });

      const nameFilteredPlaylists = await ctx.prisma.playlist.findMany({
        where: {
          name: { contains: input.name },
        },
      });

      const nameFilteredUsers = await clerkClient.users.getUserList({
        username: [input.name],
      });

      const users: FilterItem[] = nameFilteredUsers.map((user) => {
        const username = user && user.username ? user.username : "";

        return {
          id: user.id,
          data: {
            authorName: username,
            genre: "",
            pictureUrl: user.profileImageUrl,
            //ignore this playlistName just means its username
            playlistName: username,
          },

          href: `/${username}`,
          type: "profile",
        };
      });

      const playlists: FilterItem[] = nameFilteredPlaylists.map((playlist) => {
        return {
          id: playlist.id,
          data: {
            authorName: playlist.authorName,
            genre: playlist.genre,
            pictureUrl: playlist.pictureUrl,
            playlistName: playlist.name,
          },

          href: `/${playlist.authorName}/${playlist.name}`,
          type: "playlist",
        };
      });

      const songs: FilterItem[] = nameFilteredSongs.map((song) => {
        return {
          id: song.id,

          data: {
            authorName: song.authorName,
            genre: song.genre,
            pictureUrl: song.pictureUrl,
            playlistName: song.playlistName,
            songName: song.name,
          },

          href: {
            query: {
              ...input.query,
              song: song.name,
              playlist: song.playlistName,
              profileName: song.authorName,
            },
          },
          type: "song",
        };
      });

      return [...songs, ...playlists, ...users];
    }),
});

type FilterItem = {
  data: CardValues;
  id: string;
  type: "playlist" | "song" | "profile";
  href: Url;
};
