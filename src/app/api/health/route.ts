import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Healthcheck do backend Node.js hospedado em Vercel.
 * O status online indica somente que a API responde, nao valida o PostgreSQL.
 */
export async function GET() {
  return NextResponse.json({
    projeto: "ReUse!",
    camada: "backend-nextjs-node",
    status: "online",
    banco: "nao_verificado",
    observacao: "Valide /api/itens e /api/categorias para verificar Prisma/PostgreSQL."
  }, { headers: { "Cache-Control": "no-store" } });
}
