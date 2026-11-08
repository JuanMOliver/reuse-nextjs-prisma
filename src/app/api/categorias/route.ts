import { isDatabaseUnavailable } from "@/lib/db-errors";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/categorias - lista categorias com a contagem de itens disponíveis
async function listarCategorias() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: {
      _count: { select: { itens: { where: { status: "DISPONIVEL" } } } },
    },
  });

  return NextResponse.json({ categorias });
}

export async function GET() {
  try { return await listarCategorias(); }
  catch(error) {
    if (!isDatabaseUnavailable(error)) throw error;
    return NextResponse.json({erro:"Banco de dados indisponivel",codigo:"DATABASE_UNAVAILABLE",modo:"producao",persistencia:false,demonstracao:"/api/demo/itens"},
      {status:503,headers:{"Cache-Control":"no-store"}});
  }
}
