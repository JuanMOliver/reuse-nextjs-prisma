type Categoria = { id: string; nome: string; icone?: string | null };

export default function SearchForm({
  categorias,
  defaultValues,
}: {
  categorias: Categoria[];
  defaultValues?: { q?: string; categoriaId?: string; cidade?: string };
}) {
  return (
    <form action="/itens" method="GET" className="grid gap-3 rounded-xl2 bg-white p-4 shadow-sm sm:grid-cols-4">
      <input
        type="text"
        name="q"
        placeholder="O que você procura? (ex: bicicleta, livro...)"
        defaultValue={defaultValues?.q}
        className="rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none sm:col-span-2"
      />
      <select
        name="categoriaId"
        defaultValue={defaultValues?.categoriaId ?? ""}
        className="rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
      >
        <option value="">Todas as categorias</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icone} {c.nome}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="cidade"
        placeholder="Cidade"
        defaultValue={defaultValues?.cidade}
        className="rounded-lg border border-reuse-200 px-3 py-2 text-sm focus:border-reuse-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-reuse-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-reuse-700 sm:col-span-4"
      >
        Buscar itens
      </button>
    </form>
  );
}
