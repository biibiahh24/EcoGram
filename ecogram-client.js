// Chave publishable é pública por definição. Nunca adicionar service_role ou secret key aqui.
// SDK fixado na versão usada para revisão; atualizar com testes de regressão.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0';

const SUPABASE_URL='https://elowpjvepunkcksjcvwe.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_r_r0er8fOh4pfK5OtvqZuQ_2CopxjOw';
export const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
 auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});
export const authRedirect=()=>window.location.origin+'/login.html';

function safeUsername(value){return /^[a-zA-Z0-9_]{3,20}$/.test(value||'')?value:'';}
export function displayOf(user){
 return {name:String(user?.user_metadata?.display_name||user?.email?.split('@')[0]||'Pessoa EcoGram').slice(0,60),nickname:safeUsername(user?.user_metadata?.username)||('eco_'+(user?.id||'usuario').replace(/-/g,'').slice(0,12))};
}
// Um perfil é criado *depois* de uma sessão autenticada, com id vinculado a auth.uid() via RLS.
// Se o nome de usuário já existir, usa um identificador estável para não bloquear o login.
export async function ensureProfile(user){
 if(!user?.id)throw Error('Sessão não encontrada. Faça login novamente.');
 const existing=await supabase.from('ecogram_profiles').select('id,username,display_name,bio').eq('id',user.id).maybeSingle();
 if(existing.error)throw existing.error;
 if(existing.data)return existing.data;
 const preferred=displayOf(user);
 const fallback='eco_'+user.id.replace(/-/g,'').slice(0,12);
 for(const username of [...new Set([preferred.nickname,fallback])]){
  const result=await supabase.from('ecogram_profiles').insert({id:user.id,username,display_name:preferred.name}).select('id,username,display_name,bio').single();
  if(!result.error)return result.data;
  if(result.error.code==='23505'){const again=await supabase.from('ecogram_profiles').select('id,username,display_name,bio').eq('id',user.id).maybeSingle();if(again.data)return again.data;continue;}
  throw result.error;
 }
 throw Error('Não foi possível criar seu perfil. Tente um usuário diferente.');
}
export function friendlyError(error){
 const message=String(error?.message||error||'Não foi possível concluir a operação.');
 if(/invalid login credentials/i.test(message))return 'E-mail ou senha incorretos.';
 if(/email not confirmed/i.test(message))return 'Confirme seu e-mail antes de entrar.';
 if(/password should be at least|password.*characters/i.test(message))return 'Use uma senha com pelo menos 8 caracteres.';
 if(/already registered|user already registered/i.test(message))return 'Já existe uma conta com esse e-mail. Faça login.';
 if(/rate limit|too many requests/i.test(message))return 'Muitas tentativas. Tente novamente mais tarde.';
 if(/failed to fetch|network/i.test(message))return 'Sem conexão com o servidor. Verifique sua internet.';
 return message;
}
