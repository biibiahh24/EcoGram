// Sessão local do projeto acadêmico. Não substitui autenticação em servidor.
const ECOGRAM_SESSION='ecogram-demo-profile';
let currentProfile=null;
try {currentProfile=JSON.parse(sessionStorage.getItem(ECOGRAM_SESSION)||'null');}catch {sessionStorage.removeItem(ECOGRAM_SESSION);}
if (!currentProfile || typeof currentProfile.nickname!=='string') {
 window.location.replace('login.html');
} else {
 document.addEventListener('DOMContentLoaded',()=>{
   const nickname=document.getElementById('profile-nickname');
   const name=document.getElementById('profile-name');
   if(nickname)nickname.textContent='@'+currentProfile.nickname;
   if(name)name.textContent=currentProfile.name;
   document.querySelectorAll('.mini-user strong').forEach(el=>el.textContent=currentProfile.name||'Visitante');
   document.querySelectorAll('.mini-user span').forEach(el=>el.textContent='@'+currentProfile.nickname);
   for(const button of document.querySelectorAll('#logout,#settings-logout')){
     button.addEventListener('click',event=>{
       event.preventDefault();
       ecogramLogout();
     });
   }
   enhanceInterface();
 });
}
// Encerramento consistente em todas as telas, sem alterar outras abas do navegador.
function ecogramLogout(){
 sessionStorage.removeItem(ECOGRAM_SESSION);
 sessionStorage.removeItem('ecogram-session-posts');
 sessionStorage.removeItem('ecogram-challenge-selections');
 window.location.replace('login.html');
}
// Garante que o botão Voltar não exiba uma sessão antiga restaurada pelo navegador.
window.addEventListener('pageshow',event=>{
 if(!event.persisted)return;
 let profile=null;
 try{profile=JSON.parse(sessionStorage.getItem(ECOGRAM_SESSION)||'null')}catch{}
 if(!profile || typeof profile.nickname!=='string')window.location.replace('login.html');
});
function enhanceInterface(){
 // Ícones consistentes em vez de símbolos de texto diferentes entre desktop e celular.
 const icons={
  'feed.html':'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  'explorar.html':'<circle cx="10.8" cy="10.8" r="7.1"/><path d="m16 16 5 5"/>',
  'postar.html':'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
  'desafios.html':'<path d="M12 22s-7-3.8-7-10.5A6.5 6.5 0 0 1 11.5 5c0 6.5-3 9-3 9s8.5-1 8.5-9a6.5 6.5 0 0 1 1 12.5C16 20 12 22 12 22z"/>',
  'perfil.html':'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  'chat.html':'<rect x="3" y="4" width="18" height="15" rx="3"/><path d="m8 19-3 3v-3M7 10h10M7 14h7"/>',
  'notificacoes.html':'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  'ranking.html':'<path d="M7 4h10v3a5 5 0 0 1-10 0V4ZM7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6v4H9z"/>'
 };
 function svgFor(href){return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+icons[href]+'</svg>';}
 for(const nav of document.querySelectorAll('.sidebar-nav a, .bottom-nav a')){
   const target=nav.getAttribute('href');
   if(!icons[target])continue;
   const placeholder=nav.querySelector('.nav-icon, b[aria-hidden]');
   if(placeholder)placeholder.innerHTML=svgFor(target);
 }
 for(const link of document.querySelectorAll('.mobile-actions a')){
   const target=link.getAttribute('href');if(icons[target])link.innerHTML=svgFor(target);
 }
 // Sinalização visual acessível e sem bloqueios.
 const region=document.createElement('div');
 region.className='toast-region';region.setAttribute('role','status');region.setAttribute('aria-live','polite');
 document.body.append(region);
 window.ecogramToast=function(message){
   const item=document.createElement('div');item.className='eco-toast';item.textContent=message;
   region.replaceChildren(item);
   window.setTimeout(()=>{if(item.isConnected)item.remove();},3400);
 };
 // Pré-visualização da imagem antes de publicar.
 const input=document.getElementById('post-image');
 if(input){
  const preview=document.createElement('img');preview.className='post-media-preview';preview.alt='Pré-visualização da foto selecionada';preview.hidden=true;
  input.insertAdjacentElement('afterend',preview);
  let url=null;
  input.addEventListener('change',()=>{
   if(url){URL.revokeObjectURL(url);url=null;}
   const file=input.files?.[0];
   if(!file || !file.type.startsWith('image/')){preview.hidden=true;preview.removeAttribute('src');return;}
   url=URL.createObjectURL(file);preview.src=url;preview.hidden=false;
  });
  window.addEventListener('pagehide',()=>{if(url)URL.revokeObjectURL(url);},{once:true});
 }
}


/* Controles compartilhados do wireframe EcoGram */
document.addEventListener('DOMContentLoaded',()=>{
 const search=document.getElementById('message-search');
 search?.addEventListener('input',()=>{
  const q=search.value.trim().toLocaleLowerCase('pt-BR');
  document.querySelectorAll('.message-list .activity').forEach(row=>row.hidden=!row.textContent.toLocaleLowerCase('pt-BR').includes(q));
 });
 const notices=[...document.querySelectorAll('[data-notice-type]')];
 document.querySelectorAll('[data-notice-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.noticeFilter;
  document.querySelectorAll('[data-notice-filter]').forEach(btn=>{const active=button===btn;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))});
  notices.forEach(row=>row.hidden=filter!=='all'&&row.dataset.noticeType!==filter);
 }));
 const podium=document.querySelector('.ranking-podium');
 const rankList=podium?.nextElementSibling;
 document.querySelectorAll('[data-rank-filter]').forEach(button=>button.addEventListener('click',()=>{
  const type=button.dataset.rankFilter;
  document.querySelectorAll('[data-rank-filter]').forEach(b=>{const active=button===b;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  if(podium)podium.hidden=type!=='geral';
  if(rankList?.classList.contains('activity-list'))rankList.hidden=type!=='geral';
  let empty=document.getElementById('rank-empty');
  if(!empty&&podium){empty=document.createElement('p');empty.id='rank-empty';empty.className='form-hint';podium.after(empty)}
  if(empty){empty.hidden=type==='geral';empty.textContent=type==='amigos'?'A classificação entre amigos ficará disponível com perfis conectados.':'A classificação por desafios ficará disponível com o acompanhamento de progresso.';}
 }));
 const count=document.getElementById('profile-post-count');
 if(count){try{const posts=JSON.parse(sessionStorage.getItem('ecogram-session-posts')||'[]');count.textContent=String(Array.isArray(posts)?posts.length:0)}catch{count.textContent='0'}}
 // A saída é controlada pela mesma função no Perfil e em Configurações.
});
