# ♻️ ReUse! — Plataforma Web (Next.js + Prisma ORM + PostgreSQL)

Versão web da plataforma **ReUse!**, focada em troca e doação de itens para incentivar o
consumo consciente e a economia circular. Este repositório contém **apenas as telas mais
relevantes** para uma via de acesso alternativa (web) ao app mobile já existente — não é uma
réplica completa do mobile.

## Stack

| Camada        | Tecnologia                          |
|---------------|--------------------------------------|
| Framework web | Next.js 14 (App Router, TypeScript) |
| Estilização   | Tailwind CSS                        |
| ORM           | Prisma ORM                          |
| Banco de dados| PostgreSQL 16                       |
| Validação     | Zod                                  |

## Telas desenvolvidas

| Rota                  | Objetivo                                                                 |
|-----------------------|---------------------------------------------------------------------------|
| `/`                   | Home institucional: proposta de valor, indicadores e itens recentes.     |
| `/itens`              | Catálogo com busca, filtros (categoria, cidade, texto) e paginação.      |
| `/itens/[id]`         | Ficha detalhada do item + formulário de proposta de troca.               |
| `/busca`              | Busca dedicada com prévia de resultados em tempo real.                   |
| `/categorias`         | Navegação por categorias com contagem de itens disponíveis.              |
| `/cadastrar-item`     | Cadastro de novo item via Server Action.                                 |
| `/perfil/[id]`        | Perfil público do usuário: itens publicados e avaliações recebidas.      |
| `/minhas-trocas`      | Painel (kanban) de propostas de troca: aceitar, recusar, concluir, avaliar. |

Além das telas, o projeto expõe uma **API interna** (`/api/itens`, `/api/categorias`,
`/api/trocas`) que reaproveita o mesmo Prisma Client — útil para uma futura integração com o
app mobile ou com outros consumidores.

## Estrutura do repositório

```
reuse-nextjs-prisma/
├── package.json
├── docker-compose.yml
├── .env.example
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── page.tsx                  (Home)
│   │   ├── itens/                    (catálogo + ficha detalhada)
│   │   ├── busca/
│   │   ├── categorias/
│   │   ├── cadastrar-item/
│   │   ├── perfil/[id]/
│   │   ├── minhas-trocas/
│   │   ├── api/                      (itens, categorias, trocas)
│   │   └── actions.ts                (Server Actions com Zod + Prisma)
│   ├── components/                   (Navbar, ItemCard, SearchForm, StatsBar, Footer)
│   └── lib/
│       ├── prisma.ts                 (singleton do Prisma Client)
│       ├── session.ts                (usuário demo — ver "Limitações")
│       └── format.ts
└── docs/
```

## Como executar o projeto

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Subir o PostgreSQL local via Docker
docker compose up -d

# 4. Gerar o Prisma Client
npx prisma generate

# 5. Rodar as migrations (cria as tabelas no banco)
npx prisma migrate dev --name init

# 6. Popular o banco com dados de demonstração
npx prisma db seed

# 7. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**.

Para inspecionar o banco visualmente: `npx prisma studio`.

## Limitações e próximos passos (transparência de escopo)

- **Autenticação:** o protótipo ainda não possui login real. Ações que dependem de um usuário
  logado (cadastrar item, propor troca, avaliar) usam um **usuário de demonstração** fixo
  (`DEMO_USER_EMAIL`), documentado em `src/lib/session.ts`. Próximo passo natural seria
  integrar NextAuth.js.
- **Upload de imagem:** o campo de foto aceita apenas uma URL; não há upload de arquivo binário.
- **Notificações e chat completo:** o modelo `Mensagem` já existe no banco (pensando em
  evolução futura de um chat entre usuários dentro de uma troca), mas a tela de conversa
  completa não foi implementada nesta entrega — o foco foi cobrir os 3 critérios da atividade
  (Next.js, Prisma, banco de dados) com profundidade.

## Licença

Projeto acadêmico, sem fins comerciais.
