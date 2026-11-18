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
function openStory(src,name){
 const backdrop=document.createElement('div');backdrop.className='story-overlay';backdrop.setAttribute('role','dialog');backdrop.setAttribute('aria-modal','true');backdrop.setAttribute('aria-label','Story de '+name);
 const card=document.createElement('div');card.className='story-modal';
 const image=document.createElement('img');image.src=src;image.alt='Story de '+name;
 const caption=document.createElement('p');caption.textContent=name;
 const close=document.createElement('button');close.type='button';close.textContent='Fechar';
 function dismiss(){backdrop.remove();document.removeEventListener('keydown',escape);}
 function escape(event){if(event.key==='Escape')dismiss();}
 close.addEventListener('click',dismiss);backdrop.addEventListener('click',event=>{if(event.target===backdrop)dismiss()});
 document.addEventListener('keydown',escape);
 card.append(image,caption,close);backdrop.append(card);document.body.append(backdrop);close.focus();
}

document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.comments input').forEach(input=>{
  input.addEventListener('keydown',event=>{
   if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendComment(input.closest('.comments').id);}
  });
 });
});
