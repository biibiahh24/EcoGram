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
document.addEventListener('DOMContentLoaded',()=>{
 const input=document.getElementById('password');
 if(!input)return;
 const wrap=document.createElement('div');wrap.className='password-wrap';
 input.parentNode.insertBefore(wrap,input);wrap.append(input);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='password-toggle';toggle.textContent='Mostrar';
 toggle.setAttribute('aria-label','Mostrar senha');
 toggle.setAttribute('aria-pressed','false');
 toggle.addEventListener('click',()=>{
  const visible=input.type==='text';input.type=visible?'password':'text';
  toggle.textContent=visible?'Mostrar':'Ocultar';
  toggle.setAttribute('aria-label',visible?'Mostrar senha':'Ocultar senha');
  toggle.setAttribute('aria-pressed',String(!visible));input.focus();
 });
 wrap.append(toggle);
 document.querySelectorAll('#user,#password').forEach(field=>field.addEventListener('input',()=>{
  const error=document.getElementById('login-error');if(error)error.hidden=true;
 }));
});
