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
