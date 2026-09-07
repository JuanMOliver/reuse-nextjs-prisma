import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

// GET /api/trocas?usuarioId=... - lista trocas de um usuário (solicitadas ou recebidas)
export async function GET(request: NextRequest) {
  const usuarioId = new URL(request.url).searchParams.get("usuarioId");

  if (!usuarioId) {
    return NextResponse.json({ erro: "Parâmetro usuarioId é obrigatório." }, { status: 400 });
  }

  const trocas = await prisma.troca.findMany({
    where: {
      OR: [{ solicitanteId: usuarioId }, { itemDesejado: { usuarioId } }],
    },
    include: {
      itemOferecido: true,
      itemDesejado: true,
      solicitante: { select: { id: true, nome: true } },
    },
    orderBy: { criadoEm: "desc" },
  });

  return NextResponse.json({ total: trocas.length, trocas });
}

const criarTrocaSchema = z.object({
  solicitanteId: z.string().min(1),
  itemOferecidoId: z.string().min(1),
  itemDesejadoId: z.string().min(1),
  mensagem: z.string().optional(),
});

// POST /api/trocas - cria uma proposta de troca via JSON
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = criarTrocaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ erro: parsed.error.flatten() }, { status: 422 });
  }

  const troca = await prisma.troca.create({ data: parsed.data });
  return NextResponse.json({ troca }, { status: 201 });
}
