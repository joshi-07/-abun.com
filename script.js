// script.js — interactions, theme toggle, modal, reveals (GSAP + ScrollReveal)
// NOTE: GSAP & ScrollReveal are loaded via CDN in HTML <head>.

document.addEventListener('DOMContentLoaded', () => {

  // Smooth internal link scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Theme toggle (dark/purple <-> soft light)
  const themeToggle = document.getElementById('themeToggle');
  themeToggle && themeToggle.addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('theme-dark')) {
      body.classList.remove('theme-dark');
      body.style.background = 'linear-gradient(180deg,#f7fbff,#eef6ff)';
      // minimal adjustments for light mode
      document.documentElement.style.setProperty('--accent-a','#6b21a8');
      document.documentElement.style.setProperty('--accent-b','#4f46e5');
      document.documentElement.style.setProperty('--accent-c','#7c3aed');
      document.querySelectorAll('.glass').forEach(el => el.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.74))' );
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
    } else {
      // restore dark/purple
      document.body.style.background = '';
      document.documentElement.style.setProperty('--accent-a','#7c3aed');
      document.documentElement.style.setProperty('--accent-b','#5b21b6');
      document.documentElement.style.setProperty('--accent-c','#a78bfa');
      document.querySelectorAll('.glass').forEach(el => el.style.background = '' );
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
    }
  });

  // Modal logic
  const modal = document.getElementById('modal');
  const openBtns = document.querySelectorAll('.open-modal');
  const closeBtns = document.querySelectorAll('.modal-close, .modal .modal-close, .modal .btn-ghost');
  const demoForm = document.getElementById('demoForm');
  const demoPlanInput = document.getElementById('demoPlan');

  openBtns.forEach(b => {
    b.addEventListener('click', (e) => {
      const plan = b.dataset.plan || 'Demo Plan';
      demoPlanInput.value = plan;
      // set aria
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');

      // gentle entrance animation via GSAP
      if (window.gsap) {
        gsap.fromTo('.modal-panel', {y: 40, opacity:0}, {y:0, opacity:1, duration:0.45, ease:'power3.out'});
      }
    });
  });

  closeBtns.forEach(b => b.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }));

  // demo form fake submission
  demoForm && demoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('demoEmail').value.trim();
    if (!/.+@.+\..+/.test(email)) {
      alert('Please enter a valid email.');
      return;
    }
    // small success animation + close
    if (window.gsap) {
      gsap.to('.modal-panel', { scale:0.96, duration:0.08, yoyo:true, repeat:1 });
    }
    // show a quick success message (mock)
    alert('Thanks! Demo request received (mock). This page is a UI/UX concept for an assignment.');
    modal.classList.add('hidden');
  });

  // Scroll reveal — subtle
  if (window.ScrollReveal) {
    ScrollReveal().reveal('.hero-left, .hero-right, .section-title, .grid .card', {
      distance: '30px',
      duration: 700,
      easing: 'cubic-bezier(.2,.9,.2,1)',
      origin: 'bottom',
      interval: 80,
      cleanup: true,
      mobile: true
    });
  }

  // micro-interactions for hero CTA via GSAP
  if (window.gsap) {
    const cta = document.querySelectorAll('.btn-primary');
    cta.forEach(btn => {
      btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.03, duration: 0.18 }));
      btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.18 }));
      btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.98, duration: 0.06 }));
      btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1.02, duration: 0.06 }));
    });

    // Minor hover animations for sample cards (popup effect)
    const sampleCards = document.querySelectorAll('.card.sample');
    sampleCards.forEach(card => {
      card.addEventListener('mouseenter', () => gsap.to(card, { scale: 1.02, y: -5, duration: 0.2, ease: 'power2.out' }));
      card.addEventListener('mouseleave', () => gsap.to(card, { scale: 1, y: 0, duration: 0.2, ease: 'power2.out' }));
    });
  }
});
