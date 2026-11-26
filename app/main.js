// Statara — router and bootstrap. Hash routes keep every page a link:
// #/penduduk, #/ekonomi, #/masyarakat, #/daerah, #/jelajah, #/sumber.

import { VIEWS, notFoundView, navLinks } from './views.js';

const viewRoot = document.getElementById('view');
const nav = document.getElementById('main-nav');
const yearEl = document.getElementById('year');

function currentPath() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1).split('?')[0] || '/';
  return path.startsWith('/') ? path : '/' + path;
}

function render() {
  const path = currentPath();
  const makeView = VIEWS[path] || (() => notFoundView(path));
  const view = makeView();
  document.title = view.title;
  nav.innerHTML = navLinks(path);
  viewRoot.innerHTML = view.html;
  view.mount(viewRoot);
  window.scrollTo(0, 0);
  const heading = viewRoot.querySelector('h1');
  if (heading) heading.setAttribute('tabindex', '-1');
}

window.addEventListener('hashchange', render);

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

render();
