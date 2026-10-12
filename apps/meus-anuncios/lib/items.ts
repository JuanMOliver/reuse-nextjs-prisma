export type Status='active'|'paused'|'traded';
export type Category='Mobilidade'|'Casa'|'Eletrônicos'|'Livros'|'Moda'|'Esportes'|'Outros';
export type Item={id:string;title:string;description:string;category:Category;condition:string;city:string;status:Status;createdAt:number;imageUrl?:string};
export type ItemDraft=Pick<Item,'title'|'description'|'category'|'condition'|'city'|'imageUrl'>;
export const categories:Category[]=['Mobilidade','Casa','Eletrônicos','Livros','Moda','Esportes','Outros'];
export const conditions=['Novo','Muito bom','Bom estado','Regular'];
export const labels:Record<Status,string>={active:'Publicado',paused:'Pausado',traded:'Trocado'};
export const emoji:Record<Category,string>={Mobilidade:'🚲',Casa:'🪑',Eletrônicos:'📷',Livros:'📚',Moda:'👕',Esportes:'⚽',Outros:'📦'};
const now=Date.now();
export const seed:Item[]=[
{id:'RE-1001',title:'Bicicleta urbana aro 26',description:'Bicicleta revisada, em ótimo estado para uma nova troca.',category:'Mobilidade',condition:'Bom estado',city:'São Paulo',status:'active',createdAt:now-86400000},
{id:'RE-1002',title:'Mesa compacta de escritório',description:'Mesa de madeira clara, perfeita para trabalhar em casa.',category:'Casa',condition:'Muito bom',city:'São Paulo',status:'active',createdAt:now-86400000*3},
{id:'RE-1003',title:'Coleção de livros de design',description:'Livros de cores, composição e identidade visual.',category:'Livros',condition:'Bom estado',city:'Campinas',status:'active',createdAt:now-86400000*5},
{id:'RE-1004',title:'Câmera fotográfica analógica',description:'Equipamento usado e bem conservado.',category:'Eletrônicos',condition:'Regular',city:'São Paulo',status:'paused',createdAt:now-86400000*9},
{id:'RE-1005',title:'Bola de futebol oficial',description:'Troca concluída com outro membro da comunidade.',category:'Esportes',condition:'Muito bom',city:'Santos',status:'traded',createdAt:now-86400000*20}
];
export function validateItem(i:ItemDraft):string|null{
if(i.title.trim().length<3||i.title.trim().length>80)return 'Título deve ter entre 3 e 80 caracteres.';
if(i.description.trim().length<10||i.description.trim().length>500)return 'Descrição deve ter entre 10 e 500 caracteres.';
if(!categories.includes(i.category))return 'Categoria inválida.';
if(!conditions.includes(i.condition))return 'Estado de conservação inválido.';
if(i.city.trim().length<2)return 'Informe a cidade.';
if(i.imageUrl){try{const u=new URL(i.imageUrl);if(u.protocol!=='https:')return 'Use uma URL de imagem HTTPS.';}catch{return 'URL da imagem inválida.';}}
return null;
}
export function findItems(items:Item[],query:string,status:string,category:string){
const q=query.trim().toLowerCase();
return items.filter(i=>(status==='all'||i.status===status)&&(category==='all'||i.category===category)&&(!q||[i.title,i.city,i.description].some(x=>x.toLowerCase().includes(q)))).sort((a,b)=>b.createdAt-a.createdAt);
}
