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
    fetch("/api/demo/itens?"+params.toString(),{signal:ctrl.signal,cache:"no-store"})
      .then(async r=>{if(!r.ok)throw new Error("API indisponÃ­vel");return r.json()})
      .then((json:Resultado)=>{setDados(json);setErro("");setCarregando(false)})
      .catch(e=>{if(e.name!=="AbortError"){setErro("NÃ£o foi possÃ­vel carregar os dados da API.");setCarregando(false)}});
    return ()=>ctrl.abort();
  },[q,categoria,cidade]);
  return <div classNam¶»§q«^