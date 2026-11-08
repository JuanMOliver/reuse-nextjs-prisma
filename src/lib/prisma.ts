import { PrismaClient } from "@prisma/client";

// Evita a criação de múltiplas instâncias do Prisma Client durante
// o hot-reload do Next.js em ambiente de desenvolvimento.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Use a conexao com pool nas funcoes serverless, preservando DATABASE_URL direta para migracoes.
    ...(process.env.DATABASE_URL_POOLED
      ? { datasources: { db: { url: process.env.DATABASE_URL_POOLED } } }
      : {}),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
