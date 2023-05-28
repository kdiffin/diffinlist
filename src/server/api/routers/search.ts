import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  getFilteredItems: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return "";
    }),
});
