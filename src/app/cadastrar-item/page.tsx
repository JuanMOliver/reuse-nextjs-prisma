import DatabaseUnavailable from "@/components/DatabaseUnavailable";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { prisma } from "@/lib/prisma";
import { cadastrarItem } from "@/app/actions";

export const dynamic = "force-dynamic";

async function ConteudoCadastrarItemPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ sucesso?: string; erro?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-reuse-900">Cadastrar novo item</h1>
        <p className="mt-1 text-sm text-reuse-600">
          Preencha os dados abaixo para disponibilizar um item para troca ou doa√ß√£o.
        </p>
      </div>

      {searchParams.sucesso && (
        <p className="rounded-lg bg-reuse-100 px-4 py-3 text-sm font-medium text-reuse-800">
          ‚úÖ Item cadastrado com sucesso! Ele j√° aparece na listagem de itens.
        </p>
      )}
      {searchParams.erro && (
        <p className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          ‚ö†Ô∏è {decodeURIComponent(searchParams.erro)}
        </p>
      )}

      <form action={cadastrarItem} className="space-y-4 rounded-xl2 border border-reuse-100 bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-medium text-reuse-800">T√≠tulo</label>∂ªßq´^