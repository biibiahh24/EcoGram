// Os desafios deste estágio acadêmico guardam a seleção apenas durante a sessão.
const KEY='ecogram-challenge-selections';
function readSelections(){try{return JSON.parse(sessionStorage.getItem(KEY)||'[]')}catch{return []}}
document.addEventListener('DOMContentLoaded',()=>{
 const cards=[...document.querySelectorAll('.challenge')],buttons=[...document.querySelectorAll('[data-challenge-filter]')];
 const selected=readSelections();
 const filterButtons=buttons.length?buttons:[];
 const displayStatus=card=>{const i=cards.indexOf(card);return selected.includes(i)?'active':'available';};
 cards.forEach((card,i)=>{
  const button=card.querySelector('.join-challenge');if(!button)return;
  const active=selected.includes(i);
  card.dataset.status=active?'active':'available';
  button.setAttribute('aria-pressed',String(active));
  button.textContent=active?'✓ Participando':'Participar';
  const progress=card.querySelector('.challenge-progress>span');if(progress)progress.style.width=active?'18%':'0%';
  button.addEventListener('click',()=>{
   const current=readSelections();const index=current.indexOf(i);
   if(index>=0)current.splice(index,1);else current.push(i);
   sessionStorage.setItem(KEY,JSON.stringify(current));
   selected.splice(0,selected.length,...current);
   card.dataset.status=selected.includes(i)?'active':'available';
   button.setAttribute('aria-pressed',String(selected.includes(i)));
   button.textContent=selected.includes(i)?'✓ Participando':'Participar';
   if(progress)progress.style.width=selected.includes(i)?'18%':'0%';
   applyFilter();
  });
 });
 let category='all';
 function applyFilter(){
  let visible=0;
  cards.forEach(card=>{const status=displayStatus(card);const show=category==='all'||category===status;card.hidden=!show;if(show)visible++});
  let empty=document.getElementById('challenge-empty');
  if(!empty){empty=document.createElement('p');empty.id='challenge-empty';empty.className='form-hint';cards[0]?.parentElement?.after(empty)}
  empty.textContent=category==='done'?'O acompanhamento de conclusão estará disponível em uma próxima versão.':'Nenhum desafio nesta categoria.';
  empty.hidden=visible>0;
 }
 for(const button of filterButtons)button.addEventListener('click',()=>{
  category=button.dataset.challengeFilter;
  filterButtons.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  applyFilter();
 });
 applyFilter();
});
