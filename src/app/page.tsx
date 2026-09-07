import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ItemCard from "@/components/ItemCard";
import StatsBar from "@/components/StatsBar";
import SearchForm from "@/components/SearchForm";

// Página renderizada no servidor (Server Component) a cada requisição,
// sempre refletindo o estado atual do banco de dados via Prisma.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let bancoIndisponivel = false;
  let totalUsuarios = 0;
  let totalItens = 0;
  let totalTrocasConcluidas = 0;
  let itensRecentes: Prisma.ItemGetPayload<{ include: { categoria: true } }>[] = [];
  let categorias: Awaited<ReturnType<typeof prisma.categoria.findMany>> = [];

  try {
    [totalUsuarios, totalItens, totalTrocasConcluidas, itensRecentes, categorias] =
      await Promise.all([
        prisma.usuario.count(),
        prisma.item.count({ where: { status: "DISPONIVEL" } }),
        prisma.troca.count({ where: { status: "CONCLUIDA" } }),
        prisma.item.findMany({
          where: { status: "DISPONIVEL" },
          orderBy: { criadoEm: "desc" },
          take: 6,
          include: { categoria: true },
        }),
        prisma.categoria.findMany({
          orderBy: { nome: "asc" },
          take: 8,
        }),
      ]);
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "";
    const bancoOffline = /Can't reach database server|Environment variable not found|P1001/.test(
      mensagem,
    );

    if (!bancoOffline) {
      throw error;
    }

    bancoIndisponivel = true;
  }

  return (
    <div className="space-y-12">
      {bancoIndisponivel && (
        <div className="rounded-xl2 border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-900">
          <p className="font-semibold">Banco de dados indisponível</p>
          <p className="mt-1">
            Inicie o PostgreSQL local e atualize a página para carregar os itens e indicadores.
          </p>
        </div>
      )}
      <section className="rounded-xl2 bg-gradient-to-br from-reuse-600 to-reuse-800 px-6 py-12 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-reuse-100">
          Economia circular · consumo consciente
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
          Dê uma segunda vida aos seus itens com o ReUse!
        </h1>
        <p className="mt-4 max-w-xl text-reuse-50">
          Troque, doe e encontre itens perto de você. A versão web do ReUse! amplia o acesso à
          plataforma, permitindo cadastrar e buscar itens diretamente pelo navegador.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/itens"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-reuse-700 transition hover:bg-reuse-50"
          >
            Ver itens disponíveis
          </Link>
          <Link
            href="/cadastrar-item"
            className="rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Cadastrar um item
          </Link>
        </div>
      </section>

      <section>
        <StatsBar
          stats={[
            { label: "Usuários cadastrados", value: totalUsuarios },
            { label: "Itens disponíveis", value: totalItens },
            { label: "Trocas concluídas", value: totalTrocasConcluidas },
            { label: "Categorias ativas", value: categorias.length },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-reuse-900">Buscar um item</h2>
        <SearchForm categorias={categorias} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-reuse-900">Itens recentes</h2>
          <Link href="/itens" className="text-sm font-medium text-reuse-600 hover:underline">
            Ver todos →
          </Link>
        </div>
        {itensRecentes.length === 0 ? (
          <p className="text-sm text-reuse-600">
            Nenhum item cadastrado ainda. Rode <code>npx prisma db seed</code> para popular o banco
            de demonstração.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itensRecentes.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                descricao={item.descricao}
                condicao={item.condicao}
                status={item.status}
                cidade={item.cidade}
                bairro={item.bairro}
                categoriaNome={item.categoria.nome}
                categoriaIcone={item.categoria.icone}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
