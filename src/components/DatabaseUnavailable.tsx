import Link from "next/link";
export default function DatabaseUnavailable() {
  return <section role="status" className="mx-auto max-w-2xl space-y-4 rounded-xl2 border border-amber-200 bg-amber-50 p-7 text-amber-950">
    <p className="text-xs font-semibold uppercase tracking-widest">Ambiente em manutencao</p>
    <h1 className="text-2xl font-bold">Banco de dados de producao indisponivel</h1>
    <p className="text-sm leading-relaxed">Esta funcao depende do PostgreSQL e do Prisma. A conexao precisa ser restaurada e as migracoes aplicadas. Nenhuma troca ou cadastro foi simulado como se estivesse salvo.</p>
    <div className="flex flex-wrap gap-3">
      <Link href="/demo" className="rounded-full bg-reuse-600 px-5 py-2 text-sm font-semibold text-white">Explorar catalogo demonstrativo</Link>
      <Link href="/" className="rounded-full border border-reuse-300 px-5 py-2 text-sm font-semibold text-reuse-900">Voltar ao inicio</Link>
    </div>
    <p className="text-xs text-amber-900">O catalogo de demonstracao usa dados ficticios e nao substitui a persistencia PostgreSQL.</p>
  </section>;
}
