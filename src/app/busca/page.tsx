import DatabaseUnavailable from "@/components/DatabaseUnavailable";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { prisma } from "@/lib/prisma";
import SearchForm from "@/components/SearchForm";
import ItemCard from "@/components/ItemCard";

export const dynamic = "force-dynamic";

async function ConteudoBuscaPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ q?: string; categoriaId?: string; cidade?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const temFiltro = Boolean(searchParams.q || searchParams.categoriaId || searchParams.cidade);

  const [categorias, cidadesDisponiveis, resultados] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
    prisma.item.findMany({
      where: { status: "DISPONIVEL" },
      distinct: ["cidade"],
      select: { cidade: true },
      take: 20,
    }),
    temFiltro
      ? prisma.item.findMany({
          where: {
            status: "DISPONIVEL",
            ...(searchParams.categoriaId ? { categoriaId: searchParams.categoriaId } : {}),
            ...(searchParams.cidade
              ? { cidade: { contains: searchParams.cidade, mode: "insensitive" } }
              : {}),
            ...(searchParams.q
              ? {
                  OR: [
                    { titulo: { contains: searchParams.q, mode: "insensitive" } },
                    { descricao: { contains: searchParams.q, mode: "insensitive" } },
                  ],
          ¶»§q«^