import { prisma } from "@/lib/prisma";
import { getUsuarioDemo } from "@/lib/session";
import { atualizarStatusTroca, avaliarUsuario } from "@/app/actions";
import { STATUS_TROCA_LABEL, STATUS_TROCA_COLOR, formatarData } from "@/lib/format";

export const dynamic = "force-dynamic";

const COLUNAS = ["PENDENTE", "ACEITA", "CONCLUIDA", "RECUSADA"] as const;

export default async function MinhasTrocasPage() {
  const usuario = await getUsuarioDemo();

  const trocas = await prisma.troca.findMany({
    where: {
      OR: [
        { solicitanteId: usuario.id },
        { itemDesejado: { usuarioId: usuario.id } },
      ],
    },
    include: {
      solicitante: true,
      itemOferecido: true,
      itemDesejado: { include: { usuario: true } },
    },
    orderBy: { criadoEm: "desc" },
  });

  const porStatus = Object.fromEntries(
    COLUNAS.map((status) => [status, trocas.filter((t) => t.status === status)])
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-reuse-900">Minhas trocas</h1>
        <p className="mt-1 text-sm text-reuse-600">
          Painel de propostas envolvendo <strong>{usuario.nome}</strong> (usuário de demonstração).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {COLUNAS.map((status) => (
          <div key={status} className="space-y-3">
            <h2 className={`rounded-full px-3 py-1 text-center text-xs font-semibold ${STATUS_TROCA_COLOR[status]}`}>
              {STATUS_TROCA_LABEL[status]} ({porStatus[status].length})
            </h2>

            {porStatus[status].map((troca) => {
              const souDono = troca.itemDesejado.usuarioId === usuario.id;
              return (
                <div key={troca.id} className="space-y-2 rounded-xl2 border border-reuse-100 bg-white p-3 text-xs shadow-sm">
                  <p className="font-semibold text-reuse-900">{troca.itemDesejado.titulo}</p>
                  <p className="text-reuse-500">
                    Oferta: {troca.itemOferecido.titulo} · de {troca.solicitante.nome}
                  </p>
                  {troca.mensagem && <p className="italic text-reuse-600">&quot;{troca.mensagem}&quot;</p>}
                  <p className="text-reuse-400">{formatarData(troca.criadoEm)}</p>

                  {status === "PENDENTE" && souDono && (
                    <div className="flex gap-2 pt-1">
                      <form action={atualizarStatusTroca}>
                        <input type="hidden" name="trocaId" value={troca.id} />
                        <input type="hidden" name="status" value="ACEITA" />
                        <button className="rounded-full bg-reuse-600 px-2.5 py-1 font-semibold text-white">
                          Aceitar
                        </button>
                      </form>
                      <form action={atualizarStatusTroca}>
                        <input type="hidden" name="trocaId" value={troca.id} />
                        <input type="hidden" name="status" value="RECUSADA" />
                        <button className="rounded-full bg-red-100 px-2.5 py-1 font-semibold text-red-700">
                          Recusar
                        </button>
                      </form>
                    </div>
                  )}

                  {status === "ACEITA" && (
                    <form action={atualizarStatusTroca} className="pt-1">
                      <input type="hidden" name="trocaId" value={troca.id} />
                      <input type="hidden" name="status" value="CONCLUIDA" />
                      <button className="w-full rounded-full bg-reuse-600 px-2.5 py-1 font-semibold text-white">
                        Marcar como concluída
                      </button>
                    </form>
                  )}

                  {status === "CONCLUIDA" && (
                    <form action={avaliarUsuario} className="space-y-1 border-t border-reuse-50 pt-2">
                      <input type="hidden" name="trocaId" value={troca.id} />
                      <input
                        type="hidden"
                        name="avaliadoId"
                        value={souDono ? troca.solicitante.id : troca.itemDesejado.usuarioId}
                      />
                      <select name="nota" className="w-full rounded border border-reuse-200 px-2 py-1">
                        <option value="5">⭐⭐⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐</option>
                        <option value="3">⭐⭐⭐</option>
                        <option value="2">⭐⭐</option>
                        <option value="1">⭐</option>
                      </select>
                      <button className="w-full rounded-full bg-reuse-100 px-2.5 py-1 font-semibold text-reuse-800">
                        Avaliar
                      </button>
                    </form>
                  )}
                </div>
              );
            })}

            {porStatus[status].length === 0 && (
              <p className="rounded-xl2 border border-dashed border-reuse-200 p-3 text-center text-xs text-reuse-400">
                Nenhuma troca aqui
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
