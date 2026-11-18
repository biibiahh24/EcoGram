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
 if(display_name.length<2||!(/^[a-zA-Z0-9_]{3,20}$/.test(username))){feedback('register-status','Confira seu nome e seu usuário.');busy(signup,false);return;}
 try{
  const {data,error}=await supabase.auth.signUp({
   email,password,
   options:{emailRedirectTo:authRedirect(),data:{display_name,username}}
  });
  if(error)throw error;
  if(data.session&&data.user){
   await ensureProfile(data.user);
   window.location.replace('feed.html');
   return;
  }
  signup.reset();
  feedback('register-status','Cadastro enviado! Confira sua caixa de entrada e confirme o e-mail antes de entrar. Verifique também o spam.');
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
