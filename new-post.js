const POST_KEY='ecogram-session-posts';
function getPosts(){try{return JSON.parse(sessionStorage.getItem(POST_KEY)||'[]')}catch{return []}}
function renderLocalPosts(){
 const target=document.getElementById('local-posts');if(!target)return;
 const posts=getPosts();target.replaceChildren();
 for(const post of posts){
  const article=document.createElement('article');article.className='surface post';
  const top=document.createElement('div');top.className='post-top';
  const avatar=document.createElement('img');avatar.src='perfil.png';avatar.alt='';avatar.className='avatar';
  const info=document.createElement('div');info.className='user-info';
  const name=document.createElement('strong');name.textContent=post.author;
  const sub=document.createElement('small');sub.textContent='Publicação local · nesta sessão';
  info.append(name,sub);top.append(avatar,info);article.append(top);
  if(post.image){const image=document.createElement('img');image.className='post-image';image.src=post.image;image.alt='Imagem enviada nesta sessão';article.append(image);}
  const details=document.createElement('div');details.className='post-details';
  const caption=document.createElement('p');caption.className='caption';caption.textContent=post.caption;details.append(caption);
  const meta=document.createElement('p');meta.className='post-meta';meta.textContent='Visível somente neste navegador';details.append(meta);article.append(details);target.append(article);
 }
}
document.addEventListener('DOMContentLoaded',()=>{
 renderLocalPosts();
 const form=document.getElementById('post-form');if(!form)return;
 form.addEventListener('submit',async event=>{
  event.preventDefault();const caption=form.querySelector('#post-caption').value.trim(),file=form.querySelector('#post-image').files[0],status=document.getElementById('post-status');
  if(!caption){status.textContent='Escreva uma legenda para continuar.';return;}
  if(file && (file.size>1024*1024 || !['image/png','image/jpeg','image/webp'].includes(file.type))){status.textContent='Escolha uma imagem PNG, JPG ou WebP de até 1 MB.';return;}
  let image=null;
  if(file){image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}
  let profile={name:'Visitante'};try{profile=JSON.parse(sessionStorage.getItem('ecogram-demo-profile')||'{}')}catch{}
  const posts=getPosts();posts.unshift({caption,image,author:profile.name||'Visitante'});try{sessionStorage.setItem(POST_KEY,JSON.stringify(posts.slice(0,5)))}catch{status.textContent='Espaço local insuficiente: tente publicar sem imagem.';return;}
  location.assign('feed.html');
 });
});