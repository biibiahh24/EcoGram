// Exploração local de demonstração: preserva galeria e categorias da tela original.
const items = [
  {name:"Reciclagem e reutilização",category:"postagens",tag:"sustentabilidade",image:"imagem3.png"},
  {name:"Natureza e consciência ambiental",category:"postagens",tag:"sustentabilidade",image:"imagem4.png"},
  {name:"Ideias verdes da comunidade",category:"perfis",tag:"sustentabilidade",image:"imagem2.jpg"},
  {name:"Hábitos para um futuro sustentável",category:"postagens",tag:"sustentabilidade",image:"imagemsustentavel.jpg"}
];
let activeFilter="tudo";
function pesquisarExplorar(){renderExplore();}
function filtrarExplorar(category){
 activeFilter=category;
 document.querySelectorAll(".filter").forEach(button=>{
  const selected=button.getAttribute("onclick")?.includes("'"+category+"'");
  button.classList.toggle("ativo",selected);
  button.setAttribute("aria-pressed",String(selected));
 });
 renderExplore();
}
function renderExplore(){
 const container=document.getElementById("explorarContainer");
 if(!container)return;
 const term=(document.getElementById("barraPesquisa")?.value||"").toLocaleLowerCase("pt-BR").trim();
 const filtered=items.filter(item=>(activeFilter==="tudo"||item.category===activeFilter||item.tag===activeFilter)&&item.name.toLocaleLowerCase("pt-BR").includes(term));
 container.replaceChildren();
 if(!filtered.length){const p=document.createElement("p");p.textContent="Nenhum resultado para essa busca.";p.className="explore-empty";container.append(p);return;}
 for(const item of filtered){
  const card=document.createElement("article");card.className="explore-card";
  const image=document.createElement("img");image.src=item.image;image.alt=item.name;image.loading="lazy";
  const title=document.createElement("p");title.textContent=item.name;
  card.append(image,title);container.append(card);
 }
}
document.addEventListener("DOMContentLoaded",renderExplore);
