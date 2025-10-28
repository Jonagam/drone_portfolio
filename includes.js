// Simple client-side include loader for partial HTML (header/footer)
// Loads files from /partials/{name}.html into elements with data-include="{name}"
async function loadIncludes() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(nodes.map(async (el) => {
    const name = el.dataset.include;
    const url = `partials/${name}.html`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      const text = await res.text();
      el.innerHTML = text;
    } catch (err) {
      console.error(err);
    }
  }));

  initSiteNav();
}

function initSiteNav() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav-menu');
  if (!burger || !nav) return;

  function toggleNav() {
    const expanded = burger.classList.toggle('active');
    nav.classList.toggle('active');
    burger.setAttribute('aria-expanded', expanded);
  }

  burger.addEventListener('click', toggleNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      burger.classList.remove('active');
      nav.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });

  // Mark current page as active based on href
  const links = nav.querySelectorAll('a');
  const path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (href === 'index.html' && path === '')) {
      a.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadIncludes();
});
