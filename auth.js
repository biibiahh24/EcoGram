// Demonstração local: não autentica usuários reais e não guarda senhas.
const PROFILE_KEY='ecogram-demo-profile';
function enterDemo(profile) {
 sessionStorage.setItem(PROFILE_KEY,JSON.stringify(profile));
 window.location.assign('feed.html');
}
document.getElementById('visitor-login')?.addEventListener('click',()=>enterDemo({name:'Visitante',nickname:'visitante'}));
document.getElementById('login-form')?.addEventListener('submit',event=>{
 event.preventDefault();
 const user=document.getElementById('user').value.trim(),pass=document.getElementById('password').value;
 if(user==='demo'&&pass==='demo123'){enterDemo({name:'Conta demonstração',nickname:'demo'});return;}
 const error=document.getElementById('login-error');error.textContent='Para experimentar, use demo / demo123 ou entre como visitante.';error.hidden=false;
});
document.getElementById('register-form')?.addEventListener('submit',event=>{
 event.preventDefault();if(!event.currentTarget.reportValidity())return;
 const name=document.getElementById('fullname').value.trim(),nickname=document.getElementById('nickname').value.trim();
 if(!name||!/^[a-zA-Z0-9_]{3,20}$/.test(nickname))return;
 enterDemo({name,nickname});
});