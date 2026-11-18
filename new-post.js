import {supabase,ensureProfile,friendlyError} from './ecogram-client.js';

function node(tag,cls,text){
 const item=document.createElement(tag);
 if(cls)item.className=cls;
 if(text!==undefined)item.textContent=text;
 return item;
}
function showFeedStatus(target,message){
 const item=node('p','surface eco-empty',message);
 target.replaceChildren(item);
}
async function renderFeed(){
 const target=document.getElementById('remote-posts');
 if(!target)return;
 showFeedStatus(target,'Carregando publicações...');
 const {data:posts,error}=await supabase.from('ecogram_posts')
  .select('id,author_id,body,created_at').order('created_at',{ascending:false}).limit(40);
 if(error){showFeedStatus(target,'Não foi possível carregar as publicações: '+friendlyError(error));return;}
 if(!posts?.length){showFeedStatus(target,'Nossa comunidade está começando! Seja a primeira pessoa a compartilhar uma atitude sustentável. 🌱');return;}
 const authors=[...new Set(posts.map(post=>post.author_id))];
 const {data:profiles,error:profilesError}=await supabase.from('ecogram_profiles')
  .select('id,display_name,username').in('id',authors);
 if(profilesError){showFeedStatus(target,'Não foi possível carregar os autores: '+friendlyError(profilesError));return;}
 const names=new Map((profiles||[]).map(person=>[person.id,person]));
 target.replaceChildren();
 for(const post of posts){
  const author=names.get(post.author_id);
  const article=node('article','surface post');
  const top=node('div','post-top');
  const avatar=node('img','avatar');avatar.src='perfil.png';avatar.alt='';
  const user=node('div','user-info');
  user.append(node('strong','',author?.display_name||'Pessoa EcoGram'),node('small','',('@'+(author?.username||'ecogram'))+' · Comunidade'));
  top.append(avatar,user);
  const details=node('div','post-details');
  const caption=node('p','caption',post.body);
  const actions=node('div','post-actions');
  const share=node('button','', '↗');share.type='button';share.setAttribute('aria-label','Compartilhar publicação');
  share.addEventListener('click',async()=>{
   const data={title:'EcoGram',text:post.body,url:window.location.origin+'/feed.html'};
   try{
    if(navigator.share)await navigator.share(data);
    else if(navigator.clipboard){await navigator.clipboard.writeText(data.text+'\n'+data.url);window.ecogramToast?.('Publicação copiada para compartilhar');}
   }catch(error){if(error.name!=='AbortError')window.ecogramToast?.('Não foi possível compartilhar');}
  });
  actions.append(share);
  const date=new Date(post.created_at);
  const meta=node('p','post-meta',Number.isNaN(date.getTime())?'EcoGram · Comunidade':date.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'}));
  details.append(caption,actions,meta);article.append(top,details);target.append(article);
 }
}
async function submitPost(form){
 const status=document.getElementById('post-status');
 const caption=form.querySelector('#post-caption').value.trim();
 if(!caption||caption.length>1500){status.textContent='Escreva uma legenda de até 1.500 caracteres.';return;}
 const file=form.querySelector('#post-image')?.files?.[0];
 if(file){status.textContent='O envio de imagens será ativado na próxima etapa. Publique somente o texto por enquanto.';return;}
 const button=form.querySelector('button[type="submit"]');button.disabled=true;
 status.textContent='Publicando...';
 try{
  const {data,error}=await supabase.auth.getUser();
  if(error||!data?.user){window.location.replace('login.html');return;}
  await ensureProfile(data.user);
  const result=await supabase.from('ecogram_posts').insert({author_id:data.user.id,body:caption});
  if(result.error)throw result.error;
  window.location.assign('feed.html');
 }catch(error){status.textContent='Não foi possível publicar: '+friendlyError(error);}
 finally{button.disabled=false;}
}
document.addEventListener('DOMContentLoaded',()=>{
 renderFeed();
 const form=document.getElementById('post-form');
 form?.addEventListener('submit',event=>{event.preventDefault();if(form.reportValidity())submitPost(form)});
});
