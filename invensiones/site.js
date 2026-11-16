const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.section-meta, .intro-grid, .values-row article, .service-detail-row, .zone-card, .about-copy, .about-values-grid article, .inquiry-form');
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
    const lines = [
      `Hola Marian, soy ${data.get('name')}.`,
      `Me interesa: ${data.get('interest') || 'conversar sobre opciones inmobiliarias'}.`,
      `Tipo de propiedad: ${data.get('property') || 'por definir'}.`,
      `Presupuesto aproximado: ${data.get('budget') || 'prefiero conversarlo'}.`,
      `País: ${data.get('country') || 'no indicado'}.`,
      `Idioma: ${data.get('language') || 'Español'}.`,
      data.get('email') ? `Correo: ${data.get('email')}.` : '',
      data.get('phone') ? `Teléfono: ${data.get('phone')}.` : '',
      data.get('message') ? `\n${data.get('message')}` : ''
    ].filter(Boolean);
    const message = encodeURIComponent(lines.join('\n'));
    const status = form.querySelector('.form-status');
    status.textContent = 'WhatsApp se abrirá con tu mensaje para que puedas revisarlo antes de enviarlo.';
    window.open(`https://wa.me/17863814534?text=${message}`, '_blank', 'noopener,noreferrer');
  });
}

