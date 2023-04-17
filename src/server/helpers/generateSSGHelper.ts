import { appRouter } from "../api/root";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { prisma } from "../db";
import SuperJSON from "superjson";


export const ssgHelper = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma},
    transformer: SuperJSON, // optional - adds superjson serialization
  });