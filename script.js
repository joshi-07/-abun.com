/* script.js
 - GSAP & ScrollReveal are loaded from CDN (deferred in HTML).
 - Features:
   • typed hero subtitle (simple, accessible)
   • smooth anchors
   • modal (aria + simple focus trap)
   • GSAP micro-interactions (if available)
   • ScrollReveal entrance
   • animated stat counters
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- typed hero subtitle (simple) ---------- */
  const typedSub = document.getElementById('typed-sub');
  const phrases = [
    'SEO-friendly articles, instantly.',
    'Polished product copy and social posts.',
    'Editable drafts — save hours every week.'
  ];
  let tIdx = 0, chIdx = 0, forward = true;
  function typeTick() {
    if (!typedSub) return;
    const current = phrases[tIdx];
    if (forward) {
      chIdx++;
      typedSub.textContent = current.slice(0, chIdx);
      if (chIdx >= current.length) {
        forward = false;
        setTimeout(typeTick, 900);
        return;
      }
    } else {
      chIdx--;
      typedSub.textContent = current.slice(0, chIdx);
      if (chIdx <= 0) {
        forward = true;
        tIdx = (tIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeTick, forward ? 40 : 20);
  }
  typeTick();

  /* ---------- smooth internal links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- theme toggle (simple dark/light switch) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  themeToggle && themeToggle.addEventListener('click', () => {
    const body = document.body;
    const pressed = themeToggle.getAttribute('aria-pressed') === 'true';
    themeToggle.setAttribute('aria-pressed', String(!pressed));
    if (body.classList.contains('theme-light')) {
      body.classList.remove('theme-light');
      // restore dark (CSS handles colors)
      document.documentElement.style.removeProperty('--neon-1');
      document.documentElement.style.removeProperty('--neon-2');
      body.style.background = '';
    } else {
      body.classList.add('theme-light');
      document.documentElement.style.setProperty('--neon-1', '#2563eb');
      document.documentElement.style.setProperty('--neon-2', '#7c3aed');
      body.style.background = 'linear-gradient(180deg,#f7fbff,#eef6ff)';
    }
  });

  /* ---------- modal: open/close + focus trap ---------- */
  const modal = document.getElementById('modal');
  const openBtns = document.querySelectorAll('.open-modal');
  const closeBtns = document.querySelectorAll('.modal-close, .modal .btn-ghost');
  const demoForm = document.getElementById('demoForm');
  const demoPlan = document.getElementById('demoPlan');

  const focusableSelector = 'a[href], button, textarea, input, select';
  let lastFocused = null;

  function trapFocus(modalEl) {
    const focusables = modalEl.querySelectorAll(focusableSelector);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    function handleKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === 'Escape') {
        closeModal();
      }
    }
    modalEl.addEventListener('keydown', handleKey);
    return () => modalEl.removeEventListener('keydown', handleKey);
  }

  let releaseTrap = null;
  function openModalFor(plan) {
    if (!modal) return;
    lastFocused = document.activeElement;
    if (demoPlan) demoPlan.value = plan || 'Demo';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    // focus first input
    const firstInput = modal.querySelector('input, button, textarea, a');
    firstInput && firstInput.focus();
    // gsap entrance
    if (window.gsap) gsap.fromTo('.modal-panel', {y: 20, opacity:0, scale:0.98}, {y:0, opacity:1, scale:1, duration:0.45, ease:'power3.out'});
    releaseTrap = trapFocus(modal);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (releaseTrap) { releaseTrap(); releaseTrap = null; }
    lastFocused && lastFocused.focus();
  }

  openBtns.forEach(btn => btn.addEventListener('click', () => {
    const plan = btn.dataset.plan || 'Demo Plan';
    openModalFor(plan);
  }));
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  modal && modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  /* demo form fake submission */
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('demoEmail').value.trim();
      if (!/.+@.+\..+/.test(email)) {
        alert('Please enter a valid email.');
        return;
      }
      if (window.gsap) gsap.to('.modal-panel', { scale: 0.98, duration: 0.08, yoyo:true, repeat:1 });
      alert('Thanks — demo request received (mock). This is a UI/UX concept.');
      closeModal();
    });
  }

  /* ---------- ScrollReveal entrances ---------- */
  if (window.ScrollReveal) {
    ScrollReveal().reveal('.hero-left, .hero-right, .section-head, .grid .card, .testimonial', {
      distance: '30px',
      duration: 700,
      easing: 'cubic-bezier(.2,.9,.2,1)',
      origin: 'bottom',
      interval: 80,
      cleanup: true
    });
  }

  /* ---------- CTA micro interactions via GSAP ---------- */
  if (window.gsap) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
      btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.16 }));
      btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.16 }));
      btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.98, duration: 0.06 }));
      btn.addEventListener('mouseup', () => gsap.to(btn, { scale: 1.02, duration: 0.06 }));
    });
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('.stat .num');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent || 0, 10);
    let current = 0;
    const duration = 900; // ms
    const stepTime = Math.max(8, Math.floor(duration / Math.max(1, target)));
    const increment = Math.max(1, Math.floor(target / (duration / stepTime)));
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, stepTime);
  });

  /* ---------- subtle parallax for hero image on pointer move ---------- */
  const heroRight = document.querySelector('.hero-right');
  if (heroRight) {
    heroRight.addEventListener('pointermove', (e) => {
      const rect = heroRight.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width/2) / rect.width;
      const dy = (e.clientY - rect.top - rect.height/2) / rect.height;
      const img = heroRight.querySelector('img');
      if (img && window.gsap) gsap.to(img, { x: dx * 10, y: dy * 8, rotationX: dy * 1.2, rotationY: dx * 1.2, duration: 0.6, ease: 'power2.out' });
    });
    heroRight.addEventListener('pointerleave', () => {
      const img = heroRight.querySelector('img');
      if (img && window.gsap) gsap.to(img, { x:0, y:0, rotationX:0, rotationY:0, duration:0.6, ease:'power2.out' });
    });
  }

});
