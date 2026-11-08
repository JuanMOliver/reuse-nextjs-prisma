import DatabaseUnavailable from "@/components/DatabaseUnavailable";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ItemCard from "@/components/ItemCard";
import SearchForm from "@/components/SearchForm";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

type SearchParams = {
  q?: string;
  categoriaId?: string;
  cidade?: string;
  condicao?: string;
  page?: string;
};

async function ConteudoItensPage({ searchParams: searchParamsPromise }: { searchParams: Promise<SearchParams> }) {
  const searchParams = await searchParamsPromise;
  const page = Math.max(1, Number(searchParams.page ?? 1));

  const where: Prisma.ItemWhereInput = {
    status: "DISPONIVEL",
    ...(searchParams.categoriaId ? { categoriaId: searchParams.categoriaId } : {}),
    ...(searchParams.condicao && ["NOVO", "SEMINOVO", "USADO"].includes(searchParams.condicao)
      ? { condicao: searchParams.condicao as "NOVO" | "SEMINOVO" | "USADO" }
      : {}),
    ...(searchParams.cidade
      ? { cidade: { contains: searchParams.cidade, mode: "insensitive" } }
      : {}),
    ...(searchParams.q
      ? {
          OR: [
            { titulo: { contains: searchParams.q, mode: "insensitive" } },
            { descricao: { contains: searchParams.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [itens, total, categorias] = await Promise.all([
¶»§q«^