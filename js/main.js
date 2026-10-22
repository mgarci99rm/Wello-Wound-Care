// Wello Wound Care — small site script

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Contact form: validates, then opens the visitor's email app with the
// details filled in, addressed to hello@wellowoundcare.com.
// (Swap for a form service such as Formspree once the clinic chooses one.)
const form = document.getElementById('contact-form');
if (form) {
  // Pre-select the reason when arriving from a "Book" button (?reason=book)
  const params = new URLSearchParams(location.search);
  const reason = params.get('reason');
  if (reason) {
    const select = form.querySelector('#reason');
    const match = [...select.options].find(o => o.dataset.key === reason);
    if (match) select.value = match.value;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(input => {
      const field = input.closest('.field');
      const valid = input.value.trim() !== '' && input.checkValidity();
      field.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    const email = form.querySelector('#email');
    if (email.value.trim() && !email.checkValidity()) {
      email.closest('.field').classList.add('invalid');
      ok = false;
    } else {
      email.closest('.field').classList.remove('invalid');
    }
    if (!ok) {
      form.querySelector('.invalid input, .invalid select')?.focus();
      return;
    }

    const v = id => form.querySelector('#' + id).value.trim();
    const subject = `${v('reason')} — ${v('first')} ${v('last')}`;
    const body = [
      `Name: ${v('first')} ${v('last')}`,
      `Phone: ${v('phone')}`,
      `Email: ${v('email') || '—'}`,
      `Reason for contact: ${v('reason')}`,
      '',
      v('message')
    ].join('\n');
    window.location.href =
      `mailto:hello@wellowoundcare.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('form-status').classList.add('show');
  });

  form.querySelectorAll('input, select').forEach(el =>
    el.addEventListener('input', () => el.closest('.field').classList.remove('invalid')));
}

// ----------------------------------------------------------
// Motion
// ----------------------------------------------------------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header shrinks + back-to-top appears after scrolling
const header = document.querySelector('.site-header');
const toTop = document.querySelector('.to-top');
const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 20);
  toTop?.classList.toggle('show', y > 700);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// Scroll reveal — groups reveal their children one after another
const groups = [
  '.section-head', '.checks', '.conditions', '.diff', '.values', '.places',
  '.cards', '.faq', '.graft-benefits', '.contact-methods', '.footer-grid'
];
const singles = [
  '.split > div:not(.split-media):not(.graft-figure)', '.cta-band', '.definition',
  '.page-hero .wrap', '.form', '.graft-figure'
];
const images = ['.split-media img', '.place img', '.photo-banner figure'];

const toObserve = [];
groups.forEach(sel => document.querySelectorAll(sel).forEach(group => {
  [...group.children].forEach((child, i) => {
    child.classList.add('reveal');
    child.style.setProperty('--i', i);
    toObserve.push(child);
  });
}));
singles.forEach(sel => document.querySelectorAll(sel).forEach(el => {
  if (!el.classList.contains('reveal')) { el.classList.add('reveal'); toObserve.push(el); }
}));
images.forEach(sel => document.querySelectorAll(sel).forEach(el => { el.classList.add('reveal-img'); toObserve.push(el); }));
document.querySelectorAll('.pathway, .tags').forEach(el => toObserve.push(el));

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
        if (entry.target.classList.contains('pathway')) startPathway(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  toObserve.forEach(el => io.observe(el));
} else {
  toObserve.forEach(el => el.classList.add('in'));
}

// Care pathway: after drawing, gently highlight each step in turn
function startPathway(list) {
  const steps = [...list.querySelectorAll('li')];
  let i = 0;
  setTimeout(() => {
    const tick = () => {
      steps.forEach((s, n) => s.classList.toggle('is-current', n === i));
      i = (i + 1) % steps.length;
    };
    tick();
    let timer = setInterval(tick, 2600);
    list.addEventListener('mouseenter', () => { clearInterval(timer); steps.forEach(s => s.classList.remove('is-current')); });
    list.addEventListener('mouseleave', () => { timer = setInterval(tick, 2600); });
    steps.forEach((s, n) => s.addEventListener('mouseenter', () => {
      steps.forEach(x => x.classList.remove('is-current')); s.classList.add('is-current'); i = (n + 1) % steps.length;
    }));
  }, 2000);
}

// Hero: care settings cycle like a quiet slideshow
const chips = [...document.querySelectorAll('.hero .settings li')];
if (chips.length && !reduceMotion) {
  let c = 0;
  setTimeout(() => {
    const step = () => { chips.forEach((el, n) => el.classList.toggle('is-active', n === c)); c = (c + 1) % chips.length; };
    step();
    setInterval(step, 2200);
  }, 1600);
}

// Hero photo: very slight parallax on scroll
const heroImg = document.querySelector('.hero-media img');
if (heroImg && !reduceMotion) {
  heroImg.addEventListener('animationend', () => {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 600);
      heroImg.style.transform = `translateY(${y * 0.06}px) scale(${1 + y * 0.00008})`;
    }, { passive: true });
  }, { once: true });
}
