/* script.js — lightweight, performance-first interactions
   - Combined gradient + particle background (optimized)
   - Typed hero subtitle
   - Button ripple + magnetic micro-interactions
   - Card tilt (pointer) and subtle parallax
   - IntersectionObserver reveal
   - Modal with focus trap
   - Animated counters
   - Degrades gracefully with reduced-motion
*/

/* helpers */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- typed hero subtitle ---------------- */
  (function typed() {
    const el = $('#typed-sub');
    if (!el || isReduced) return;
    const phrases = [
      'SEO-friendly articles, instantly.',
      'Polished product copy and social posts.',
      'Editable drafts — save hours every week.'
    ];
    let pi = 0, ci = 0, forward = true;
    const tick = () => {
      const str = phrases[pi];
      if (forward) {
        ci++;
        el.textContent = str.slice(0, ci);
        if (ci >= str.length) { forward = false; setTimeout(tick, 1000); return; }
      } else {
        ci--;
        el.textContent = str.slice(0, ci);
        if (ci <= 0) { forward = true; pi = (pi + 1) % phrases.length; }
      }
      setTimeout(tick, forward ? 36 : 18);
    };
    tick();
  })();

  /* ---------------- particle canvas (optimized) ---------------- */
  (function particles() {
    const canvas = $('#particle-canvas');
    if (!canvas || isReduced) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(w * ratio);
    canvas.height = Math.floor(h * ratio);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(ratio, ratio);

    let particles = [];
    const MAX = Math.min(70, Math.floor((w*h)/80000)); // scale particle count with screen size

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function init() {
      particles = [];
      for (let i = 0; i < MAX; i++) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(0.8, 2.4),
          vx: rand(-0.2, 0.2),
          vy: rand(-0.05, 0.05),
          alpha: rand(0.08, 0.28)
        });
      }
    }

    function resize() {
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(ratio, ratio);
      init();
    }
    window.addEventListener('resize', resize, { passive:true });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // soft trails by overlaying rgba
      ctx.fillStyle = 'rgba(2,4,10,0.12)';
      ctx.fillRect(0,0,w,h);

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*6);
        gradient.addColorStop(0, `rgba(0,183,255,${p.alpha})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.r*6, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    init();
    draw();
  })();

  /* ---------------- intersection reveal ---------------- */
  (function reveals() {
    const items = $$('.card, .hero-left, .hero-right, .section-head');
    let delay = 0;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => {
            e.target.classList.add('reveal-visible');
          }, delay);
          delay += 100; // stagger by 100ms
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(it => obs.observe(it));
  })();

  /* ---------------- magnetic buttons + ripple ---------------- */
  (function buttonMagic() {
    // magnetic follow (subtle)
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width/2) / (r.width/2);
        const dy = (e.clientY - r.top - r.height/2) / (r.height/2);
        btn.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });

    // ripple effect (JS to create element inside button)
    function ripple(e) {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 1.6;
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size/2) + 'px';
      r.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(r);
      setTimeout(()=> r.remove(), 600);
    }
    // attach ripple to all .ripple buttons
    $$('.ripple').forEach(b => b.addEventListener('pointerdown', ripple));
  })();

  /* ---------------- card tilt ---------------- */
  (function tilt() {
    if (isReduced) return;
    $$('.card-tilt, .tilt').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * 6; // rotateX
        const ry = (px - 0.5) * -8; // rotateY
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  })();

  /* ---------------- modal accessibility ---------------- */
  (function modal() {
    const modal = $('#modal');
    const openBtns = $$('.open-modal');
    const closeBtns = $$('.modal-close');
    const demoForm = $('#demoForm');
    const planInput = $('#demoPlan');
    let lastFocus = null;

    function focusTrap(modalEl) {
      const focusables = Array.from(modalEl.querySelectorAll('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'));
      const first = focusables[0], last = focusables[focusables.length - 1];
      function handler(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        } else if (e.key === 'Escape') { closeModal(); }
      }
      modalEl.addEventListener('keydown', handler);
      return () => modalEl.removeEventListener('keydown', handler);
    }

    let releaseTrap = null;
    function openModal(plan) {
      lastFocus = document.activeElement;
      if (planInput) planInput.value = plan || '';
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      const first = modal.querySelector('input, button, a');
      first && first.focus();
      releaseTrap = focusTrap(modal);
    }
    function closeModal() {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      if (releaseTrap) { releaseTrap(); releaseTrap = null; }
      lastFocus && lastFocus.focus();
    }

    openBtns.forEach(b => b.addEventListener('click', () => openModal(b.dataset.plan)));
    closeBtns.forEach(b => b.addEventListener('click', closeModal));
    modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if (demoForm) {
      demoForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = ($('#demoEmail') || {}).value;
        if (!email || !/.+@.+\..+/.test(email)) { alert('Please enter a valid email.'); return; }
        // success micro-interaction
        alert('Thanks — demo request received (mock). This is a portfolio concept.');
        closeModal();
      });
    }
  })();

  /* ---------------- counters ---------------- */
  (function counters() {
    $$('.num').forEach(n => {
      const target = parseInt(n.dataset.target || n.textContent || 0, 10);
      if (isNaN(target)) return;
      let cur = 0;
      const duration = 900;
      const step = Math.max(1, Math.floor(target / (duration / 16)));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { n.textContent = target; clearInterval(t); }
        else n.textContent = cur;
      }, 16);
    });
  })();

  /* ---------------- smooth anchor (already present in HTML with scrollIntoView) ---------------- */
  // (extra: update active nav)
  (function navActive() {
    const sections = $$('main section[id]');
    const navlinks = $$('.nav-link');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id;
          navlinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => io.observe(s));
  })();

  /* ---------------- small perf tweaks ---------------- */
  (function perf() {
    // Pause background rendering when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // if particle loop exists, it will respect page hidden via requestAnimationFrame pause
      }
    });
  })();

}); // DOMContentLoaded end
