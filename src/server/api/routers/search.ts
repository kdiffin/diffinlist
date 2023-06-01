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
        name: z
          .string()
          .min(1, { message: "No items with this name found" })
          .optional(),
        authorName: z
          .string()
          .min(1, { message: "No items with this name found" })
          .optional(),
        inputType: z.enum(["authorname", "name"]),
        cardType: z.string().optional(),
        orderBy: z.enum(["desc", "asc"]),
        query: z.any(),
      })
    )
    .query(async ({ ctx, input }) => {
      const clerkOrderBy =
        input.orderBy === "desc" ? "-created_at" : "+created_at";

      if (
        !input.name &&
        !input.authorName &&
        (input.cardType === "all" || !input.cardType)
      ) {
        return;
      }

      // I did all of these returns with reused code because If I didnt then the server would have to process all the other requests too before returning, in the end making the if statements pointless.
      if (input.cardType === "songs") {
        const nameFilteredSongs = await ctx.prisma.song.findMany({
          where: {
            AND: [
              { name: { contains: input.name } },
              { authorName: { contains: input.authorName } },
            ],
          },
          orderBy: [{ createdAt: input.orderBy }],
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

        return songs;
      }

      if (input.cardType === "playlists") {
        const nameFilteredPlaylists = await ctx.prisma.playlist.findMany({
          where: {
            AND: [
              { name: { contains: input.name } },
              { authorName: { contains: input.authorName } },
            ],
          },
          orderBy: [{ createdAt: input.orderBy }],
        });

        const playlists: FilterItem[] = nameFilteredPlaylists.map(
          (playlist) => {
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
          }
        );

        return playlists;
      }

      if (input.cardType === "users") {
        const nameFilteredUsers = await clerkClient.users.getUserList({
          query: input.name,
          orderBy: clerkOrderBy,
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

        return users;
      }

      const nameFilteredSongs = await ctx.prisma.song.findMany({
        where: {
          AND: [
            { name: { contains: input.name } },
            { authorName: { contains: input.authorName } },
          ],
        },
        orderBy: [{ createdAt: input.orderBy }],
      });

      const nameFilteredPlaylists = await ctx.prisma.playlist.findMany({
        where: {
          AND: [
            { name: { contains: input.name } },
            { authorName: { contains: input.authorName } },
          ],
        },
        orderBy: [{ createdAt: input.orderBy }],
      });

      const nameFilteredUsers = await clerkClient.users.getUserList({
        query: input.name ? input.name : input.authorName,
        orderBy: clerkOrderBy,
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
