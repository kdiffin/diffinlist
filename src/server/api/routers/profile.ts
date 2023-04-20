import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function filterProfileForClient(user: User) {
  return {id: user.id, username: user.username, profileImageUrl: user.profileImageUrl}
  
}

export const profileRouter = createTRPCRouter({
  getProfileByProfileName: publicProcedure
    .input(z.object({ profileName: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await clerkClient.users.getUserList({
        username: [input.profileName],
        limit: 1,
      })

      const firstUser = user[0]

      if (!firstUser ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found"
        })
      }

      return filterProfileForClient(firstUser)
    }),

});


