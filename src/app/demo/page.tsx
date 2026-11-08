"use client";
import { useEffect, useState } from "react";
type Item = {id:string;titulo:string;descricao:string;categoria:string;icone:string;cidade:string;bairro:string;condicao:string;status:string};
type Resultado = {itens:Item[];total:number;categorias:string[];cidades:string[];modo:string;persistencia:boolean;fonte:string};
const vazio:Resultado={itens:[],total:0,categorias:[],cidades:[],modo:"demonstracao",persistencia:false,fonte:"catalogo_mockado"};
export default function DemoPage(){
  const [dados,setDados]=useState<Resultado>(vazio);
  const [q,setQ]=useState("");
  const [categoria,setCategoria]=useState("");
  const [cidade,setCidade]=useState("");
  const [selecionado,setSelecionado]=useState<string|null>(null);
  const [carregando,setCarregando]=useState(true);
  const [erro,setErro]=useState("");
  useEffect(()=>{
    const ctrl=new AbortController();
    const params=new URLSearchParams();
    if(q) params.set("q",q);
    if(categoria)params.set("categoria",categoria);
    if(cidade)params.set("cidade",cidade);
    setCarregando(true);
    fetch("/api/demo/itens?"+params.toString(),{signal:ctrl.signal,cache:"no-store"})
      .then(async r=>{if(!r.ok)throw new Error("API indisponível");return r.json()})
      .then((json:Resultado)=>{setDados(json);setErro("");setCarregando(false)})
      .catch(e=>{if(e.name!=="AbortError"){setErro("Não foi possível carregar os dados da API.");setCarregando(false)}});
    return ()=>ctrl.abort();
  },[q,categoria,cidade]);
  return <div className="space-y-8">
    <section className="rounded-2xl bg-gradient-to-br from-reuse-600 to-reuse-800 px-7 py-10 text-white">
      <div className="mb-4 inline-flex rounded-full border border-white/40 px-3 py-1 text-xs font-semibold">AMBIENTE DE DEMONSTRAÇÃO • NEXT.JS + API NODE.JS</div>
      <h1 className="text-3xl font-bold sm:text-4xl">Explorar itens ReUse!</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-reuse-50">Busque, filtre e abra os detalhes. A interface consulta a API do próprio projeto em tempo real. Os itens desta página são dados fictícios de demonstração, sem persistência PostgreSQL.</p>
      <a className="mt-5 inline-block rounded-full bg-white px-5 py-2 text-sm font-bold text-reuse-700" href="/api/demo/itens" target="_blank" rel="noreferrer">Consultar a API de demonstração ↗</a>
    </section>
    <section className="rounded-2xl border border-reuse-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-bold text-reuse-900">Encontre um produto</h2><span className="rounded-full bg-reuse-50 px-3 py-1 text-xs font-semibold text-reuse-700">{carregando?"Consultando...":dados.total+" itens"}</span></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-semibold text-reuse-800">Buscar por palavra<input aria-label="Buscar itens" className="mt-1 w-full rounded-lg border border-reuse-200 p-3 font-normal" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ex.: bicicleta, livros..." /></label>
        <label className="text-sm font-semibold text-reuse-800">Categoria<select aria-label="Categoria" className="mt-1 w-full rounded-lg border border-reuse-200 p-3 font-normal" value={categoria} onChange={e=>setCategoria(e.target.value)}><option value="">Todas</option>{["Eletrônicos","Livros","Móveis","Roupas","Brinquedos","Esporte"].map(c=><option key={c} value={c}>{c}</option>)}</select></label>
        <label className="text-sm font-semibold text-reuse-800">Cidade<select aria-label="Cidade" className="mt-1 w-full rounded-lg border border-reuse-200 p-3 font-normal" value={cidade} onChange={e=>setCidade(e.target.value)}><option value="">Todas</option>{["São Paulo","Campinas"].map(c=><option key={c} value={c}>{c}</option>)}</select></label>
      </div>
      {(q||categoria||cidade)&&<button type="button" className="mt-4 text-sm font-semibold text-reuse-700 underline" onClick={()=>{setQ("");setCategoria("");setCidade("")}}>Limpar filtros</button>}
    </section>
    {erro&&<p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
    <section aria-label="Itens disponíveis" aria-live="polite" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {dados.itens.map(item=><article key={item.id} className="overflow-hidden rounded-2xl border border-reuse-100 bg-white shadow-sm">
        <div className="flex h-36 items-center justify-center bg-reuse-50 text-6xl" aria-hidden="true">{item.icone}</div>
        <div className="space-y-3 p-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-reuse-600">{item.categoria} • {item.cidade}</span>
          <h3 className="min-h-12 text-lg font-bold text-reuse-900">{item.titulo}</h3>
          <p className="text-sm text-reuse-600">{item.descricao}</p>
          <div className="flex justify-between text-xs text-reuse-700"><span>{item.condicao}</span><span>{item.status}</span></div>
          <button type="button" aria-expanded={selecionado===item.id} onClick={()=>setSelecionado(selecionado===item.id?null:item.id)} className="w-full rounded-lg bg-reuse-600 px-4 py-2 text-sm font-bold text-white"> {selecionado===item.id?"Fechar detalhes":"Ver detalhes"} </button>
          {selecionado===item.id&&<div className="rounded-lg bg-reuse-50 p-3 text-sm text-reuse-800"><p><b>Local:</b> {item.bairro}, {item.cidade}</p><p><b>Conservação:</b> {item.condicao}</p><p className="mt-1 text-xs">Somente consulta demonstrativa: propostas de troca precisam do PostgreSQL.</p></div>}
        </div>
      </article>)}
    </section>
    {!carregando&&dados.itens.length===0&&!erro&&<p className="rounded-xl bg-reuse-50 p-6 text-center text-reuse-700">Nenhum item encontrado. Experimente outro filtro.</p>}
    <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><b>Transparência do MVP:</b> esta página demonstra comunicação real do React/Next.js com um endpoint Node.js publicado. A fonte é um conjunto de dados fictícios, não o Prisma/PostgreSQL. Cadastros persistidos, autenticação e propostas reais dependem da conexão de produção.</aside>
  </div>
}
