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

export default async function ItensPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, Number(searchParams.page ?? 1));

  const where: Prisma.ItemWhereInput = {
    status: "DISPONIVEL",
    ...(searchParams.categoriaId ? { categoriaId: searchParams.categoriaId } : {}),
    ...(searchParams.condicao ? { condicao: searchParams.condicao as any } : {}),
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
    prisma.item.findMany({
      where,
      include: { categoria: true, usuario: { select: { nome: true, cidade: true } } },
      orderBy: { criadoEm: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.item.count({ where }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-reuse-900">Itens disponíveis</h1>
        <p className="mt-1 text-sm text-reuse-600">
          {total} {total === 1 ? "item encontrado" : "itens encontrados"}
        </p>
      </div>

      <SearchForm
        categorias={categorias}
        defaultValues={{
          q: searchParams.q,
          categoriaId: searchParams.categoriaId,
          cidade: searchParams.cidade,
        }}
      />

      {itens.length === 0 ? (
        <p className="rounded-xl2 bg-reuse-50 p-6 text-center text-sm text-reuse-700">
          Nenhum item encontrado com esses filtros. Tente ajustar a busca.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              titulo={item.titulo}
              descricao={item.descricao}
              condicao={item.condicao}
              status={item.status}
              cidade={item.cidade}
              bairro={item.bairro}
              categoriaNome={item.categoria.nome}
              categoriaIcone={item.categoria.icone}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={{
                pathname: "/itens",
                query: { ...searchParams, page: p },
              }}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                p === page ? "bg-reuse-600 text-white" : "bg-reuse-50 text-reuse-700 hover:bg-reuse-100"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
