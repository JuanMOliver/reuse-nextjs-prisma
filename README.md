# ♻️ ReUse! — Plataforma Web

Plataforma para troca e doação de itens, desenvolvida com Next.js, Prisma ORM e PostgreSQL,
com foco em consumo consciente e economia circular.

## Stack

| Camada        | Tecnologia                          |
|---------------|--------------------------------------|
| Framework web | Next.js 14 (App Router, TypeScript) |
| Estilização   | Tailwind CSS                        |
| ORM           | Prisma ORM                          |
| Banco de dados| PostgreSQL 16                       |
| Validação     | Zod                                  |

## Funcionalidades

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

O projeto também expõe uma **API interna** (`/api/itens`, `/api/categorias`, `/api/trocas`)
que utiliza o mesmo Prisma Client.

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

# 6. Popular o banco com dados iniciais
npx prisma db seed

# 7. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**.

Para inspecionar o banco visualmente: `npx prisma studio`.

## Limitações e próximos passos

- **Autenticação:** ainda não há login real. Ações que dependem de um usuário logado (cadastrar
  item, propor troca e avaliar) usam o usuário definido em `DEMO_USER_EMAIL`. A integração com
  um provedor de autenticação é o próximo passo recomendado.
- **Upload de imagem:** o campo de foto aceita apenas uma URL; não há upload de arquivo binário.
- **Notificações e chat completo:** o modelo `Mensagem` já existe no banco (pensando em
  evolução futura de um chat entre usuários dentro de uma troca), mas a tela de conversa
  completa ainda não foi implementada.

## Publicação

Para publicar a aplicação, use um serviço compatível com Next.js, como a Vercel, e um serviço
gerenciado de PostgreSQL, como Neon, Supabase ou Railway.

1. Crie um banco PostgreSQL e copie a URL de conexão.
2. Importe este repositório na Vercel.
3. Configure as variáveis `DATABASE_URL` e `DEMO_USER_EMAIL` no projeto da Vercel.
4. Execute `npx prisma migrate deploy` apontando para o banco de produção.
5. Faça um novo deploy e verifique a URL gerada pela Vercel.

## Licença

Uso educacional e não comercial.
