import { prisma } from "@/lib/prisma";
import { cadastrarItem } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function CadastrarItemPage({
  searchParams,
}: {
  searchParams: { sucesso?: string; erro?: string };
}) {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-reuse-900">Cadastrar novo item</h1>
        <p className="mt-1 text-sm text-reuse-600">
          Preencha os dados abaixo para disponibilizar um item para troca ou doação.
        </p>
      </div>

      {searchParams.sucesso && (
        <p className="rounded-lg bg-reuse-100 px-4 py-3 text-sm font-medium text-reuse-800">
          ✅ Item cadastrado com sucesso! Ele já aparece na listagem de itens.
        </p>
      )}
      {searchParams.erro && (
        <p className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          ⚠️ {decodeURIComponent(searchParams.erro)}
        </p>
      )}

      <form action={cadastrarItem} className="space-y-4 rounded-xl2 border border-reuse-100 bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-medium text-reuse-800">Título</label>
          <input
            name="titulo"
            required
            minLength={3}
            placeholder="Ex: Bicicleta aro 26 semi-nova"
            className="mt-1 w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-reuse-800">Descrição</label>
          <textarea
            name="descricao"
            required
            minLength={10}
            rows={4}
            placeholder="Descreva o item, estado de conservação e motivo da troca/doação"
            className="mt-1 w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-reuse-800">Categoria</label>
            <select
              name="categoriaId"
              required
              className="mt-1 w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
            >
              <option value="">Selecione...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icone} {cat.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-reuse-800">Condição</label>
            <select
              name="condicao"
              required
              defaultValue="USADO"
              className="mt-1 w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
            >
              <option value="NOVO">Novo</option>
              <option value="SEMINOVO">Seminovo</option>
              <option value="USADO">Usado</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-reuse-800">Cidade</label>
            <input
              name="cidade"
              required
              placeholder="Ex: São Paulo"
              className="mt-1 w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-reuse-800">Bairro (opcional)</label>
            <input
              name="bairro"
              placeholder="Ex: Vila Mariana"
              className="mt-1 w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-reuse-800">URL da foto (opcional)</label>
          <input
            name="fotoUrl"
            type="url"
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-reuse-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-reuse-700"
        >
          Publicar item
        </button>
        <p className="text-xs text-reuse-500">
          O item será publicado em nome do usuário de demonstração (ver README, seção
          &quot;Limitações&quot;), já que o protótipo ainda não possui login.
        </p>
      </form>
    </div>
  );
}
