import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: {
      _count: {
        select: { itens: { where: { status: "DISPONIVEL" } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-reuse-900">Categorias</h1>
        <p className="mt-1 text-sm text-reuse-600">
          Navegue pelos itens organizados por categoria.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categorias.map((cat) => (
          <Link
            key={cat.id}
            href={`/itens?categoriaId=${cat.id}`}
            className="flex flex-col items-center gap-2 rounded-xl2 border border-reuse-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-3xl">{cat.icone}</span>
            <span className="font-semibold text-reuse-900">{cat.nome}</span>
            <span className="text-xs text-reuse-500">{cat._count.itens} itens disponíveis</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
