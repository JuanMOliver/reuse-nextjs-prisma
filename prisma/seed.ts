import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpando dados anteriores...");
  await prisma.avaliacao.deleteMany();
  await prisma.mensagem.deleteMany();
  await prisma.troca.deleteMany();
  await prisma.item.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Criando categorias...");
  const categorias = await Promise.all(
    [
      { nome: "Eletrônicos", icone: "💻", descricao: "Celulares, notebooks, acessórios" },
      { nome: "Livros", icone: "📚", descricao: "Livros didáticos, romances, HQs" },
      { nome: "Móveis", icone: "🛋️", descricao: "Móveis e itens de decoração" },
      { nome: "Roupas", icone: "👕", descricao: "Roupas e calçados em bom estado" },
      { nome: "Brinquedos", icone: "🧸", descricao: "Brinquedos e jogos infantis" },
      { nome: "Esporte", icone: "🚲", descricao: "Bicicletas, equipamentos esportivos" },
    ].map((c) => prisma.categoria.create({ data: c }))
  );

  console.log("Criando usuários...");
  const [ana, bruno, carla, diego] = await Promise.all([
    prisma.usuario.create({
      data: { nome: "Ana Souza", email: "ana.souza@reuse.com", cidade: "São Paulo", bairro: "Vila Mariana", telefone: "11 90000-0001" },
    }),
    prisma.usuario.create({
      data: { nome: "Bruno Lima", email: "bruno.lima@reuse.com", cidade: "São Paulo", bairro: "Pinheiros", telefone: "11 90000-0002" },
    }),
    prisma.usuario.create({
      data: { nome: "Carla Nogueira", email: "carla.nogueira@reuse.com", cidade: "Campinas", bairro: "Cambuí", telefone: "19 90000-0003" },
    }),
    prisma.usuario.create({
      data: { nome: "Diego Ramos", email: "diego.ramos@reuse.com", cidade: "São Paulo", bairro: "Moema", telefone: "11 90000-0004" },
    }),
  ]);

  const [eletronicos, livros, moveis, roupas, brinquedos, esporte] = categorias;

  console.log("Criando itens...");
  const itens = await Promise.all([
    prisma.item.create({
      data: {
        titulo: "Notebook Dell Inspiron 15",
        descricao: "Notebook usado, funcionando perfeitamente. 8GB RAM, 256GB SSD. Ideal para estudos.",
        condicao: "USADO",
        cidade: "São Paulo",
        bairro: "Vila Mariana",
        categoriaId: eletronicos.id,
        usuarioId: ana.id,
      },
    }),
    prisma.item.create({
      data: {
        titulo: "Coleção Harry Potter (7 livros)",
        descricao: "Coleção completa em capa dura, ótimo estado de conservação.",
        condicao: "SEMINOVO",
        cidade: "São Paulo",
        bairro: "Pinheiros",
        categoriaId: livros.id,
        usuarioId: bruno.id,
      },
    }),
    prisma.item.create({
      data: {
        titulo: "Estante de livros de madeira",
        descricao: "Estante com 5 prateleiras, madeira maciça. Pequenos riscos de uso.",
        condicao: "USADO",
        cidade: "Campinas",
        bairro: "Cambuí",
        categoriaId: moveis.id,
        usuarioId: carla.id,
      },
    }),
    prisma.item.create({
      data: {
        titulo: "Jaqueta jeans tamanho M",
        descricao: "Usada poucas vezes, sem manchas ou rasgos.",
        condicao: "SEMINOVO",
        cidade: "São Paulo",
        bairro: "Moema",
        categoriaId: roupas.id,
        usuarioId: diego.id,
      },
    }),
    prisma.item.create({
      data: {
        titulo: "Lego Star Wars (caixa fechada)",
        descricao: "Novo, nunca aberto. Comprado a mais por engano.",
        condicao: "NOVO",
        cidade: "São Paulo",
        bairro: "Vila Mariana",
        categoriaId: brinquedos.id,
        usuarioId: ana.id,
      },
    }),
    prisma.item.create({
      data: {
        titulo: "Bicicleta aro 26",
        descricao: "Bicicleta em bom estado, pneus novos, ideal para passeios na cidade.",
        condicao: "USADO",
        cidade: "São Paulo",
        bairro: "Pinheiros",
        categoriaId: esporte.id,
        usuarioId: bruno.id,
      },
    }),
    prisma.item.create({
      data: {
        titulo: "Cadeira de escritório ergonômica",
        descricao: "Cadeira com apoio lombar, pouco tempo de uso.",
        condicao: "SEMINOVO",
        cidade: "Campinas",
        bairro: "Cambuí",
        categoriaId: moveis.id,
        usuarioId: carla.id,
      },
    }),
    prisma.item.create({
      data: {
        titulo: "Celular Motorola Moto G",
        descricao: "Funcionando bem, com pequenos riscos na tela.",
        condicao: "USADO",
        cidade: "São Paulo",
        bairro: "Moema",
        categoriaId: eletronicos.id,
        usuarioId: diego.id,
      },
    }),
  ]);

  console.log("Criando trocas de demonstração...");
  const trocaConcluida = await prisma.troca.create({
    data: {
      solicitanteId: bruno.id,
      itemOferecidoId: itens[1].id, // coleção Harry Potter (de Bruno)
      itemDesejadoId: itens[0].id, // notebook (de Ana)
      mensagem: "Oi Ana! Topo trocar minha coleção de livros pelo seu notebook.",
      status: "CONCLUIDA",
    },
  });

  await prisma.item.updateMany({
    where: { id: { in: [itens[0].id, itens[1].id] } },
    data: { status: "TROCADO" },
  });

  await prisma.troca.create({
    data: {
      solicitanteId: diego.id,
      itemOferecidoId: itens[3].id, // jaqueta jeans (de Diego)
      itemDesejadoId: itens[5].id, // bicicleta (de Bruno)
      mensagem: "Tenho interesse em trocar minha jaqueta pela bicicleta!",
      status: "PENDENTE",
    },
  });

  console.log("Criando mensagens de demonstração...");
  await prisma.mensagem.createMany({
    data: [
      { trocaId: trocaConcluida.id, autorId: bruno.id, texto: "Oi Ana! Podemos combinar a entrega?" },
      { trocaId: trocaConcluida.id, autorId: ana.id, texto: "Claro! Posso retirar na Vila Mariana no sábado." },
    ],
  });

  console.log("Criando avaliações de demonstração...");
  await prisma.avaliacao.createMany({
    data: [
      {
        avaliadorId: bruno.id,
        avaliadoId: ana.id,
        trocaId: trocaConcluida.id,
        nota: 5,
        comentario: "Troca tranquila, item exatamente como descrito!",
      },
      {
        avaliadorId: ana.id,
        avaliadoId: bruno.id,
        trocaId: trocaConcluida.id,
        nota: 5,
        comentario: "Combinou tudo rapidinho, super recomendo.",
      },
    ],
  });

  console.log("Seed finalizado com sucesso! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
