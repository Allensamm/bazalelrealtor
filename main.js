import * as THREE from 'three';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A quiet architectural study: the house silhouette gives the hero a sense of depth
// without competing with the message or the property photography.
const canvas = document.querySelector('#architecture');
if (canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, canvas.clientWidth / canvas.clientHeight, .1, 100);
    camera.position.set(5, 4, 8);
    camera.lookAt(0, 1.4, 0);
    const model = new THREE.Group();
    scene.add(model);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xd9e8be, transparent: true, opacity: .72 });
    const detailMaterial = new THREE.LineBasicMaterial({ color: 0xc6e37a, transparent: true, opacity: .9 });
    const floor = (w, d, y) => {
      const slab = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, .02, d));
      const lines = new THREE.LineSegments(slab, lineMaterial);
      lines.position.y = y;
      model.add(lines);
    };
    const volume = (w, h, d, x, y, z, material = lineMaterial) => {
      const lines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), material);
      lines.position.set(x, y, z);
      model.add(lines);
    };
    floor(4.2, 3.2, 0);
    floor(3.3, 2.6, 2.25);
    volume(4.2, 2.2, 3.2, 0, 1.1, 0);
    volume(3.3, 1.6, 2.6, .35, 3.05, -.12);
    // A long cantilever gives the outline a recognisable modern-home profile.
    volume(1.3, .02, 3.7, 1.72, 2.18, 0, detailMaterial);
    // Window mullions and a vertical entry reveal.
    for (const x of [-1.15, -.45, .25, .95]) {
      const mullion = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, .25, 1.61), new THREE.Vector3(x, 1.94, 1.61)]), detailMaterial);
      model.add(mullion);
    }
    const door = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.15, .02, 1.62), new THREE.Vector3(-.15, 1.42, 1.62)]), lineMaterial);
    model.add(door);
    const ground = new THREE.GridHelper(8, 16, 0xd9e8be, 0xd9e8be);
    ground.position.y = -.04;
    ground.material.transparent = true;
    ground.material.opacity = .16;
    model.add(ground);
    model.rotation.y = -.28;
    const resize = () => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    const animate = () => {
      if (!prefersReducedMotion) model.rotation.y += .0016;
      renderer.render(scene, camera);
      if (!prefersReducedMotion) requestAnimationFrame(animate);
    };
    animate();
  } catch (error) {
    console.info('The architectural canvas is unavailable in this browser.', error);
  }
}

const slugInput = document.querySelector('#slug-input');
const previewUrl = document.querySelector('.preview-url');
const previewName = document.querySelector('.preview-name');
if (slugInput && previewUrl) {
  const updatePreview = () => {
    const cleaned = slugInput.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    slugInput.value = cleaned;
    previewUrl.textContent = `bazalel/${cleaned || 'yourname'}`;
    if (previewName) previewName.innerHTML = `${(cleaned || 'YOUR BRAND').replace(/-/g, ' ').toUpperCase()} <span>REALTY</span>`;
  };
  slugInput.addEventListener('input', updatePreview);
}

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    nav.classList.toggle('open', !isOpen);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }));
}

// GSAP is loaded as a deferred classic script. Keep the page fully readable if a
// CDN or animation API is unavailable.
window.addEventListener('load', () => {
  if (!window.gsap || prefersReducedMotion) return;
  const gsap = window.gsap;
  gsap.from('.hero-copy > *', { y: 24, opacity: 0, duration: .85, stagger: .12, ease: 'power3.out', delay: .12 });
  gsap.from('.hero-art', { opacity: 0, scale: .92, duration: 1.5, ease: 'power2.out', delay: .35 });
  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    gsap.utils.toArray('.section-index, .intro-main, .intro-note, .showcase-head, .showcase-frame, .feature-card, .process-layout').forEach((element) => {
      gsap.from(element, { y: 24, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 87%', once: true } });
    });
  }
});
