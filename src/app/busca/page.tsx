import { prisma } from "@/lib/prisma";
import SearchForm from "@/components/SearchForm";
import ItemCard from "@/components/ItemCard";

export const dynamic = "force-dynamic";

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: { q?: string; categoriaId?: string; cidade?: string };
}) {
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
                }
              : {}),
          },
          include: { categoria: true },
          take: 6,
          orderBy: { criadoEm: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-reuse-900">Buscar por item, categoria ou cidade</h1>
        <p className="mt-1 text-sm text-reuse-600">
          Cidades com itens disponíveis: {cidadesDisponiveis.map((c) => c.cidade).join(", ") || "—"}
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

      {temFiltro && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-reuse-500">
            Prévia dos resultados ({resultados.length})
          </h2>
          {resultados.length === 0 ? (
            <p className="text-sm text-reuse-600">Nenhum item encontrado com esses termos.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((item) => (
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
        </section>
      )}
    </div>
  );
}
