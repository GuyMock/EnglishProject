// Smooth nav
const navLinks=[...document.querySelectorAll('header .nav-menu a')];
navLinks.forEach(a=>a.addEventListener('click',e=>{
  const href=a.getAttribute('href');
  if(href && href.startsWith('#')){
    e.preventDefault();
    const t=document.querySelector(href);
    if(t){ t.scrollIntoView({behavior:'smooth',block:'start'}); }
  }
}));

// Mobile nav toggle
const navToggle=document.getElementById('navToggle');
const navMenu=document.getElementById('navMenu');
if(navToggle && navMenu){
  navToggle.addEventListener('click',()=>{
    const open=navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Reveal on scroll
const io=new IntersectionObserver(es=>{
  es.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('show');
      io.unobserve(en.target);
    }
  })
},{threshold:.12});
document.querySelectorAll('.reveal,.card,.tile,.io-tile,.g-item').forEach(el=>io.observe(el));

// Progress, back to top, active section
const progress=document.getElementById('progress');
const toTop=document.getElementById('toTop');
const sections=[...document.querySelectorAll('main .section')];

let ticking=false;
const onScroll=()=>{
  if(!ticking){
    window.requestAnimationFrame(()=>{
      const h=document.documentElement;
      const s=(h.scrollTop)/(h.scrollHeight-h.clientHeight||1);
      if(progress) progress.style.transform=`scaleX(${Math.min(1,Math.max(0,s))})`;
      if(toTop) toTop.classList.toggle('show', s>0.12);
      let cur=null;
      sections.forEach(sec=>{
        const r=sec.getBoundingClientRect();
        if(r.top<=120 && r.bottom>=120) cur=`#${sec.id}`;
      });
      navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===cur));
      ticking=false;
    });
    ticking=true;
  }
};
document.addEventListener('scroll',onScroll,{passive:true});
onScroll();
if(toTop) toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Card tilt
const tilts=[...document.querySelectorAll('.tilt')];
tilts.forEach(card=>{
  let rAF=null;
  const move=e=>{
    const b=card.getBoundingClientRect();
    const x=(e.clientX-b.left)/b.width-.5;
    const y=(e.clientY-b.top)/b.height-.5;
    if(rAF)cancelAnimationFrame(rAF);
    rAF=requestAnimationFrame(()=>{
      card.style.transform=`perspective(900px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
    });
  };
  const leave=()=>{
    if(rAF)cancelAnimationFrame(rAF);
    card.style.transform='perspective(900px) rotateY(0) rotateX(0)';
  };
  card.addEventListener('mousemove',move);
  card.addEventListener('mouseleave',leave);
  card.addEventListener('touchmove',(e)=>{
    if(!e.touches[0]) return;
    move({clientX:e.touches[0].clientX, clientY:e.touches[0].clientY});
  },{passive:true});
  card.addEventListener('touchend',leave);
});

// Lightbox for gallery
const gallery=[...document.querySelectorAll('.gallery .g-item img')];
const lb=document.getElementById('lightbox');
const lbImg=document.getElementById('lbImg');
const lbCap=document.getElementById('lbCap');
const lbPrev=document.querySelector('.lb-prev');
const lbNext=document.querySelector('.lb-next');
const lbClose=document.querySelector('.lb-close');
let idx=0;

function openLB(i){
  idx=i;
  const el=gallery[idx];
  lbImg.src=el.src;
  lbImg.alt=el.alt;
  lbCap.textContent=el.alt;
  lb.classList.add('show');
  lb.setAttribute('aria-hidden','false');
}
function closeLB(){
  lb.classList.remove('show');
  lb.setAttribute('aria-hidden','true');
  lbImg.removeAttribute('src');
}
function step(delta){
  idx=(idx+delta+gallery.length)%gallery.length;
  const el=gallery[idx];
  lbImg.src=el.src;
  lbImg.alt=el.alt;
  lbCap.textContent=el.alt;
}

gallery.forEach((img,i)=>{
  img.addEventListener('click',()=>openLB(i));
  img.addEventListener('keydown',(e)=>{
    if(e.key==='Enter' || e.key===' '){ openLB(i); }
  });
  img.setAttribute('tabindex','0');
});

lbPrev.addEventListener('click',()=>step(-1));
lbNext.addEventListener('click',()=>step(1));
lbClose.addEventListener('click',closeLB);
document.addEventListener('keydown',e=>{
  if(!lb.classList.contains('show')) return;
  if(e.key==='Escape') closeLB();
  if(e.key==='ArrowLeft') step(-1);
  if(e.key==='ArrowRight') step(1);
});
