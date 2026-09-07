-- CreateEnum
CREATE TYPE "CondicaoItem" AS ENUM ('NOVO', 'SEMINOVO', 'USADO');
CREATE TYPE "StatusItem" AS ENUM ('DISPONIVEL', 'RESERVADO', 'TROCADO');
CREATE TYPE "StatusTroca" AS ENUM ('PENDENTE', 'ACEITA', 'RECUSADA', 'CONCLUIDA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT,
    "avatarUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "icone" TEXT DEFAULT '📦',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "condicao" "CondicaoItem" NOT NULL DEFAULT 'USADO',
    "status" "StatusItem" NOT NULL DEFAULT 'DISPONIVEL',
    "cidade" TEXT NOT NULL,
    "bairro" TEXT,
    "fotoUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    CONSTRAINT "itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trocas" (
    "id" TEXT NOT NULL,
    "mensagem" TEXT,
    "status" "StatusTroca" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "itemOferecidoId" TEXT NOT NULL,
    "itemDesejadoId" TEXT NOT NULL,
    CONSTRAINT "trocas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trocaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" TEXT NOT NULL,
    "nota" INTEGER NOT NULL DEFAULT 5,
    "comentario" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avaliadorId" TEXT NOT NULL,
    "avaliadoId" TEXT NOT NULL,
    "trocaId" TEXT,
    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE INDEX "usuarios_cidade_idx" ON "usuarios"("cidade");
CREATE UNIQUE INDEX "categorias_nome_key" ON "categorias"("nome");
CREATE INDEX "itens_categoriaId_idx" ON "itens"("categoriaId");
CREATE INDEX "itens_status_idx" ON "itens"("status");
CREATE INDEX "itens_cidade_bairro_idx" ON "itens"("cidade", "bairro");
CREATE INDEX "trocas_status_idx" ON "trocas"("status");
CREATE INDEX "mensagens_trocaId_idx" ON "mensagens"("trocaId");
CREATE INDEX "avaliacoes_avaliadoId_idx" ON "avaliacoes"("avaliadoId");

-- AddForeignKey
ALTER TABLE "itens" ADD CONSTRAINT "itens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "itens" ADD CONSTRAINT "itens_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "trocas" ADD CONSTRAINT "trocas_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trocas" ADD CONSTRAINT "trocas_itemOferecidoId_fkey" FOREIGN KEY ("itemOferecidoId") REFERENCES "itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "trocas" ADD CONSTRAINT "trocas_itemDesejadoId_fkey" FOREIGN KEY ("itemDesejadoId") REFERENCES "itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_trocaId_fkey" FOREIGN KEY ("trocaId") REFERENCES "trocas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_avaliadorId_fkey" FOREIGN KEY ("avaliadorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_avaliadoId_fkey" FOREIGN KEY ("avaliadoId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_trocaId_fkey" FOREIGN KEY ("trocaId") REFERENCES "trocas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
