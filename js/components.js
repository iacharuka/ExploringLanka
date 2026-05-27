/**
 * ExploringLanka — Component Loader
 * Injects shared HTML components (navbar, footer) into all pages.
 */

(function () {
 'use strict';

 const COMPONENTS = [
 { selector: '#navbar-placeholder', src: 'components/navbar.html' },
 { selector: '#footer-placeholder', src: 'components/footer.html' },
 ];

 /**
 * Resolve the correct path to a component file, handling
 * pages that live in subdirectories.
 */
 function resolvePath(src) {
 const depth = window.location.pathname.split('/').filter(Boolean).length;
 // If we're not at root level, go up
 // For our flat structure all pages are at root so no adjustment needed
 return src;
 }

 /**
 * Fetch a component HTML file and inject its content.
 */
 async function loadComponent({ selector, src }) {
 const placeholder = document.querySelector(selector);
 if (!placeholder) return;

 try {
 const path = resolvePath(src);
 const response = await fetch(path);
 if (!response.ok) throw new Error(`Failed to load ${path}`);
 const html = await response.text();

 const parser = new DOMParser();
 const doc = parser.parseFromString(html, 'text/html');

 // Inject all child nodes from the body of the fetched document
 const fragment = document.createDocumentFragment();
 Array.from(doc.body.childNodes).forEach(node => {
 fragment.appendChild(document.importNode(node, true));
 });

 placeholder.replaceWith(fragment);

 // Re-run component init after injection
 if (typeof window.initNavbar === 'function') window.initNavbar();
 if (typeof window.initFooter === 'function') window.initFooter();

 } catch (err) {
 console.error(`[ComponentLoader] ${err.message}`);
 placeholder.remove();
 }
 }

 /**
 * Load all components in parallel, then initialize page scripts.
 */
 async function loadAll() {
 await Promise.all(COMPONENTS.map(loadComponent));

 // Set active nav state based on current page
 setActiveNavState();

 // Update footer year
 const yearEl = document.getElementById('footer-year');
 if (yearEl) yearEl.textContent = new Date().getFullYear();

 // Dispatch event so page scripts know components are ready
 document.dispatchEvent(new CustomEvent('components:ready'));
 }

 /**
 * Mark the current page's nav link as active.
 */
 function setActiveNavState() {
 const page = document.body.dataset.page || '';
 const currentPath = window.location.pathname.split('/').pop() || 'index.html';

 // Desktop nav
 document.querySelectorAll('.navbar__link[data-page]').forEach(link => {
 const linkPage = link.dataset.page;
 const linkHref = link.getAttribute('href') || '';
 if (
 linkPage === page ||
 linkHref === currentPath ||
 (currentPath === '' && linkHref === 'index.html') ||
 (currentPath === 'index.html' && linkPage === 'home')
 ) {
 link.classList.add('is-active');
 link.setAttribute('aria-current', 'page');
 }
 });

 // Bottom nav
 document.querySelectorAll('.bottom-nav__item[data-page]').forEach(item => {
 const itemPage = item.dataset.page;
 const itemHref = item.getAttribute('href') || '';
 if (
 itemPage === page ||
 itemHref === currentPath ||
 (currentPath === '' && itemHref === 'index.html') ||
 (currentPath === 'index.html' && itemPage === 'home')
 ) {
 item.classList.add('is-active');
 item.setAttribute('aria-current', 'page');
 }
 });
 }

 // Start loading when DOM is ready
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', loadAll);
 } else {
 loadAll();
 }
})();
