const isEnglish = document.documentElement.lang === 'en';
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? (isEnglish ? 'Open menu' : 'Abrir menú') : (isEnglish ? 'Close menu' : 'Cerrar menú'));
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', isEnglish ? 'Open menu' : 'Abrir menú');
  }));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.section-meta, .intro-grid, .values-row article, .service-detail-row, .zone-card, .about-copy, .about-values-grid article, .inquiry-form, .investment-points article');
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => {
    item.classList.add('reveal');
    observer.observe(item);
  });
}

const form = document.querySelector('#inquiry-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = isEnglish ? [
      `Hello Marian, my name is ${data.get('name')}.`,
      `I'm interested in: ${data.get('interest') || 'real estate options in Miami'}.`,
      `Property type: ${data.get('property') || 'not decided yet'}.`,
      `Estimated budget: ${data.get('budget') || 'to be discussed'}.`,
      `Country: ${data.get('country') || 'not provided'}.`,
      `Preferred language: ${data.get('language') || 'English'}.`,
      `Preferred reply method: ${data.get('preference') || 'WhatsApp'}.`,
      data.get('email') ? `Email: ${data.get('email')}.` : '',
      data.get('phone') ? `Phone: ${data.get('phone')}.` : '',
      data.get('message') ? `\n${data.get('message')}` : ''
    ].filter(Boolean) : [
      `Hola Marian, soy ${data.get('name')}.`,
      `Me interesa: ${data.get('interest') || 'conversar sobre opciones inmobiliarias'}.`,
      `Tipo de propiedad: ${data.get('property') || 'por definir'}.`,
      `Presupuesto aproximado: ${data.get('budget') || 'prefiero conversarlo'}.`,
      `País: ${data.get('country') || 'no indicado'}.`,
      `Idioma: ${data.get('language') || 'Español'}.`,
      `Prefiero recibir información por: ${data.get('preference') || 'WhatsApp'}.`,
      data.get('email') ? `Correo: ${data.get('email')}.` : '',
      data.get('phone') ? `Teléfono: ${data.get('phone')}.` : '',
      data.get('message') ? `\n${data.get('message')}` : ''
    ].filter(Boolean);
    const message = encodeURIComponent(lines.join('\n'));
    const status = form.querySelector('.form-status');
    const byEmail = String(data.get('preference')).toLowerCase().includes(isEnglish ? 'email' : 'correo');
    if (byEmail) {
      status.textContent = isEnglish ? 'Your email draft is ready for you to review before sending.' : 'Tu correo está listo para revisar antes de enviarlo.';
      const subject = encodeURIComponent(isEnglish ? 'Miami real estate inquiry' : 'Consulta inmobiliaria en Miami');
      window.location.href = `mailto:marianella@proxyrealtygroup.com?subject=${subject}&body=${message}`;
    } else {
      status.textContent = isEnglish ? 'WhatsApp will open with your message ready for review before you send it.' : 'WhatsApp se abrirá con tu mensaje listo para revisar antes de enviarlo.';
      window.open(`https://wa.me/17863814534?text=${message}`, '_blank', 'noopener,noreferrer');
    }
  });
}
