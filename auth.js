import {supabase,ensureProfile,authRedirect,friendlyError} from './ecogram-client.js';

const login=document.getElementById('login-form');
const signup=document.getElementById('register-form');
const recover=document.getElementById('recover-form');
const passwordReset=document.getElementById('reset-form');

function feedback(id,message){
 const el=document.getElementById(id);
 if(el){el.textContent=message;el.hidden=false;}
}
function busy(form,active){
 const button=form?.querySelector('button[type="submit"]');
 if(button){button.disabled=active;button.setAttribute('aria-busy',String(active));}
}
function showPasswordToggle(input){
 if(!input)return;
 const wrap=document.createElement('div');wrap.className='password-wrap';
 input.parentNode.insertBefore(wrap,input);wrap.append(input);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='password-toggle';
 toggle.textContent='Mostrar';toggle.setAttribute('aria-label','Mostrar senha');toggle.setAttribute('aria-pressed','false');
 toggle.addEventListener('click',()=>{
  const show=input.type==='password';input.type=show?'text':'password';
  toggle.textContent=show?'Ocultar':'Mostrar';
  toggle.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');
  toggle.setAttribute('aria-pressed',String(show));input.focus();
 });
 wrap.append(toggle);
}
for(const input of document.querySelectorAll('input[type="password"]'))showPasswordToggle(input);

login?.addEventListener('submit',async event=>{
 event.preventDefault();if(!login.reportValidity())return;
 busy(login,true);
 const email=document.getElementById('user').value.trim();
 const password=document.getElementById('password').value;
 try{
  const {data,error}=await supabase.auth.signInWithPassword({email,password});
  if(error)throw error;
  if(!data.user)throw Error('Não foi possível autenticar sua conta.');
  await ensureProfile(data.user);
  window.location.replace('feed.html');
 }catch(error){feedback('login-error',friendlyError(error));}
 finally{busy(login,false);}
});
signup?.addEventListener('submit',async event=>{
 event.preventDefault();if(!signup.reportValidity())return;
 busy(signup,true);
 const email=document.getElementById('email').value.trim();
 const password=document.getElementById('password').value;
 const display_name=document.getElementById('fullname').value.trim();
 const username=document.getElementById('nickname').value.trim();
 const confirmation=document.getElementById('confirm-password')?.value;
 if(display_name.length<2||!(/^[a-zA-Z0-9_]{3,20}$/.test(username))){feedback('register-status','Confira seu nome e seu usuário.');busy(signup,false);return;}
 if(password.length<8){feedback('register-status','Sua senha precisa ter no mínimo 8 caracteres.');busy(signup,false);return;}
 if(password!==confirmation){feedback('register-status','As senhas não coincidem. Confira os dois campos.');busy(signup,false);return;}
 if(!document.getElementById('public-info-consent')?.checked){feedback('register-status','Confirme que entendeu quais dados ficam públicos na comunidade.');busy(signup,false);return;}
 try{
  const existing=await supabase.from('ecogram_profiles').select('id').ilike('username',username).limit(1);
  if(existing.error)throw existing.error;
  if(existing.data?.length){feedback('register-status','Esse @usuário já está em uso. Escolha outro.');return;}
  const {data,error}=await supabase.auth.signUp({
   email,password,
   options:{emailRedirectTo:authRedirect(),data:{display_name,username}}
  });
  if(error)throw error;
  if(!data?.user)throw Error('Não foi possível criar a conta. Tente novamente.');
  if(data.session&&data.user){
   await ensureProfile(data.user);
   window.location.replace('feed.html');
   return;
  }
  signup.reset();
  feedback('register-status','Agora confirme seu e-mail! Enviamos as instruções para o endereço informado, se o cadastro puder ser concluído. Verifique também o spam. Depois, volte e entre com sua senha.');
 }catch(error){feedback('register-status',friendlyError(error));}
 finally{busy(signup,false);}
});
recover?.addEventListener('submit',async event=>{
 event.preventDefault();if(!recover.reportValidity())return;
 busy(recover,true);
 try{
  const email=document.getElementById('recover-email').value.trim();
  const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/recuperar.html'});
  if(error)throw error;
  feedback('recover-status','Se o endereço estiver cadastrado, enviaremos um link de recuperação por e-mail.');
 }catch(error){feedback('recover-status',friendlyError(error));}
 finally{busy(recover,false);}
});
passwordReset?.addEventListener('submit',async event=>{
 event.preventDefault();if(!passwordReset.reportValidity())return;
 busy(passwordReset,true);
 try{
  const password=document.getElementById('new-password').value;
  const {error}=await supabase.auth.updateUser({password});
  if(error)throw error;
  await supabase.auth.signOut();
  feedback('reset-status','Senha atualizada! Entre novamente com sua nova senha.');
  passwordReset.hidden=true;
  recover.hidden=false;
 }catch(error){feedback('reset-status',friendlyError(error));}
 finally{busy(passwordReset,false);}
});
if(recover){
 const showReset=()=>{recover.hidden=true;passwordReset.hidden=false;};
 supabase.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY')showReset();});
 const locationInfo=window.location.hash+window.location.search;
 if(/type=recovery|access_token=/.test(locationInfo)){
  supabase.auth.getSession().then(({data})=>{if(data.session)showReset()});
 }
}
for(const field of document.querySelectorAll('input'))field.addEventListener('input',()=>{
 const box=field.closest('form')?.querySelector('[role="alert"]');
 if(box)box.hidden=true;
});

/* Feedback imediato para o cadastro como em uma rede social. */
const strengthField=document.getElementById('password');
const bars=document.querySelector('.strength-bars');
const strengthLabel=document.getElementById('password-strength-label');
function scorePassword(value){
 if(!value)return 0;
 let points=0;
 if(value.length>=8)points++;
 if(value.length>=12)points++;
 if(/[a-z]/.test(value)&&/[A-Z]/.test(value))points++;
 if(/[0-9]/.test(value)&&/[^A-Za-z0-9]/.test(value))points++;
 return Math.max(1,Math.min(4,points));
}
if(bars&&strengthField){
 strengthField.addEventListener('input',()=>{
  const score=scorePassword(strengthField.value);
  bars.dataset.strength=String(score);
  strengthLabel.textContent=['Use ao menos 8 caracteres.','Senha fraca — adicione letras e números.','Senha razoável — pode melhorar.','Boa senha!','Senha forte!'][score];
 });
}
const confirmField=document.getElementById('confirm-password');
if(confirmField&&strengthField){
 confirmField.addEventListener('input',()=>{
  confirmField.setCustomValidity(confirmField.value&&confirmField.value!==strengthField.value?'As senhas precisam ser iguais.':'');
 });
 strengthField.addEventListener('input',()=>{confirmField.setCustomValidity('')});
}
