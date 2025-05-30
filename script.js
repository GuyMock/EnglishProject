/* Smooth scroll */
document.querySelectorAll('header nav a').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))
            .scrollIntoView({behavior:'smooth'});
  });
});

/* Fade-in cards on scroll */
const cards = document.querySelectorAll('.card');
const showCards = () => {
  const trigger = window.innerHeight * 0.85;
  cards.forEach(card=>{
    const top = card.getBoundingClientRect().top;
    if(top < trigger) card.classList.add('show');
  });
};
document.addEventListener('scroll',showCards);
showCards(); // run on load
