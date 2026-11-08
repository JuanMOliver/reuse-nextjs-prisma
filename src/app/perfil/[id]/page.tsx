import DatabaseUnavailable from "@/components/DatabaseUnavailable";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ItemCard from "@/components/ItemCard";
import { formatarData } from "@/lib/format";

export const dynamic = "force-dynamic";

async function ConteudoPerfilPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
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

  const media = mediaAvaliacoes._avg.nota ? mediaAvaliacoes._avg.nota.toFixed(1) : "â€”";

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-4 rounded-xl2 border border-reuse-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-reuse-900">{usuario.nome}</h1>
          <p className="text-sm te¶»§q«^