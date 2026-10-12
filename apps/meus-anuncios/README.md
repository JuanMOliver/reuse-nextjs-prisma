# ReUse — Área Meus Anúncios (Next.js)

**FIAP | Juan Marco Oliver | RM 564575**

Área independente de gerenciamento de itens da plataforma de economia circular ReUse.

## Funcionalidades
- Indicadores: total, ativos, pausados e trocados.
- Cadastro e edição com validação: nome, categoria, conservação, cidade, descrição e URL HTTPS opcional.
- Busca textual e filtros por status e categoria.
- Pausar, reativar, concluir troca e excluir com confirmação.
- Persistência localStorage por navegador; restaurar base demonstrativa.
- Interface responsiva e feedback acessível.

## Iniciar
Instale Node.js 20+ e execute:
```bash
cd apps/meus-anuncios
npm install
npm run dev
```
Abra http://localhost:3000. Para testar as regras do domínio, execute `npm test`.

## Hospedagem Vercel
1. Importe o repositório público `JuanMOliver/reuse-nextjs-prisma` em https://vercel.com/new.
2. Em **Root Directory**, selecione `apps/meus-anuncios`.
3. Confirme Next.js como framework; mantenha os comandos padrão.
4. Clique em Deploy e aguarde finalizar.
5. Teste a URL HTTPS fornecida pela Vercel antes de entregá-la à faculdade.

## Estrutura
```text
apps/meus-anuncios/
  app/layout.tsx       metadados e estilos
  app/page.tsx         rota inicial
  app/globals.css      design responsivo
  components/Dashboard.tsx    interações do usuário
  lib/items.ts         domínio, filtros e validações
  tests/items.test.mjs testes
```

## Limitações
Este MVP usa dados fictícios salvos no navegador. Não existe login, banco compartilhado, upload de imagens nem integração em produção com os demais serviços ReUse. O app está separado do restante do projeto Prisma para permitir hospedagem sem PostgreSQL. Não é apropriado para uso multiusuário sem backend e controle de acesso.
