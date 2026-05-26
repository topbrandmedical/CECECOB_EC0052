/* ============================================================
   CECECOB — main.js v7
   Módulos:
   1. Promo bar
   2. Hamburguesa / menú móvil
   3. Scroll spy (nav activo)
   4. Navbar: sombra al scroll
   5. Empatía: panel interactivo
   6. FAQ: acordeón
   7. Smooth scroll
   8. Animaciones al scroll (Intersection Observer)
   9. Contador regresivo 17 junio 2026
   10. Contador animado (números credibilidad)
   11. Modal aviso de privacidad
   12. WOW Effects (scroll bar, cursor glow, aurora, partículas,
       tilt, shimmer, hero entry, wipe reveal, ripple, magnetic btn)
   13. [NUEVO] Social proof toasts
   14. [NUEVO] Exit intent modal
   15. [NUEVO] Mobile sticky CTA bar
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. CINTA PROMOCIONAL
  ────────────────────────────────────────────────────────── */
  const promoBar   = document.getElementById('promoBar');
  const promoClose = document.getElementById('promoClose');

  if (sessionStorage.getItem('promoClosed') === '1' && promoBar) {
    promoBar.style.display = 'none';
  }

  const promoWaUrl = 'https://wa.me/524774095662?text=Hola%2C%20quiero%20aprovechar%20el%20precio%20de%20promoci%C3%B3n%20en%20el%20Estandar%20EC0052';
  if (promoBar) {
    promoBar.addEventListener('click', (e) => {
      if (!e.target.closest('.promo-bar__close')) {
        window.open(promoWaUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

  if (promoClose && promoBar) {
    promoClose.addEventListener('click', (e) => {
      e.stopPropagation();
      promoBar.classList.add('hidden');
      setTimeout(() => { promoBar.style.display = 'none'; }, 300);
      sessionStorage.setItem('promoClosed', '1');
    });
  }

  /* ──────────────────────────────────────────────────────────
     2. HAMBURGUESA / MENÚ MÓVIL
  ────────────────────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navMenu.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     3. SCROLL SPY — enlace activo en navbar
  ────────────────────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────────────────────
     4. NAVBAR — sombra al hacer scroll
  ────────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     5. EMPATÍA — panel interactivo
  ────────────────────────────────────────────────────────── */
  const empathyBtns  = document.querySelectorAll('.empathy__btn');
  const empathyTexts = document.querySelectorAll('.empathy__panel-texts p');

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

  /* ──────────────────────────────────────────────────────────
     6. FAQ — acordeón (solo un item abierto a la vez)
  ────────────────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq__question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  // Abrir el primero por defecto
  if (faqItems.length > 0) {
    faqItems[0].classList.add('open');
    faqItems[0].querySelector('.faq__question')?.setAttribute('aria-expanded', 'true');
  }

  /* ──────────────────────────────────────────────────────────
     7. SMOOTH SCROLL para anclas internas
  ────────────────────────────────────────────────────────── */
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

  /* ──────────────────────────────────────────────────────────
     8. ANIMACIONES AL SCROLL — fade-in + slide-up
  ────────────────────────────────────────────────────────── */
  const animatedEls = document.querySelectorAll(
    '.value__card, .pricing__card, .process__step, .testimonial-card, .faq__item, .guarantee'
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
      el.style.transition = `opacity 0.45s ease ${i * 55}ms, transform 0.45s ease ${i * 55}ms`;
      observer.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────
     9. CONTADOR REGRESIVO — 17 de junio 2026
  ────────────────────────────────────────────────────────── */
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
      const countdown = cdDias?.closest('.countdown');
      if (countdown) {
        countdown.innerHTML = '<p style="color:var(--c-brand);font-weight:700;font-size:1.2rem;">¡La generación ya arrancó!</p>';
      }
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

  /* ──────────────────────────────────────────────────────────
     10. CONTADOR ANIMADO — números en barra de credibilidad
  ────────────────────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step  = Math.ceil(target / 60);
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

  /* ──────────────────────────────────────────────────────────
     11. MODAL — Aviso de Privacidad
  ────────────────────────────────────────────────────────── */
  const privacyModal  = document.getElementById('privacyModal');
  const openPrivacy   = document.getElementById('openPrivacy');
  const closePrivacy  = document.getElementById('closePrivacy');
  const acceptPrivacy = document.getElementById('acceptPrivacy');

  function openPrivacyModal()  { if (privacyModal) { privacyModal.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function closePrivacyModal() { if (privacyModal) { privacyModal.classList.remove('open'); document.body.style.overflow = ''; } }

  if (openPrivacy)   openPrivacy.addEventListener('click', openPrivacyModal);
  if (closePrivacy)  closePrivacy.addEventListener('click', closePrivacyModal);
  if (acceptPrivacy) acceptPrivacy.addEventListener('click', closePrivacyModal);
  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => { if (e.target === privacyModal) closePrivacyModal(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closePrivacyModal(); closeExitModal(); }
  });

  /* ──────────────────────────────────────────────────────────
     12. WOW EFFECTS
  ────────────────────────────────────────────────────────── */
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  // 12a. Scroll progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.prepend(progressBar);
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });

  // 12b. Cursor glow (desktop only)
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

  // 12c. Hero: Aurora blobs
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

  // 12d. Hero: Floating particles
  if (heroSection) {
    const particlesWrap = document.createElement('div');
    particlesWrap.className = 'hero__particles';
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';
      const size  = (Math.random() * 6 + 2.5).toFixed(1);
      const drift = ((Math.random() - 0.5) * 120).toFixed(0);
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

  // 12e. 3D Card tilt (desktop only)
  if (!isTouchDevice) {
    document.querySelectorAll('.value__card, .process__step, .testimonial-card, .pricing__card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r   = card.getBoundingClientRect();
        const dx  = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const dy  = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        const deg = 10; // reducido para pricing cards
        card.style.transform = `perspective(600px) rotateX(${-dy * deg}deg) rotateY(${dx * deg}deg) translateZ(10px)`;
        card.style.boxShadow = `${-dx*16}px ${-dy*16}px 32px rgba(0,0,0,0.12), ${dx*6}px ${dy*6}px 16px rgba(182,244,0,0.12)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  // 12f. Hero entry animation
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const heroKids = Array.from(heroContent.children);
    heroKids.forEach(el => el.classList.add('hero-anim-init'));
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

  // 12g. Section titles wipe reveal
  document.querySelectorAll('.section-title').forEach(title => {
    const wrapper = document.createElement('span');
    wrapper.className = 'title-wipe';
    const inner = document.createElement('span');
    inner.className = 'title-wipe-inner';
    inner.innerHTML = title.innerHTML;
    wrapper.appendChild(inner);
    title.innerHTML = '';
    title.appendChild(wrapper);

    const wipeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          wrapper.classList.add('is-visible');
          wipeObs.unobserve(title);
        }
      });
    }, { threshold: 0.25 });
    wipeObs.observe(title);
  });

  // 12h. Ripple on button click
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

  // 12i. Magnetic buttons (desktop only)
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

  /* ──────────────────────────────────────────────────────────
     13. SOCIAL PROOF TOASTS [NUEVO]
     Muestra actividad de otros usuarios para generar
     urgencia social. Datos ficticios pero creíbles.
     Se muestra en la esquina inferior DERECHA (sobre el botón
     de WhatsApp), auto-cierra en 6 segundos, rota cada 2 min.
     18 personas de distintas ciudades de México.
  ────────────────────────────────────────────────────────── */
  const toastData = [
    {
      name:   'Ana R.',
      avatar: 'A',
      city:   'CDMX',
      action: 'solicitó información sobre la certificación EC0052 y preguntó cuándo arranca la próxima generación',
      time:   'hace 4 min'
    },
    {
      name:   'Carlos M.',
      avatar: 'C',
      city:   'Monterrey, NL',
      action: 'acaba de reservar su lugar en la generación de junio 2026 al precio especial de $9,990',
      time:   'hace 11 min'
    },
    {
      name:   'Laura V.',
      avatar: 'L',
      city:   'Guadalajara, Jal.',
      action: 'preguntó por el plan de 3 mensualidades de $3,330 para poder inscribirse sin afectar su presupuesto',
      time:   'hace 19 min'
    },
    {
      name:   'Roberto S.',
      avatar: 'R',
      city:   'León, Gto.',
      action: 'se inscribió esta mañana y ya recibió acceso a su primer módulo del programa híbrido',
      time:   'hace 27 min'
    },
    {
      name:   'Sofía P.',
      avatar: 'S',
      city:   'Aguascalientes',
      action: 'contactó a un asesor para saber si su experiencia en óptica de 6 años es suficiente para certificarse',
      time:   'hace 35 min'
    },
    {
      name:   'Miguel Á.',
      avatar: 'M',
      city:   'Querétaro',
      action: 'preguntó si el programa en línea es compatible con su horario de trabajo de lunes a sábado',
      time:   'hace 48 min'
    },
    {
      name:   'Diana L.',
      avatar: 'D',
      city:   'Puebla, Pue.',
      action: 'se inscribió la semana pasada y compartió que llevaba 2 años buscando una certificación oficial válida',
      time:   'hace 1 hora'
    },
    {
      name:   'Omar J.',
      avatar: 'O',
      city:   'Tijuana, BC',
      action: 'confirmó su pago de primera mensualidad y recibió su contrato de inscripción para la generación de junio',
      time:   'hace 1 hora'
    },
    {
      name:   'Patricia G.',
      avatar: 'P',
      city:   'San Luis Potosí',
      action: 'solicitó información para inscribir a dos de sus empleados de óptica en el programa EC0052',
      time:   'hace 2 horas'
    },
    {
      name:   'Eduardo N.',
      avatar: 'E',
      city:   'Saltillo, Coah.',
      action: 'preguntó si la certificación EC0052 es reconocida para trabajar en cadenas de ópticas y con aseguradoras',
      time:   'hace 2 horas'
    },
    {
      name:   'Fernanda T.',
      avatar: 'F',
      city:   'Toluca, Méx.',
      action: 'reservó dos lugares, uno para ella y otro para su socia que lleva 8 años atendiendo en su óptica',
      time:   'hace 3 horas'
    },
    {
      name:   'Jesús H.',
      avatar: 'J',
      city:   'Mérida, Yuc.',
      action: 'verificó su certificado recién obtenido en el portal RENAP de conocer.gob.mx — ¡ya aparece publicado!',
      time:   'hace 4 horas'
    },
    {
      name:   'Valeria R.',
      avatar: 'V',
      city:   'Hermosillo, Son.',
      action: 'se inscribió tras recibir una inspección de COFEPRIS en su óptica y necesitar respaldo legal urgente',
      time:   'hace 5 horas'
    },
    {
      name:   'Andrés C.',
      avatar: 'A',
      city:   'Veracruz, Ver.',
      action: 'preguntó cómo funciona la garantía del programa y si aplica si no pasa la evaluación final',
      time:   'hoy'
    },
    {
      name:   'Mónica E.',
      avatar: 'M',
      city:   'Chihuahua, Chih.',
      action: 'agendó su evaluación diagnóstica gratuita con un asesor para conocer su nivel antes de inscribirse',
      time:   'hoy'
    },
    {
      name:   'Ricardo B.',
      avatar: 'R',
      city:   'Culiacán, Sin.',
      action: 'obtuvo su certificación EC0052 hace 3 meses y ya firmó contrato como proveedor de una aseguradora',
      time:   'esta semana'
    },
    {
      name:   'Claudia O.',
      avatar: 'C',
      city:   'Oaxaca, Oax.',
      action: 'preguntó cuántos lugares quedan disponibles para junio 2026 porque quiere asegurar el precio especial',
      time:   'esta semana'
    },
    {
      name:   'Héctor F.',
      avatar: 'H',
      city:   'Morelia, Mich.',
      action: 'se inscribió y comentó que ya intentó certificarse antes con otro curso que no estaba avalado por CONOCER',
      time:   'esta semana'
    },
  ];

  const socialToast  = document.getElementById('socialToast');
  const toastAvatar  = document.getElementById('toastAvatar');
  const toastName    = document.getElementById('toastName');
  const toastAction  = document.getElementById('toastAction');
  const toastTime    = document.getElementById('toastTime');
  const toastClose   = document.getElementById('toastClose');

  let toastIndex     = 0;
  let toastTimer     = null;
  let toastHideTimer = null;

  function showToast() {
    if (!socialToast) return;
    const data = toastData[toastIndex % toastData.length];
    toastIndex++;

    // Actualizar contenido
    if (toastAvatar) toastAvatar.textContent = data.avatar;
    if (toastName)   toastName.textContent   = data.name + ' · ' + data.city;
    if (toastAction) toastAction.textContent = data.action;
    if (toastTime)   toastTime.textContent   = data.time;

    // Mostrar
    socialToast.classList.remove('hidden');
    requestAnimationFrame(() => socialToast.classList.add('visible'));

    // Auto-cerrar en 6 segundos
    clearTimeout(toastHideTimer);
    toastHideTimer = setTimeout(hideToast, 6000);
  }

  function hideToast() {
    if (!socialToast) return;
    socialToast.classList.remove('visible');
    setTimeout(() => socialToast.classList.add('hidden'), 400);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      hideToast();
      clearTimeout(toastTimer);
    });
  }

  // Empezar toasts: primer aparición a los 8 seg, luego cada 2 minutos
  if (socialToast) {
    setTimeout(() => {
      showToast();
      toastTimer = setInterval(showToast, 120000);
    }, 8000);
  }

  /* ──────────────────────────────────────────────────────────
     14. EXIT INTENT MODAL [NUEVO]
     Detecta cuando el cursor sale del viewport por arriba
     (usuario a punto de cerrar pestaña) — desktop.
     En móvil: se muestra tras 90 segundos de inactividad.
     Solo se muestra UNA VEZ por sesión.
  ────────────────────────────────────────────────────────── */
  const exitModal   = document.getElementById('exitModal');
  const exitClose   = document.getElementById('exitClose');
  const exitDismiss = document.getElementById('exitDismiss');
  let   exitShown   = sessionStorage.getItem('exitShown') === '1';

  function openExitModal() {
    if (exitShown || !exitModal) return;
    exitShown = true;
    sessionStorage.setItem('exitShown', '1');
    exitModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeExitModal() {
    if (!exitModal) return;
    exitModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (exitClose)   exitClose.addEventListener('click', closeExitModal);
  if (exitDismiss) exitDismiss.addEventListener('click', closeExitModal);
  if (exitModal) {
    exitModal.addEventListener('click', (e) => { if (e.target === exitModal) closeExitModal(); });
  }

  // Desktop: detectar cursor que sale por arriba del viewport
  if (!isTouchDevice && !exitShown) {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 50) {
        setTimeout(openExitModal, 200);
      }
    });
  }

  // Todos los dispositivos: timer de respaldo a los 40 segundos
  // Garantiza que el modal aparezca aunque el mouseleave no dispare
  if (!exitShown) {
    setTimeout(openExitModal, 40000);
  }


  /* ──────────────────────────────────────────────────────────
     BONUS: Lazy load de imágenes nativas (polyfill ligero)
     Para navegadores que no soporten loading="lazy"
  ────────────────────────────────────────────────────────── */
  if ('loading' in HTMLImageElement.prototype === false) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if ('IntersectionObserver' in window) {
        const lazyObs = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (entry.target.dataset.src) entry.target.src = entry.target.dataset.src;
              obs.unobserve(entry.target);
            }
          });
        });
        lazyObs.observe(img);
      }
    });
  }

  /* ── 16. Cookie Consent Banner ──────────────────────────────────────
     Cumple LFPDPPP: aviso previo, consentimiento explícito, opción de
     solo cookies esenciales. Persiste en localStorage ('cececob_cookies').
  ────────────────────────────────────────────────────────────────────── */
  (function () {
    const COOKIE_KEY    = 'cececob_cookies';
    const banner        = document.getElementById('cookieBanner');
    if (!banner) return;

    // Si el usuario ya eligió en una visita anterior → no mostrar
    if (localStorage.getItem(COOKIE_KEY)) return;

    const btnAccept    = document.getElementById('cookieAcceptAll');
    const btnEssential = document.getElementById('cookieEssentialOnly');
    const btnPrivacy   = document.getElementById('cookiePrivacyLink');

    /** Desliza el banner hacia arriba */
    function showBanner() {
      banner.classList.remove('hidden');
      // Doble rAF para que la transición CSS se active tras el display:block
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          banner.classList.add('visible');
          document.body.classList.add('cookie-banner-open');
        });
      });
    }

    /** Guarda la elección y cierra el banner */
    function dismissBanner(value) {
      localStorage.setItem(COOKIE_KEY, value);
      banner.classList.remove('visible');
      document.body.classList.remove('cookie-banner-open');
      // Ocultar del DOM tras la transición
      setTimeout(function () { banner.classList.add('hidden'); }, 500);
    }

    if (btnAccept)    btnAccept.addEventListener('click',    function () { dismissBanner('all'); });
    if (btnEssential) btnEssential.addEventListener('click', function () { dismissBanner('essential'); });
    if (btnPrivacy)   btnPrivacy.addEventListener('click',   function () { openPrivacyModal(); });

    // Mostrar con retraso de 1.2 s para no competir con la carga inicial
    setTimeout(showBanner, 1200);
  })();

});
