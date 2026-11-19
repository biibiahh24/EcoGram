import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=process.cwd();
const pages=readdirSync(root).filter(x=>x.endsWith('.html'));
test('Páginas principais da rede social existem',()=>{
 for(const x of ['index.html','login.html','cadastro.html','recuperar.html','feed.html','explorar.html','desafios.html','perfil.html','postar.html','notificacoes.html','chat.html','ranking.html'])assert.ok(existsSync(join(root,x)),x);
});
test('Assets e links usados nas páginas existem',()=>{
 for(const p of pages){const source=readFileSync(join(root,p),'utf8');
 for(const match of source.matchAll(/(?:href|src)\s*=\s*["']([^"'#]+)["']/gi)){
 const path=match[1].split(/[?#]/)[0];if(!path||/^(https?:|mailto:|tel:|data:|\/\/)/i.test(path))continue;
 const file=resolve(root,path.replace(/^\//,''));
 assert.ok(file.startsWith(root+'/')&&existsSync(file),p+' → '+path);
 }}
});
test('Páginas têm viewport, idioma e título',()=>{
 for(const p of pages){const s=readFileSync(join(root,p),'utf8');
 assert.match(s,/<meta\s+name=["']viewport["']/i,p);
 assert.match(s,/<html[^>]+lang=["']pt-BR["']/i,p);
 assert.match(s,/<title>[^<]+<\/title>/i,p);
 }}
);
test('Fluxo de entrada está conectado ao aplicativo',()=>{
 assert.match(readFileSync('index.html','utf8'),/login\.html/);
 assert.match(readFileSync('login.html','utf8'),/id=["']login-form["']/);
 assert.match(readFileSync('cadastro.html','utf8'),/id=["']register-form["']/);
 assert.match(readFileSync('feed.html','utf8'),/app-session\.js/);
 assert.match(readFileSync('perfil.html','utf8'),/id=["']logout["']/);
});
test('Scripts essenciais ligados à interface',()=>{
 for(const p of ['feed.html','explorar.html','desafios.html','postar.html']){
  const s=readFileSync(p,'utf8');assert.match(s,/<script\b[^>]*\bsrc=["'][^"']+["']/i,p);
 }
});


test('Sair está presente no Perfil e nas Configurações',()=>{
 const profile=readFileSync('perfil.html','utf8');
 const settings=readFileSync('configuracao.html','utf8');
 const script=readFileSync('app-session.js','utf8');
 assert.match(profile,/id=["']logout["']/,'Botão Sair do Perfil');
 assert.match(settings,/id=["']settings-logout["']/,'Sair da conta em Configurações');
 assert.match(script,/querySelectorAll\('#logout,#settings-logout'\)/,'Ambos usam o mesmo fluxo de saída');
 assert.match(script,/function ecogramLogout\(\)/,'Fluxo de encerramento');
 for(const key of ['ecogram-demo-profile','ecogram-session-posts','ecogram-challenge-selections']){
  assert.match(script,new RegExp(key),'Encerramento remove '+key);
 }
 assert.match(script,/pageshow/,'Retorno pelo navegador é revalidado');
 assert.match(script,/window\.location\.replace\('login\.html'\)/,'Sai para login sem manter perfil no histórico');
});
test('Nova identidade está integrada às abas',()=>{
 for(const p of ['feed.html','explorar.html','desafios.html','perfil.html','postar.html','chat.html','notificacoes.html','ranking.html','configuracao.html']){
  const s=readFileSync(p,'utf8');
  assert.match(s,/ecogram-light\.css/,p);
  assert.match(s,/ecogram-logo\.svg/,p);
  assert.match(s,/ecogram-mark\.svg/,p);
 }
});

test('Integração Supabase preserva segurança de autenticação',()=>{
 const client=readFileSync('ecogram-client.js','utf8');
 const auth=readFileSync('auth.js','utf8');
 const session=readFileSync('app-session.js','utf8');
 const features=readFileSync('ecogram-features.js','utf8');
 assert.match(client,/sb_publishable_/);
 assert.doesNotMatch(client,/['"]sb_secret_[A-Za-z0-9_-]+['"]/);
 assert.doesNotMatch(client,/role\s*:\s*['"]service_role['"]/);
 assert.match(auth,/signUp\(/);
 assert.match(auth,/signInWithPassword\(/);
 assert.match(auth,/resetPasswordForEmail\(/);
 assert.match(auth,/updateUser\(/);
 assert.match(session,/auth\.getUser\(/);
 assert.match(session,/auth\.signOut\(/);
 for(const table of ['ecogram_posts','ecogram_likes','ecogram_comments','ecogram_stories','ecogram_messages'])
  assert.match(features,new RegExp("from\\('"+table+"'\\)"),table);
 assert.match(features,/storage\.from\('ecogram-media'\)\.upload/);
});
test('Entrada e páginas privadas usam módulos autenticados',()=>{
 for(const p of ['login.html','cadastro.html','recuperar.html'])
  assert.match(readFileSync(p,'utf8'),/type="module" src="auth\.js"/,p);
 for(const p of ['feed.html','explorar.html','desafios.html','perfil.html','postar.html','chat.html','chat_abrir.html','notificacoes.html','ranking.html','configuracao.html'])
  assert.match(readFileSync(p,'utf8'),/type="module" src="app-session\.js"/,p);
});


test('Stories carregam do Supabase com reprodução automática e controles acessíveis',()=>{
 const story=readFileSync('ecogram-features.js','utf8');
 const feed=readFileSync('feed.html','utf8');
 const page=readFileSync('stories.html','utf8');
 assert.match(story,/function storyView\(/);
 assert.match(story,/setTimeout\(\(\)=>show\(index\+1\),5500\)/);
 assert.match(story,/aria-modal/);
 assert.match(story,/Fechar stories/);
 assert.match(story,/clearTimeout\(timer\)/);
 assert.match(story,/function renderStories\(user\)/);
 assert.match(story,/storyView\(rows\.filter/);
 assert.match(story,/#story-play/);
 assert.match(feed,/class="surface stories"/);
 assert.match(feed,/ecogram-features\.js/);
 assert.match(page,/id="story-play"/);
 assert.match(page,/ecogram-features\.js/);
});
test('Cadastro EcoGram exige informações completas e confirmação',()=>{
 const page=readFileSync('cadastro.html','utf8');
 const auth=readFileSync('auth.js','utf8');
 const login=readFileSync('login.html','utf8');
 for(const id of ['fullname','nickname','email','password','confirm-password','public-info-consent']){
  assert.match(page,new RegExp('id=["\\\']'+id+'["\\\']'),id);
 }
 assert.match(auth,/signUp\(/);
 assert.match(auth,/password!==confirmation/);
 assert.match(auth,/public-info-consent/);
 assert.match(auth,/ilike\('username',username\)/);
 assert.match(auth,/password-strength-label/);
 assert.doesNotMatch(login,/demo123|Entrar como visitante/);
 assert.match(login,/href="cadastro\.html"/);
});
