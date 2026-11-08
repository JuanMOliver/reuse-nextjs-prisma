import DatabaseUnavailable from "@/components/DatabaseUnavailable";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ItemCard from "@/components/ItemCard";
import { CONDICAO_LABEL, STATUS_ITEM_LABEL, formatarData } from "@/lib/format";
import { proporTroca } from "@/app/actions";

export const dynamic = "force-dynamic";

async function ConteudoItemDetalhePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
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
            {item.categoria.icone} {item.categ¶»§q«^