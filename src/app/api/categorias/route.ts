import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/categorias - lista categorias com a contagem de itens disponíveis
export async function GET() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: {
      _count: { select: { itens: { where: { status: "DISPONIVEL" } } } },
    },
  });

  return NextResponse.json({ categorias });
}
