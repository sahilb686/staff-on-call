(function () {
  'use strict';

  /* ── Header scroll state ── */
  const header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav ── */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('navmenu');

  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) header.classList.add('scrolled');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Scroll spy ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  function scrollSpy() {
    const pos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (pos >= top && pos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }
  window.addEventListener('scroll', scrollSpy, { passive: true });

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Timeline progress ── */
  const timeline = document.querySelector('.timeline');
  const timelineSteps = document.querySelectorAll('.timeline__step');
  const timelineProgress = document.querySelector('.timeline__progress');

  if (timeline) {
    const timelineObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            timelineProgress.style.height = '100%';
            timelineSteps.forEach((step, i) => {
              setTimeout(() => step.classList.add('visible'), i * 200);
            });
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    timelineObserver.observe(timeline);
  }

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('[data-count]');
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(c => counterObserver.observe(c));

  /* ── FAQ accordion ── */
  document.querySelectorAll('.accordion__item').forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    function toggleItem(forceOpen) {
      const isActive = item.classList.contains('active');
      const shouldOpen = forceOpen !== undefined ? forceOpen : !isActive;

      document.querySelectorAll('.accordion__item.active').forEach(open => {
        if (open !== item) {
          open.classList.remove('active');
          open.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
          open.querySelector('.accordion__panel').style.maxHeight = null;
        }
      });

      item.classList.toggle('active', shouldOpen);
      trigger.setAttribute('aria-expanded', shouldOpen);
      panel.style.maxHeight = shouldOpen ? panel.scrollHeight + 'px' : null;
    }

    trigger.addEventListener('click', () => toggleItem());

    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem();
      }
    });
  });

  /* ── Scroll to top ── */
  const scrollTopBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Form submission ── */
  const form = document.querySelector('.contact__form');
  if (form) {
    const statusEl = form.querySelector('.form-status');

    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        if (statusEl) {
          statusEl.textContent = 'Please fill in all required fields correctly.';
          statusEl.classList.add('form-status--error');
        }
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.classList.add('is-loading');
      btn.disabled = true;

      if (statusEl) {
        statusEl.classList.remove('form-status--error');
        statusEl.textContent = '';
      }

      setTimeout(() => {
        btn.textContent = 'Inquiry Sent ✓';
        if (statusEl) {
          statusEl.textContent = 'Thank you! Our team will respond within 24 hours with verified candidates.';
        }
        form.reset();

        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.classList.remove('is-loading');
          if (statusEl) statusEl.textContent = '';
        }, 4000);
      }, 800);
    });
  }

  /* ── Particle canvas ── */
  const canvas = document.getElementById('particles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      const dpr = devicePixelRatio;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      const count = Math.min(60, Math.floor(canvas.offsetWidth / 20));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          r: Math.random() * 1.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
    }

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    function init() {
      cancelAnimationFrame(animId);
      resize();
      createParticles();
      draw();
    }

    init();
    window.addEventListener('resize', init, { passive: true });
  }

  /* ── Hero parallax ── */
  const heroVisual = document.querySelector('.hero__visual');
  const heroDashboard = document.querySelector('.hero__visual .dashboard');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroVisual && heroDashboard && !prefersReducedMotion) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function updateParallax() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      heroDashboard.style.transform =
        `perspective(1200px) rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(0)`;
      requestAnimationFrame(updateParallax);
    }

    heroVisual.addEventListener('mousemove', e => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 6;
      targetY = -y * 4;
    }, { passive: true });

    heroVisual.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`;
      }
    }, { passive: true });

    updateParallax();
  }

  /* ── Smooth hash navigation ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
