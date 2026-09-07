import { PrismaClient } from "@prisma/client";

// Evita a criação de múltiplas instâncias do Prisma Client durante
// o hot-reload do Next.js em ambiente de desenvolvimento.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
