// Interações da demonstração local EcoGram
function like(button){
 const liked=button.getAttribute('aria-pressed')==='true';
 button.setAttribute('aria-pressed',String(!liked));
 button.textContent=liked?'♡':'♥';
 button.setAttribute('aria-label',liked?'Curtir publicação':'Descurtir publicação');
 if(!liked) window.ecogramToast?.('Publicação curtida 💚');
 const count=button.closest('.post')?.querySelector('.likes-count');
 if(count)count.textContent=liked?'0 curtidas':'1 curtida';
}
function toggleComment(id){
 const area=document.getElementById(id);if(!area)return;
 area.hidden=!area.hidden;if(!area.hidden)area.querySelector('input')?.focus();
}
function sendComment(id){
 const area=document.getElementById(id),input=area?.querySelector('input'),text=input?.value.trim();
 if(!text)return;
 const line=document.createElement('p');line.className='comment-line';line.textContent='Você: '+text;
 area.insertBefore(line,area.querySelector('.comment-input'));input.value='';
 window.ecogramToast?.('Comentário adicionado');
}
async function sharePost(button){
 try{if(navigator.share)await navigator.share({title:'EcoGram',url:location.href});
 else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);button.title='Link copiado';window.ecogramToast?.('Link copiado para compartilhar');}
 else button.title='Copie o endereço da página para compartilhar';}
 catch(error){if(error.name!=='AbortError')console.warn(error);}
}
// Sequência ilustrativa de stories: avanço automático e controle manual.
// Publicação/armazenamento de stories reais exige integração posterior com Storage.
const ECO_STORIES=[
 {name:'Maria',src:'imagem3.png',note:'Pequenas atitudes, grandes mudanças. ♻️'},
 {name:'Lucas',src:'imagem4.png',note:'Um novo olhar para a natureza. 🌳'},
 {name:'Ana',src:'imagem2.jpg',note:'Ideias que inspiram um mundo mais verde. 🌱'},
 {name:'Natureza',src:'imagemsustentavel.jpg',note:'Vamos transformar o futuro juntos. 💚'}
];
let activeStoryViewer=null;
function openStory(src,name){
 let start=ECO_STORIES.findIndex(item=>item.src===src&&item.name===name);
 if(start<0)start=0;
 startStories(start);
}
function startStories(startIndex=0){
 activeStoryViewer?.close();
 let index=Math.max(0,Math.min(startIndex,ECO_STORIES.length-1));
 let timer=null,startedAt=0,remaining=5500,paused=false,lastFocus=document.activeElement;
 const duration=5500;
 const dialog=document.createElement('div');dialog.className='eco-story-overlay';
 dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
 dialog.setAttribute('aria-label','Visualizador de stories de exemplo');
 const stage=document.createElement('section');stage.className='eco-story-stage';
 const media=document.createElement('img');media.className='eco-story-media';media.alt='';
 const shade=document.createElement('div');shade.className='eco-story-shade';
 const tracks=document.createElement('div');tracks.className='eco-story-tracks';
 const fills=ECO_STORIES.map(()=>{
  const track=document.createElement('span');track.className='eco-story-track';
  const fill=document.createElement('span');fill.className='eco-story-fill';track.append(fill);tracks.append(track);return fill;
 });
 const top=document.createElement('header');top.className='eco-story-top';
 const avatar=document.createElement('img');avatar.src='perfil.png';avatar.alt='';
 const info=document.createElement('div');info.className='eco-story-user';
 const name=document.createElement('strong'),stamp=document.createElement('span');stamp.textContent='Story ilustrativo';
 info.append(name,stamp);
 const close=document.createElement('button');close.type='button';close.className='eco-story-close';close.textContent='×';close.setAttribute('aria-label','Fechar stories');
 const caption=document.createElement('p');caption.className='eco-story-caption';
 const previous=document.createElement('button');previous.type='button';previous.className='eco-story-back';previous.setAttribute('aria-label','Story anterior');previous.textContent='‹';
 const next=document.createElement('button');next.type='button';next.className='eco-story-next';next.setAttribute('aria-label','Próximo story');next.textContent='›';
 const pause=document.createElement('button');pause.type='button';pause.className='eco-story-pause';pause.setAttribute('aria-label','Pausar stories');pause.textContent='Ⅱ';
 top.append(avatar,info,pause,close);stage.append(media,shade,tracks,top,previous,next,caption);dialog.append(stage);
 const oldOverflow=document.body.style.overflow;
 function stopTimer(){if(timer!==null){clearTimeout(timer);timer=null;}}
 function animate(){
  stopTimer();
  const fill=fills[index];fill.style.transition='none';
  fill.style.width=((duration-remaining)/duration*100)+'%';
  // Leitura do layout faz a animação retomar de onde foi pausada.
  void fill.offsetWidth;
  fill.style.transition='width '+remaining+'ms linear';fill.style.width='100%';
  startedAt=Date.now();
  timer=window.setTimeout(()=>{if(index+1<ECO_STORIES.length)show(index+1);else dismiss();},remaining);
 }
 function show(n){
  if(n<0){show(0);return;}
  if(n>=ECO_STORIES.length){dismiss();return;}
  stopTimer();index=n;remaining=duration;paused=false;
  const item=ECO_STORIES[index];media.src=item.src;media.alt='Imagem ilustrativa de '+item.name;
  name.textContent=item.name;caption.textContent=item.note;
  fills.forEach((fill,i)=>{fill.style.transition='none';fill.style.width=i<index?'100%':'0%';});
  pause.textContent='Ⅱ';pause.setAttribute('aria-label','Pausar stories');
  previous.disabled=index===0;
  animate();
 }
 function togglePause(){
  if(!paused){
   remaining=Math.max(0,remaining-(Date.now()-startedAt));
   stopTimer();const fill=fills[index];fill.style.width=getComputedStyle(fill).width;
   paused=true;pause.textContent='▶';pause.setAttribute('aria-label','Continuar stories');
  }else{
   paused=false;pause.textContent='Ⅱ';pause.setAttribute('aria-label','Pausar stories');animate();
  }
 }
 function keydown(event){
  if(event.key==='Escape'){event.preventDefault();dismiss();}
  if(event.key==='ArrowRight'){event.preventDefault();show(index+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();show(index-1);}
  if(event.key===' '){event.preventDefault();togglePause();}
  if(event.key==='Tab'){
   const buttons=[previous,next,pause,close].filter(b=>!b.disabled);
   const i=buttons.indexOf(document.activeElement);
   if(event.shiftKey&&i<=0){event.preventDefault();buttons[buttons.length-1].focus();}
   else if(!event.shiftKey&&i===buttons.length-1){event.preventDefault();buttons[0].focus();}
  }
 }
 function dismiss(){
  stopTimer();document.removeEventListener('keydown',keydown);
  document.body.style.overflow=oldOverflow;dialog.remove();activeStoryViewer=null;
  if(lastFocus?.isConnected)lastFocus.focus();
 }
 close.addEventListener('click',dismiss);
 previous.addEventListener('click',()=>show(index-1));
 next.addEventListener('click',()=>show(index+1));
 pause.addEventListener('click',togglePause);
 dialog.addEventListener('click',event=>{if(event.target===dialog)dismiss();});
 let touchStartX=0;
 stage.addEventListener('touchstart',event=>{touchStartX=event.changedTouches[0]?.screenX??0;},{passive:true});
 stage.addEventListener('touchend',event=>{
  const dx=(event.changedTouches[0]?.screenX??0)-touchStartX;
  if(Math.abs(dx)>60)show(index+(dx<0?1:-1));
 },{passive:true});
 document.body.append(dialog);document.body.style.overflow='hidden';
 document.addEventListener('keydown',keydown);activeStoryViewer={close:dismiss};
 show(index);close.focus();
}

document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.comments input').forEach(input=>{
  input.addEventListener('keydown',event=>{
   if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendComment(input.closest('.comments').id);}
  });
 });
});
