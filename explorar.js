// Busca e filtros da galeria de conteúdo do EcoGram.
const items=[
 {name:"Reciclagem e reutilização",category:"reciclagem",image:"imagem3.png"},
 {name:"Natureza e consciência ambiental",category:"natureza",image:"imagem4.png"},
 {name:"Pessoas da comunidade verde",category:"comunidade",image:"imagem2.jpg"},
 {name:"Hábitos para um futuro sustentável",category:"natureza",image:"imagemsustentavel.jpg"}
];
let activeFilter="tudo";
function pesquisarExplorar(){renderExplore()}
function filtrarExplorar(category){
 activeFilter=category;
 for(const button of document.querySelectorAll('.filter')){
  const match=button.getAttribute('onclick')?.includes("'"+category+"'");
  button.classList.toggle('ativo',match);
  button.setAttribute('aria-pressed',String(match));
 }
 renderExplore();
}
function renderExplore(){
 const container=document.getElementById('explorarContainer');if(!container)return;
 const term=(document.getElementById('barraPesquisa')?.value||'').trim().toLocaleLowerCase('pt-BR');
 const filtered=items.filter(item=>{
  const categoryMatch=activeFilter==='tudo'||activeFilter==='sustentabilidade'||item.category===activeFilter;
  return categoryMatch&&(item.name.toLocaleLowerCase('pt-BR').includes(term)||item.category.includes(term));
 });
 container.replaceChildren();
 if(!filtered.length){const empty=document.createElement('p');empty.className='explore-empty';empty.textContent='Nenhuma publicação encontrada. Experimente outra busca.';container.append(empty);return;}
 for(const item of filtered){
  const card=document.createElement('article');card.className='explore-card';
  const image=document.createElement('img');image.src=item.image;image.alt=item.name;image.loading='lazy';
  const caption=document.createElement('p');caption.textContent=item.name;
  card.append(image,caption);container.append(card);
 }
}
document.addEventListener('DOMContentLoaded',renderExplore);
