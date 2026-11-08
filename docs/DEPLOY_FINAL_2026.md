# ReUse! — Deploy real e verificacao final (08/11/2026)

## Estado auditado
- Frontend e backend Next.js/Node hospedados na Vercel.
- Paginas e API de demonstracao estao disponiveis em /demo e /api/demo/itens.
- A demonstracao usa dados ficticios sem persistencia; nao representa a base Prisma.
- Banco em producao ainda nao esta configurado; o DATABASE_URL anterior apontava para tunel temporario loca.lt e retornava P1001.
- Healthcheck: /api/health retorna HTTP 200 somente com SELECT 1 bem-sucedido; caso contrario retorna 503.

## Para ativar PostgreSQL persistente
1. No projeto Vercel `reuse-nextjs-prisma`, abra Storage / Integrations e conecte um PostgreSQL gerenciado **exclusivo para ReUse**. A integracao Prisma Postgres ja consta instalada na equipe, mas a conexao de um recurso ao projeto nao foi comprovada.
2. Escolha ambiente **Production**. Nao reaproveite banco de outro trabalho da FIAP.
3. Deixe credenciais exclusivamente nas Environment Variables da Vercel. Para o adaptador atual, `DATABASE_URL` deve ser a conexao **direta** para migracoes, e `DATABASE_URL_POOLED` a conexao **com pool** usada pelas funcoes Node em runtime. Use TLS/SSL e nao publique senhas.
4. Execute a partir de um terminal confiavel: `npm ci`, `npm run db:deploy` e, **apenas em banco novo e descartavel**, `npm run prisma:seed`. O arquivo atual `prisma/seed.ts` APAGA dados existentes: nunca execute contra banco com dados reais.
5. Confirme que `DEMO_USER_EMAIL` esta definido no ambiente de demonstracao e que o usuario de exemplo existe. O projeto **nao possui login real**.
6. Redeploy para carregar as novas variaveis. Execute a suite de testes manuais abaixo.

## Critérios de aceite
- Home `/`: HTTP 200 com indicadores coerentes; nao mostrar aviso de banco offline.
- `/api/health`: HTTP 200 JSON `{ servidor:"online", banco:"online", pronto:true }`.
- `/api/categorias` e `/api/itens`: HTTP 200 e JSON real.
- `/itens`, `/categorias`, `/busca`, `/cadastrar-item`, `/minhas-trocas`: HTTP 200 sem aviso de indisponibilidade.
- Cadastrar um item, conferir no GET, recarregar pagina/abrir outro navegador e verificar que o item persistiu.
- Criar proposta entre dois itens validos, aceitar e concluir; verificar mudancas de estado no banco e no catalogo.
- Nao usar a demo `/demo` como evidencia de gravacao real no PostgreSQL.
- Acessar em janela anonima e conferir que URLs publicas nao exigem login na Vercel.

## Segurança do MVP
- A plataforma usa usuario demonstrativo e ainda nao possui autenticacao e autorizacao por usuario.
- APIs de escrita e Server Actions nao devem ser usadas com informacoes reais ou expostas como produto publico definitivo sem autenticacao, verificacoes de propriedade e limites de requisicoes.
- Siga as politicas LGPD antes de cadastrar pessoas reais.
- O chatbot do repositorio reuse-chatbot-watson utiliza armazenamento JSON independente; integracao IBM Watson em producao exige credenciais, ambiente publicado e testes separados.

## Links
Frontend: https://reuse-nextjs-prisma-juanmolivers-projects.vercel.app/
Backend/health: https://reuse-nextjs-prisma-juanmolivers-projects.vercel.app/api/health
API itens: https://reuse-nextjs-prisma-juanmolivers-projects.vercel.app/api/itens
Demo: https://reuse-nextjs-prisma-juanmolivers-projects.vercel.app/demo
Meus anuncios (MVP separado): https://reuse-nextjs-prisma-c29h.vercel.app/
GitHub: https://github.com/JuanMOliver/reuse-nextjs-prisma

Atualizacoes do framework e de dependencias exigem repeticao dos testes de producao apos cada deploy.
