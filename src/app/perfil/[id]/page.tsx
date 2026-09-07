import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ItemCard from "@/components/ItemCard";
import { formatarData } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PerfilPage({ params }: { params: { id: string } }) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: params.id },
    include: {
      itens: {
        where: { status: "DISPONIVEL" },
        include: { categoria: true },
        orderBy: { criadoEm: "desc" },
      },
      avaliacoesRecebidas: {
        orderBy: { criadoEm: "desc" },
        take: 5,
        include: { avaliador: { select: { nome: true } } },
      },
    },
  });

  if (!usuario) notFound();

  const mediaAvaliacoes = await prisma.avaliacao.aggregate({
    where: { avaliadoId: usuario.id },
    _avg: { nota: true },
    _count: { nota: true },
  });

  const media = mediaAvaliacoes._avg.nota ? mediaAvaliacoes._avg.nota.toFixed(1) : "—";

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-4 rounded-xl2 border border-reuse-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-reuse-900">{usuario.nome}</h1>
          <p className="text-sm text-reuse-600">
            {usuario.cidade}
            {usuario.bairro ? ` · ${usuario.bairro}` : ""}
          </p>
          <p className="mt-1 text-xs text-reuse-500">
            Na plataforma desde {formatarData(usuario.criadoEm)}
          </p>
        </div>
        <div className="rounded-xl2 bg-reuse-50 px-5 py-3 text-center">
          <p className="text-2xl font-bold text-reuse-700">⭐ {media}</p>
          <p className="text-xs text-reuse-600">{mediaAvaliacoes._count.nota} avaliações</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-reuse-900">
          Itens publicados ({usuario.itens.length})
        </h2>
        {usuario.itens.length === 0 ? (
          <p className="text-sm text-reuse-600">Este usuário ainda não publicou itens disponíveis.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {usuario.itens.map((item) => (
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

      <section>
        <h2 className="mb-3 text-lg font-semibold text-reuse-900">Avaliações recebidas</h2>
        {usuario.avaliacoesRecebidas.length === 0 ? (
          <p className="text-sm text-reuse-600">Nenhuma avaliação recebida ainda.</p>
        ) : (
          <ul className="space-y-3">
            {usuario.avaliacoesRecebidas.map((av) => (
              <li key={av.id} className="rounded-xl2 border border-reuse-100 bg-white p-4 text-sm shadow-sm">
                <p className="font-semibold text-reuse-900">
                  {"⭐".repeat(av.nota)} · {av.avaliador.nome}
                </p>
                {av.comentario && <p className="mt-1 text-reuse-700">{av.comentario}</p>}
                <p className="mt-1 text-xs text-reuse-400">{formatarData(av.criadoEm)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
