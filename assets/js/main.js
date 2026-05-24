/* ============================================================
   CECECOB — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Cinta promocional: cerrar y recordar ---
  const promoBar   = document.getElementById('promoBar');
  const promoClose = document.getElementById('promoClose');

  // Si el usuario ya la cerró en esta sesión, ocultarla de inmediato
  if (sessionStorage.getItem('promoClosed') === '1' && promoBar) {
    promoBar.style.display = 'none';
  }

  if (promoClose && promoBar) {
    promoClose.addEventListener('click', (e) => {
      e.stopPropagation(); // evita que el click active el link de WhatsApp
      promoBar.classList.add('hidden');
      setTimeout(() => { promoBar.style.display = 'none'; }, 300);
      sessionStorage.setItem('promoClosed', '1');
    });
  }

  // --- Hamburguesa: abrir/cerrar menú móvil ---
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    // Cerrar menú al hacer clic en cualquier enlace
    navMenu.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Enlace activo según sección visible (scroll spy) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar__link');

  if (sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => spyObserver.observe(s));
  }

  // --- Navbar: sombra al hacer scroll ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Empatía: botones interactivos ---
  const empathyBtns  = document.querySelectorAll('.empathy__btn');
  const empathyTexts = document.querySelectorAll('.empathy__panel-texts p');

  // Activar el primero por defecto
  if (empathyTexts.length) empathyTexts[0].classList.add('active');

  empathyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-index');
      empathyBtns.forEach(b => b.classList.remove('active'));
      empathyTexts.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const target = document.querySelector(`.empathy__panel-texts p[data-index="${idx}"]`);
      if (target) target.classList.add('active');
    });
  });

  // --- FAQ: acordeón ---
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq__question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Abrir el primero por defecto
  if (faqItems.length > 0) faqItems[0].classList.add('open');

  // --- Smooth scroll para anclas internas ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Animación de entrada al hacer scroll (Intersection Observer) ---
  const animatedEls = document.querySelectorAll(
    '.value__card, .empathy__item, .process__step, .testimonial-card, .faq__item'
  );
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;
      observer.observe(el);
    });
  }

  // --- Contador regresivo: 17 de junio 2026 ---
  const targetDate = new Date('2026-06-17T00:00:00');
  const cdDias     = document.getElementById('cd-dias');
  const cdHoras    = document.getElementById('cd-horas');
  const cdMinutos  = document.getElementById('cd-minutos');
  const cdSegundos = document.getElementById('cd-segundos');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now  = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      if (cdDias) cdDias.closest('.countdown').innerHTML =
        '<p style="color:var(--c-green);font-weight:700;font-size:1.2rem;">¡La generación ya arrancó!</p>';
      return;
    }
    const dias     = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas    = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
    if (cdDias)     cdDias.textContent     = pad(dias);
    if (cdHoras)    cdHoras.textContent    = pad(horas);
    if (cdMinutos)  cdMinutos.textContent  = pad(minutos);
    if (cdSegundos) cdSegundos.textContent = pad(segundos);
  }

  if (cdDias) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // --- Contador animado en barra de credibilidad ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = prefix + current.toLocaleString('es-MX') + suffix;
          if (current >= target) clearInterval(timer);
        }, 20);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  // --- Modal: Aviso de Privacidad ---
  const privacyModal  = document.getElementById('privacyModal');
  const openPrivacy   = document.getElementById('openPrivacy');
  const closePrivacy  = document.getElementById('closePrivacy');
  const acceptPrivacy = document.getElementById('acceptPrivacy');

  function openModal()  { if (privacyModal) { privacyModal.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function closeModal() { if (privacyModal) { privacyModal.classList.remove('open'); document.body.style.overflow = ''; } }

  if (openPrivacy)   openPrivacy.addEventListener('click', openModal);
  if (closePrivacy)  closePrivacy.addEventListener('click', closeModal);
  if (acceptPrivacy) acceptPrivacy.addEventListener('click', closeModal);

  // Cerrar al hacer clic fuera del modal
  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal();
    });
  }
  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ============================================================
     WOW EFFECTS — Visual polish & micro-interactions
     ============================================================ */

  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  // ── 1. Scroll progress bar ──────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.prepend(progressBar);
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });

  // ── 2. Cursor glow (desktop only) ──────────────────────────
  if (!isTouchDevice) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    let glowActive = false;
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
      if (!glowActive) { cursorGlow.style.opacity = '1'; glowActive = true; }
    });
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0'; glowActive = false;
    });
  }

  // ── 3. Hero: Aurora blobs ───────────────────────────────────
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const aurora = document.createElement('div');
    aurora.className = 'hero__aurora';
    aurora.innerHTML =
      '<div class="hero__aurora-blob"></div>' +
      '<div class="hero__aurora-blob"></div>' +
      '<div class="hero__aurora-blob"></div>';
    const heroBg = heroSection.querySelector('.hero__bg');
    if (heroBg) heroSection.insertBefore(aurora, heroBg.nextSibling);
    else heroSection.prepend(aurora);
  }

  // ── 4. Hero: Floating particles ────────────────────────────
  if (heroSection) {
    const particlesWrap = document.createElement('div');
    particlesWrap.className = 'hero__particles';
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';
      const size  = (Math.random() * 6 + 2.5).toFixed(1);   // 2.5–8.5px (más grandes)
      const drift = ((Math.random() - 0.5) * 120).toFixed(0); // más dispersión
      p.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${(Math.random() * 100).toFixed(1)}%`,
        `bottom:${(Math.random() * 25).toFixed(1)}%`,
        `animation-duration:${(Math.random() * 18 + 20).toFixed(1)}s`,
        `animation-delay:-${(Math.random() * 20).toFixed(1)}s`,
        `--drift:${drift}px`,
        `opacity:0`
      ].join(';');
      particlesWrap.appendChild(p);
    }
    heroSection.appendChild(particlesWrap);
  }

  // ── 5. 3D Card tilt (desktop only) ─────────────────────────
  if (!isTouchDevice) {
    document.querySelectorAll('.value__card, .process__step, .testimonial-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r   = card.getBoundingClientRect();
        const dx  = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const dy  = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        const deg = 13;
        card.style.transform = `perspective(600px) rotateX(${-dy * deg}deg) rotateY(${dx * deg}deg) translateZ(14px)`;
        card.style.boxShadow = `${-dx*20}px ${-dy*20}px 40px rgba(0,0,0,0.14), ${dx*8}px ${dy*8}px 20px rgba(182,244,0,0.15)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  // ── A. Hero: entrada cinematográfica ────────────────────────
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const heroKids = Array.from(heroContent.children);
    heroKids.forEach(el => el.classList.add('hero-anim-init'));
    // Doble RAF garantiza que el estado inicial se pinta antes de la transición
    requestAnimationFrame(() => requestAnimationFrame(() => {
      heroKids.forEach((el, i) => {
        el.style.transition = `
          opacity  0.85s cubic-bezier(0.16,1,0.3,1) ${0.18 + i * 0.18}s,
          transform 0.85s cubic-bezier(0.16,1,0.3,1) ${0.18 + i * 0.18}s,
          filter   0.85s ease                        ${0.18 + i * 0.18}s
        `;
        el.classList.remove('hero-anim-init');
      });
    }));
  }

  // ── E. Section titles: wipe reveal al hacer scroll ──────────
  document.querySelectorAll('.section-title').forEach(title => {
    // Envolver el texto en la estructura wipe
    const wrapper = document.createElement('span');
    wrapper.className = 'title-wipe';
    const inner = document.createElement('span');
    inner.className = 'title-wipe-inner';
    inner.innerHTML = title.innerHTML;
    wrapper.appendChild(inner);
    title.innerHTML = '';
    title.appendChild(wrapper);

    const wipeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wrapper.classList.add('is-visible');
          wipeObserver.unobserve(title);
        }
      });
    }, { threshold: 0.25 });
    wipeObserver.observe(title);
  });

  // ── F. Ripple en clicks ──────────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2.2;
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left:  ${e.clientX - rect.left - size / 2}px;
        top:   ${e.clientY - rect.top  - size / 2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 680);
    });
  });

  // ── 6. Magnetic buttons (desktop only) ─────────────────────
  if (!isTouchDevice) {
    document.querySelectorAll('.btn--primary.btn--lg').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
        btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
        btn.style.transform  = '';
        setTimeout(() => { btn.style.transition = ''; }, 450);
      });
    });
  }

});
