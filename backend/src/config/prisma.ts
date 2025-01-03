import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

export const prisma = new PrismaClient();

export const gracefullyShutdown = async (signal: any) => {
  logger.info(`Received signal to terminate : ${signal}`);
  await prisma.$disconnect();
  process.exit(0);
};
