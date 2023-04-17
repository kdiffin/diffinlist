import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";


import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function filterProfileForClient(user: User) {
  return {id: user.id, username: user.username, profileImageUrl: user.profileImageUrl}
  
}

export const profileRouter = createTRPCRouter({
  getProfileByProfileId: publicProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await clerkClient.users.getUser(input.profileId)

      return filterProfileForClient(user)
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});


