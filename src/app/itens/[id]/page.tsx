import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ItemCard from "@/components/ItemCard";
import { CONDICAO_LABEL, STATUS_ITEM_LABEL, formatarData } from "@/lib/format";
import { proporTroca } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function ItemDetalhePage({ params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: {
      categoria: true,
      usuario: true,
    },
  });

  if (!item) notFound();

  const [relacionados, meusItens] = await Promise.all([
    prisma.item.findMany({
      where: {
        categoriaId: item.categoriaId,
        id: { not: item.id },
        status: "DISPONIVEL",
      },
      include: { categoria: true },
      take: 3,
    }),
    prisma.item.findMany({
      where: { status: "DISPONIVEL", id: { not: item.id } },
      orderBy: { criadoEm: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-reuse-50 px-3 py-1 text-xs font-medium text-reuse-700">
            {item.categoria.icone} {item.categoria.nome}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-reuse-900">{item.titulo}</h1>
          <p className="mt-3 whitespace-pre-line text-reuse-700">{item.descricao}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl2 border border-reuse-100 bg-white p-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-reuse-500">Condição</dt>
              <dd className="font-medium text-reuse-900">{CONDICAO_LABEL[item.condicao]}</dd>
            </div>
            <div>
              <dt className="text-reuse-500">Status</dt>
              <dd className="font-medium text-reuse-900">{STATUS_ITEM_LABEL[item.status]}</dd>
            </div>
            <div>
              <dt className="text-reuse-500">Local</dt>
              <dd className="font-medium text-reuse-900">
                {item.cidade}
                {item.bairro ? ` · ${item.bairro}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-reuse-500">Publicado em</dt>
              <dd className="font-medium text-reuse-900">{formatarData(item.criadoEm)}</dd>
            </div>
          </dl>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl2 border border-reuse-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-reuse-500">
              Anunciado por
            </p>
            <Link
              href={`/perfil/${item.usuario.id}`}
              className="mt-1 block text-base font-semibold text-reuse-900 hover:text-reuse-600"
            >
              {item.usuario.nome}
            </Link>
            <p className="text-sm text-reuse-600">{item.usuario.cidade}</p>
          </div>

          {item.status === "DISPONIVEL" && (
            <form
              action={proporTroca}
              className="space-y-3 rounded-xl2 border border-reuse-100 bg-white p-4 shadow-sm"
            >
              <input type="hidden" name="itemDesejadoId" value={item.id} />
              <p className="text-sm font-semibold text-reuse-900">Propor troca</p>
              <select
                name="itemOferecidoId"
                required
                className="w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm"
              >
                <option value="">Selecione um item seu para oferecer</option>
                {meusItens.map((meuItem) => (
                  <option key={meuItem.id} value={meuItem.id}>
                    {meuItem.titulo}
                  </option>
                ))}
              </select>
              <textarea
                name="mensagem"
                rows={3}
                placeholder="Escreva uma mensagem para o dono do item..."
                className="w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-reuse-600 px-4 py-2 text-sm font-semibold text-white hover:bg-reuse-700"
              >
                Enviar proposta
              </button>
              <p className="text-xs text-reuse-500">
                Em um protótipo com autenticação completa, esta lista mostraria apenas os itens do
                usuário logado.
              </p>
            </form>
          )}
        </aside>
      </div>

      {relacionados.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-reuse-900">
            Outros itens em {item.categoria.nome}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((rel) => (
              <ItemCard
                key={rel.id}
                id={rel.id}
                titulo={rel.titulo}
                descricao={rel.descricao}
                condicao={rel.condicao}
                status={rel.status}
                cidade={rel.cidade}
                bairro={rel.bairro}
                categoriaNome={rel.categoria.nome}
                categoriaIcone={rel.categoria.icone}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
