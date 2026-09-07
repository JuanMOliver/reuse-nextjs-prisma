import Link from "next/link";
import { CONDICAO_LABEL, STATUS_ITEM_LABEL } from "@/lib/format";

type ItemCardProps = {
  id: string;
  titulo: string;
  descricao: string;
  condicao: string;
  status: string;
  cidade: string;
  bairro?: string | null;
  categoriaNome: string;
  categoriaIcone?: string | null;
};

export default function ItemCard({
  id,
  titulo,
  descricao,
  condicao,
  status,
  cidade,
  bairro,
  categoriaNome,
  categoriaIcone,
}: ItemCardProps) {
  return (
    <Link
      href={`/itens/${id}`}
      className="group flex flex-col rounded-xl2 border border-reuse-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-reuse-50 px-2.5 py-1 text-xs font-medium text-reuse-700">
          {categoriaIcone ?? "📦"} {categoriaNome}
        </span>
        <span className="text-xs font-medium text-reuse-500">{CONDICAO_LABEL[condicao] ?? condicao}</span>
      </div>

      <h3 className="mt-3 line-clamp-1 text-base font-semibold text-reuse-900 group-hover:text-reuse-600">
        {titulo}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-reuse-700">{descricao}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-reuse-500">
        <span>
          📍 {cidade}
          {bairro ? ` · ${bairro}` : ""}
        </span>
        <span
          className={
            status === "DISPONIVEL"
              ? "rounded-full bg-reuse-100 px-2 py-0.5 font-medium text-reuse-700"
              : "rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-500"
          }
        >
          {STATUS_ITEM_LABEL[status] ?? status}
        </span>
      </div>
    </Link>
  );
}
