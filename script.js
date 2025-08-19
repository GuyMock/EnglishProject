const navLinks=[...document.querySelectorAll('header nav a')];
navLinks.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t){t.scrollIntoView({behavior:'smooth',block:'start'});}}));

const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('show');io.unobserve(en.target);}})},{threshold:.12});
document.querySelectorAll('.reveal,.card,.tile,.io-tile').forEach(el=>io.observe(el));

const progress=document.getElementById('progress');
const toTop=document.getElementById('toTop');
const onScroll=()=>{const h=document.documentElement;const s=(h.scrollTop)/(h.scrollHeight-h.clientHeight||1);progress.style.transform=`scaleX(${Math.min(1,Math.max(0,s))})`;if(s>0.12)toTop.classList.add('show');else toTop.classList.remove('show');let cur=null;document.querySelectorAll('main .section').forEach(sec=>{const r=sec.getBoundingClientRect();if(r.top<=120&&r.bottom>=120)cur=`#${sec.id}`;});navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===cur));};
document.addEventListener('scroll',onScroll);onScroll();
toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const tilts=[...document.querySelectorAll('.tilt')];
tilts.forEach(card=>{
  let rAF=null;
  const move=e=>{
    const b=card.getBoundingClientRect();
    const x=(e.clientX-b.left)/b.width-.5;
    const y=(e.clientY-b.top)/b.height-.5;
    if(rAF)cancelAnimationFrame(rAF);
    rAF=requestAnimationFrame(()=>{card.style.transform=`perspective(800px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(0)`;});
  };
  const leave=()=>{if(rAF)cancelAnimationFrame(rAF);card.style.transform='perspective(800px) rotateY(0) rotateX(0) translateY(0)';};
  card.addEventListener('mousemove',move);
  card.addEventListener('mouseleave',leave);
});
