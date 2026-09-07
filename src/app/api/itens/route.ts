import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

// GET /api/itens?categoriaId=...&cidade=...&q=...
// Disponibiliza a listagem de itens como API interna, útil para
// integrações futuras (ex: consumo pelo app mobile do ReUse!).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const itens = await prisma.item.findMany({
    where: {
      status: "DISPONIVEL",
      ...(searchParams.get("categoriaId")
        ? { categoriaId: searchParams.get("categoriaId")! }
        : {}),
      ...(searchParams.get("cidade")
        ? { cidade: { contains: searchParams.get("cidade")!, mode: "insensitive" } }
        : {}),
      ...(searchParams.get("q")
        ? {
            OR: [
              { titulo: { contains: searchParams.get("q")!, mode: "insensitive" } },
              { descricao: { contains: searchParams.get("q")!, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { categoria: true, usuario: { select: { id: true, nome: true, cidade: true } } },
    orderBy: { criadoEm: "desc" },
    take: 50,
  });

  return NextResponse.json({ total: itens.length, itens });
}

const criarItemSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().min(10),
  categoriaId: z.string().min(1),
  usuarioId: z.string().min(1),
  condicao: z.enum(["NOVO", "SEMINOVO", "USADO"]).default("USADO"),
  cidade: z.string().min(2),
  bairro: z.string().optional(),
  fotoUrl: z.string().url().optional(),
});

// POST /api/itens - cria um item via JSON (uso programático / testes)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = criarItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 422 });
  }

  const item = await prisma.item.create({ data: parsed.data });
  return NextResponse.json({ item }, { status: 201 });
}
