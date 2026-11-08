import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
/** Verifica disponibilidade e faz SELECT 1 no PostgreSQL. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({projeto:"ReUse!",servidor:"online",banco:"online",pronto:true,modo:"postgresql"},
      {headers:{"Cache-Control":"no-store"}});
  } catch {
    return NextResponse.json({projeto:"ReUse!",servidor:"online",banco:"indisponivel",pronto:false,
      detalhe:"Conexao com PostgreSQL indisponivel. O catalogo /demo usa dados ficticios."},
      {status:503,headers:{"Cache-Control":"no-store"}});
  }
}
