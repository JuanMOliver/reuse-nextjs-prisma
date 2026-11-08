import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// Dados explicitamente demonstrativos; nao representam registros do PostgreSQL.
const itens = [
  {id:"demo-01",titulo:"Notebook Dell Inspiron 15",descricao:"Notebook 8GB RAM e SSD 256GB, ideal para estudos.",categoria:"Eletrônicos",icone:"💻",cidade:"São Paulo",bairro:"Vila Mariana",condicao:"USADO",status:"Disponível"},
  {id:"demo-02",titulo:"Coleção de livros clássicos",descricao:"Seis livros bem conservados para ganhar novos leitores.",categoria:"Livros",icone:"📚",cidade:"São Paulo",bairro:"Pinheiros",condicao:"SEMINOVO",status:"Disponível"},
  {id:"demo-03",titulo:"Estante de madeira",descricao:"Estante com cinco prateleiras, em bom estado.",categoria:"Móveis",icone:"🪑",cidade:"Campinas",bairro:"Cambuí",condicao:"USADO",status:"Disponível"},
  {id:"demo-04",titulo:"Jaqueta jeans tamanho M",descricao:"Peça pouco usada e sem avarias.",categoria:"Roupas",icone:"👕",cidade:"São Paulo",bairro:"Moema",condicao:"SEMINOVO",status:"Disponível"},
  {id:"demo-05",titulo:"Brinquedo de blocos",descricao:"Conjunto completo de peças de montar.",categoria:"Brinquedos",icone:"🧸",cidade:"São Paulo",bairro:"Vila Mariana",condicao:"NOVO",status:"Disponível"},
  {id:"demo-06",titulo:"Bicicleta urbana aro 26",descricao:"Bicicleta revisada e pronta para novos passeios.",categoria:"Esporte",icone:"🚲",cidade:"São Paulo",bairro:"Pinheiros",condicao:"USADO",status:"Disponível"},
  {id:"demo-07",titulo:"Cadeira ergonômica",descricao:"Cadeira de escritório com apoio lombar.",categoria:"Móveis",icone:"🪑",cidade:"Campinas",bairro:"Cambuí",condicao:"SEMINOVO",status:"Disponível"},
  {id:"demo-08",titulo:"Celular Motorola Moto G",descricao:"Aparelho funcional com leves marcas de uso.",categoria:"Eletrônicos",icone:"📱",cidade:"São Paulo",bairro:"Moema",condicao:"USADO",status:"Disponível"}
] as const;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const termo = (params.get("q") || "").toLocaleLowerCase("pt-BR").trim();
  const categoria = params.get("categoria") || "";
  const cidade = params.get("cidade") || "";
  const encontrados = itens.filter(item =>
    (!termo || [item.titulo,item.descricao,item.cidade,item.categoria].some(s => s.toLocaleLowerCase("pt-BR").includes(termo))) &&
    (!categoria || item.categoria === categoria) &&
    (!cidade || item.cidade === cidade)
  );
  return NextResponse.json({
    plataforma:"ReUse!",
    modo:"demonstracao",
    persistencia:false,
    fonte:"catalogo_mockado",
    total:encontrados.length,
    categorias:[...new Set(itens.map(i=>i.categoria))],
    cidades:[...new Set(itens.map(i=>i.cidade))],
    itens:encontrados,
    observacao:"Endpoint Node.js demonstrativo. Dados independentes do banco Prisma/PostgreSQL."
  }, {headers:{"Cache-Control":"no-store"}});
}
