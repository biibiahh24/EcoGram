// Demonstração de sessão somente no navegador; não constitui proteção de rotas no servidor.
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
   document.getElementById('logout')?.addEventListener('click',()=>{
     sessionStorage.removeItem(ECOGRAM_SESSION);
     window.location.assign('login.html');
   });
 });
}
