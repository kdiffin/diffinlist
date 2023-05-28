import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "~/server/api/routers/profile";
import { playlistRouter } from "./routers/playlist";
import { songRouter } from "./routers/song";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  playlist: playlistRouter,
  song: songRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
