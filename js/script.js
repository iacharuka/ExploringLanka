/**
 * ExploringLanka — Main JavaScript
 * All interactions: carousel, modal, form, toast, scroll reveal, counter, wishlist
 */

(function () {
 'use strict';

  /* ═══════════════════════════════════════════════════════════
     PAGE LOADER — inject immediately, dismiss on window.load
  ═══════════════════════════════════════════════════════════ */

  (function initLoader() {
    // Build the loader HTML
    const loader = document.createElement('div');
    loader.id = 'el-loader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'Loading ExploringLanka');

    loader.innerHTML = `
      <!-- Floating gold particles -->
      <div class="loader__particles" aria-hidden="true">
        ${[
          { x: 15, y: 70, dur: 3.2, delay: 0 },
          { x: 30, y: 55, dur: 2.8, delay: 0.6 },
          { x: 55, y: 80, dur: 3.6, delay: 0.2 },
          { x: 70, y: 60, dur: 2.5, delay: 1.0 },
          { x: 82, y: 75, dur: 3.0, delay: 0.4 },
          { x: 45, y: 65, dur: 4.0, delay: 1.4 },
        ].map(p => `<div class="loader__particle" style="left:${p.x}%;top:${p.y}%;--dur:${p.dur}s;--delay:${p.delay}s"></div>`).join('')}
      </div>

      <div class="loader__inner">
        <!-- Animated Compass -->
        <div class="loader__compass-wrap" aria-hidden="true">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Outer decorative ring (spins) -->
            <g class="loader__ring">
              <circle cx="48" cy="48" r="44" stroke="rgba(201,150,58,0.25)" stroke-width="1"/>
              <circle cx="48" cy="48" r="44" stroke="url(#loaderGrad)" stroke-width="1.5"
                stroke-dasharray="60 220" stroke-linecap="round"/>
              <!-- Cardinal tick marks -->
              <line x1="48" y1="4"  x2="48" y2="12" stroke="#C9963A" stroke-width="2" stroke-linecap="round"/>
              <line x1="48" y1="84" x2="48" y2="92" stroke="rgba(201,150,58,0.4)" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="4"  y1="48" x2="12" y2="48" stroke="rgba(201,150,58,0.4)" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="84" y1="48" x2="92" y2="48" stroke="rgba(201,150,58,0.4)" stroke-width="1.5" stroke-linecap="round"/>
            </g>
            <!-- Inner glow circle -->
            <circle class="loader__glow" cx="48" cy="48" r="26"
              stroke="rgba(201,150,58,0.15)" stroke-width="12" fill="none"/>
            <!-- Middle ring -->
            <circle cx="48" cy="48" r="20" stroke="rgba(201,150,58,0.3)" stroke-width="1" fill="none"/>
            <!-- Center dot -->
            <circle cx="48" cy="48" r="4" fill="#C9963A"/>
            <!-- Compass needle (oscillates) -->
            <g class="loader__needle">
              <!-- North (gold) -->
              <polygon points="48,16 52,48 48,44 44,48" fill="#C9963A"/>
              <!-- South (muted) -->
              <polygon points="48,80 44,48 48,52 52,48" fill="rgba(201,150,58,0.3)"/>
            </g>
            <!-- N label -->
            <text x="44.5" y="10" font-family="'DM Sans',sans-serif" font-size="7"
              font-weight="700" fill="#C9963A" letter-spacing="0.5">N</text>
            <!-- Gradient def -->
            <defs>
              <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#C9963A"/>
                <stop offset="100%" stop-color="rgba(201,150,58,0)"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Brand -->
        <div class="loader__brand">Exploring<span>Lanka</span></div>

        <!-- Tagline -->
        <div class="loader__tagline">Sri Lanka &nbsp;·&nbsp; Yours &nbsp;·&nbsp; Unfiltered</div>

        <!-- Progress bar -->
        <div class="loader__bar-wrap" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div class="loader__bar-fill"></div>
        </div>
      </div>
    `;

    document.body.appendChild(loader);

    // Dismiss — wait for both window.load AND a minimum display time
    const MIN_TIME = 1400; // ms — enough for animation to play through
    const startTime = Date.now();

    function dismiss() {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_TIME - elapsed);
      setTimeout(() => {
        loader.classList.add('is-hidden');
        // Remove from DOM after transition completes
        setTimeout(() => loader.remove(), 750);
      }, delay);
    }

    if (document.readyState === 'complete') {
      dismiss();
    } else {
      window.addEventListener('load', dismiss, { once: true });
    }
  })();



 /* 
 UTILITIES
 */

 const $ = (sel, ctx = document) => ctx.querySelector(sel);
 const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

 function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

 /* 
 TOAST SYSTEM
 */

 window.showToast = function showToast(message, type = 'success', duration = 4000) {
 const container = document.getElementById('toast-container');
 if (!container) return;

 const icons = {
 success: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="#5EA876" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`,
 error: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="#E8536A" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
 info: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="#C9963A" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
 };

 const toast = document.createElement('div');
 toast.className = `toast toast--${type}`;
 toast.setAttribute('role', 'alert');
 toast.innerHTML = `${icons[type] || icons.info}<span class="toast__message">${message}</span>`;

 container.appendChild(toast);

 setTimeout(() => {
 toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
 toast.style.opacity = '0';
 toast.style.transform = 'translateX(110%)';
 setTimeout(() => toast.remove(), 350);
 }, duration);
 };

 /* 
 NAVBAR — SCROLL EFFECT
 */

 window.initNavbar = function initNavbar() {
 const navbar = document.getElementById('main-navbar');
 if (!navbar) return;

 let ticking = false;

 function handleScroll() {
 if (!ticking) {
 requestAnimationFrame(() => {
 navbar.classList.toggle('is-scrolled', window.scrollY > 50);
 ticking = false;
 });
 ticking = true;
 }
 }

 window.addEventListener('scroll', handleScroll, { passive: true });
 handleScroll(); // Initial check

 // Desktop book button
 const desktopBookBtn = document.getElementById('desktop-book-btn');
 if (desktopBookBtn) {
 desktopBookBtn.addEventListener('click', () => openBookingModal());
 }

 // Mobile bottom nav book button
 const mobileBookBtn = document.getElementById('mobile-book-btn');
 if (mobileBookBtn) {
 mobileBookBtn.addEventListener('click', () => openBookingModal());
 }
 };

 /* 
 FOOTER
 */

 window.initFooter = function initFooter() {
 const form = document.getElementById('footer-newsletter-form');
 if (!form) return;

 form.addEventListener('submit', (e) => {
 e.preventDefault();
 const input = document.getElementById('footer-email-input');
 if (input && input.value) {
 showToast(' You\'re subscribed! Welcome to the ExploringLanka family.', 'success');
 input.value = '';
 }
 });
 };

 /* 
 HERO CAROUSEL
 */

 function initHeroCarousel() {
 const slides = $$('.hero__slide');
 const dots = $$('.hero__dot');
 if (!slides.length) return;

 let current = 0;
 let timer = null;
 let startX = 0;
 let isDragging = false;

 function goTo(index) {
 slides[current].classList.remove('is-active');
 dots[current]?.classList.remove('is-active');
 current = (index + slides.length) % slides.length;
 slides[current].classList.add('is-active');
 dots[current]?.classList.add('is-active');
 }

 function next() { goTo(current + 1); }

 function startTimer() {
 clearInterval(timer);
 timer = setInterval(next, 6000);
 }

 // Dot clicks
 dots.forEach((dot, i) => {
 dot.addEventListener('click', () => { goTo(i); startTimer(); });
 });

 // Touch/pointer swipe
 const hero = document.querySelector('.hero');
 if (hero) {
 hero.addEventListener('pointerdown', (e) => {
 startX = e.clientX;
 isDragging = true;
 }, { passive: true });

 hero.addEventListener('pointermove', () => {}, { passive: true });

 hero.addEventListener('pointerup', (e) => {
 if (!isDragging) return;
 isDragging = false;
 const diff = e.clientX - startX;
 if (Math.abs(diff) > 50) {
 goTo(diff < 0 ? current + 1 : current - 1);
 startTimer();
 }
 });
 }

 goTo(0);
 startTimer();
 }

 /* 
 DESTINATION CARDS — EXPAND ON TAP
 */

 function initDestinationCards() {
 const cards = $$('.destination-card');
 cards.forEach(card => {
 card.addEventListener('click', () => {
 // On mobile, toggle expanded state
 if (window.innerWidth < 768) {
 const isExpanded = card.classList.contains('is-expanded');
 // Close all others
 cards.forEach(c => c.classList.remove('is-expanded'));
 if (!isExpanded) card.classList.add('is-expanded');
 }
 });

 // Keyboard accessibility
 card.setAttribute('tabindex', '0');
 card.setAttribute('role', 'button');
 card.addEventListener('keydown', (e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 card.click();
 }
 });
 });
 }

 /* 
 TESTIMONIALS CAROUSEL
 */

 function initTestimonialsCarousel() {
 const carousel = document.getElementById('testimonials-carousel');
 if (!carousel) return;

 const track = carousel.querySelector('.testimonials-track');
 const dots = $$('.carousel-dot', carousel);
 const prevBtn = document.getElementById('testimonials-prev');
 const nextBtn = document.getElementById('testimonials-next');

 if (!track) return;

 let current = 0;
 let timer = null;
 let startX = 0;
 let isDragging = false;
 const cards = $$('.testimonial-card', track);
 const total = cards.length;

 function getPerPage() {
 return window.innerWidth >= 768 ? 2 : 1;
 }

 function maxIndex() {
 return Math.max(0, total - getPerPage());
 }

 function update() {
 const perPage = getPerPage();
 const percent = current * (100 / perPage);
 track.style.transform = `translateX(-${percent}%)`;

 dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
 }

 function goTo(index) {
 current = clamp(index, 0, maxIndex());
 update();
 }

 function startAutoPlay() {
 clearInterval(timer);
 timer = setInterval(() => {
 goTo(current >= maxIndex() ? 0 : current + 1);
 }, 5000);
 }

 prevBtn?.addEventListener('click', () => { goTo(current - 1); startAutoPlay(); });
 nextBtn?.addEventListener('click', () => { goTo(current + 1); startAutoPlay(); });

 dots.forEach((dot, i) => {
 dot.addEventListener('click', () => { goTo(i); startAutoPlay(); });
 });

 // Touch swipe
 track.addEventListener('pointerdown', (e) => {
 startX = e.clientX;
 isDragging = true;
 clearInterval(timer);
 }, { passive: true });

 track.addEventListener('pointerup', (e) => {
 if (!isDragging) return;
 isDragging = false;
 const diff = e.clientX - startX;
 if (Math.abs(diff) > 50) goTo(diff < 0 ? current + 1 : current - 1);
 startAutoPlay();
 });

 // Pause on hover
 carousel.addEventListener('mouseenter', () => clearInterval(timer));
 carousel.addEventListener('mouseleave', () => startAutoPlay());

 goTo(0);
 startAutoPlay();

 window.addEventListener('resize', () => goTo(clamp(current, 0, maxIndex())));
 }

 /* 
 SEARCH BAR — AUTOCOMPLETE
 */

 const DESTINATIONS = [
 { name: 'Sigiriya Rock Fortress', type: 'Cultural', emoji: '' },
 { name: 'Yala National Park', type: 'Safari', emoji: '' },
 { name: 'Ella & Nine Arch Bridge', type: 'Adventure', emoji: '' },
 { name: 'Mirissa Beach', type: 'Beach', emoji: '' },
 { name: 'Galle Fort', type: 'Cultural', emoji: '' },
 { name: 'Kandy Temple of the Tooth', type: 'Cultural', emoji: '' },
 { name: 'Udawalawe Safari', type: 'Safari', emoji: '' },
 { name: 'Nuwara Eliya Tea Country', type: 'Scenic', emoji: '' },
 { name: 'Colombo City Tour', type: 'Urban', emoji: '' },
 { name: 'Arugam Bay Surfing', type: 'Beach', emoji: '' },
 { name: 'Horton Plains', type: 'Nature', emoji: '' },
 { name: 'Trincomalee Beaches', type: 'Beach', emoji: '' },
 ];

 function initSearchBar() {
 const input = document.getElementById('search-input');
 const dropdown = document.getElementById('search-dropdown');
 if (!input || !dropdown) return;

 function renderDropdown(items) {
 dropdown.innerHTML = items.map(d => `
 <div class="search-dropdown__item" tabindex="0" role="option" data-dest="${d.name}">
 <span class="search-dropdown__icon">${d.emoji}</span>
 <span class="search-dropdown__label">${d.name}</span>
 <span class="search-dropdown__type">${d.type}</span>
 </div>
 `).join('');

 $$('.search-dropdown__item', dropdown).forEach(item => {
 item.addEventListener('click', () => {
 input.value = item.dataset.dest;
 dropdown.classList.remove('is-open');
 // Navigate to tours page with filter
 window.location.href = `tours.html?q=${encodeURIComponent(item.dataset.dest)}`;
 });

 item.addEventListener('keydown', (e) => {
 if (e.key === 'Enter') item.click();
 });
 });
 }

 input.addEventListener('input', () => {
 const val = input.value.trim().toLowerCase();
 if (!val) {
 dropdown.classList.remove('is-open');
 return;
 }
 const filtered = DESTINATIONS.filter(d =>
 d.name.toLowerCase().includes(val) || d.type.toLowerCase().includes(val)
 );
 if (filtered.length) {
 renderDropdown(filtered);
 dropdown.classList.add('is-open');
 } else {
 dropdown.classList.remove('is-open');
 }
 });

 input.addEventListener('focus', () => {
 if (!input.value) {
 renderDropdown(DESTINATIONS.slice(0, 6));
 dropdown.classList.add('is-open');
 }
 });

 document.addEventListener('click', (e) => {
 if (!e.target.closest('.search-bar')) {
 dropdown.classList.remove('is-open');
 }
 });

 // Search form submit
 const searchForm = document.getElementById('hero-search-form');
 searchForm?.addEventListener('submit', (e) => {
 e.preventDefault();
 const val = input.value.trim();
 window.location.href = `tours.html${val ? '?q=' + encodeURIComponent(val) : ''}`;
 });
 }

 /* 
 TOUR FILTERS
 */

 function initTourFilters() {
 const tags = $$('.filter-tag');
 const cards = $$('[data-category]');
 if (!tags.length) return;

 function filterCards(activeTag) {
 cards.forEach(card => {
 const cats = (card.dataset.category || '').split(',').map(s => s.trim());
 const show = activeTag === 'all' || cats.includes(activeTag);
 card.style.display = show ? '' : 'none';

 if (show) {
 card.style.animation = 'none';
 requestAnimationFrame(() => {
 card.style.animation = 'fadeInUp 0.4s ease both';
 });
 }
 });
 }

 tags.forEach(tag => {
 tag.addEventListener('click', () => {
 tags.forEach(t => t.classList.remove('is-active'));
 tag.classList.add('is-active');
 filterCards(tag.dataset.filter || 'all');
 });
 });

 // Check URL params
 const urlParams = new URLSearchParams(window.location.search);
 const filterParam = urlParams.get('filter');
 if (filterParam) {
 const matchTag = tags.find(t => t.dataset.filter === filterParam);
 if (matchTag) matchTag.click();
 }
 }

 /* 
 WISHLIST — localStorage
 */

 function getWishlist() {
 try { return JSON.parse(localStorage.getItem('el_wishlist') || '[]'); }
 catch { return []; }
 }

 function saveWishlist(list) {
 localStorage.setItem('el_wishlist', JSON.stringify(list));
 }

 function initWishlist() {
 const btns = $$('.tour-card__wishlist');
 const wishlist = getWishlist();

 btns.forEach(btn => {
 const tourId = btn.closest('[data-tour-id]')?.dataset.tourId;
 if (!tourId) return;

 if (wishlist.includes(tourId)) btn.classList.add('is-active');

 btn.addEventListener('click', (e) => {
 e.stopPropagation();
 const list = getWishlist();
 const idx = list.indexOf(tourId);
 if (idx === -1) {
 list.push(tourId);
 btn.classList.add('is-active');
 showToast(' Added to your wishlist!', 'success', 2500);
 } else {
 list.splice(idx, 1);
 btn.classList.remove('is-active');
 showToast('Removed from wishlist.', 'info', 2000);
 }
 saveWishlist(list);
 });
 });
 }

 /* 
 ANIMATED COUNTERS
 */

 function animateCounter(el) {
 const target = parseInt(el.dataset.target, 10);
 const duration = 2000;
 const start = performance.now();

 function step(now) {
 const elapsed = now - start;
 const progress = Math.min(elapsed / duration, 1);
 // Ease out cubic
 const eased = 1 - Math.pow(1 - progress, 3);
 const value = Math.round(eased * target);
 el.textContent = value.toLocaleString() + (el.dataset.suffix || '');
 if (progress < 1) requestAnimationFrame(step);
 }

 requestAnimationFrame(step);
 }

 function initCounters() {
 const counters = $$('[data-target]');
 if (!counters.length) return;

 const observer = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting && !entry.target.dataset.animated) {
 entry.target.dataset.animated = 'true';
 animateCounter(entry.target);
 observer.unobserve(entry.target);
 }
 });
 }, { threshold: 0.4 });

 counters.forEach(counter => observer.observe(counter));
 }

 /* 
 SCROLL REVEAL (IntersectionObserver)
 */

 function initScrollReveal() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

 const revealEls = $$('.reveal, .reveal--left, .reveal--right, .reveal--scale');
 if (!revealEls.length) return;

 const observer = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.classList.add('is-visible');
 observer.unobserve(entry.target);
 }
 });
 }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

 revealEls.forEach(el => observer.observe(el));
 }

 /* 
 BOOKING MODAL (Multi-step)
 */

 let bookingStep = 1;
 const TOTAL_STEPS = 4;

 /* ── Collect all booking form fields (works on every page's modal) ── */
 function collectBookingData() {
 const val = id => (document.getElementById(id)?.value || '').trim();
 const txt = id => (document.getElementById(id)?.textContent || '').trim();

 const tourName   = txt('booking-tour-name') || val('booking-tour-select') || 'Tour Inquiry';
 const arrival    = val('booking-arrival')   || val('booking-arrival2')   || 'Not specified';
 const departure  = val('booking-departure') || val('booking-departure2') || 'Not specified';
 const adults     = txt('adults-count') || txt('ac2') || val('adults-count') || '2';
 const children   = txt('children-count') || '0';
 const accom      = val('booking-accommodation') || '';
 const firstName  = val('booking-firstname') || val('bn2') || '';
 const lastName   = val('booking-lastname')  || '';
 const name       = [firstName, lastName].filter(Boolean).join(' ') || 'Guest';
 const email      = val('booking-email') || val('be2') || '';
 const phone      = val('booking-phone') || val('bw2') || '';
 const notes      = val('booking-notes') || '';

 return { tourName, arrival, departure, adults, children, accom, name, email, phone, notes };
 }

 /* ── Build WhatsApp URL with pre-filled booking message ── */
 function buildBookingWaUrl(d) {
 const lines = [
 `Hi ExploringLanka! I'd like to book a tour.`,
 ``,
 `*Booking Details*`,
 `Tour: ${d.tourName}`,
 `Arrival: ${d.arrival}`,
 `Departure: ${d.departure}`,
 `Adults: ${d.adults}`,
 `Children: ${d.children}`,
 d.accom ? `Accommodation: ${d.accom}` : null,
 ``,
 `*My Details*`,
 `Name: ${d.name}`,
 d.email ? `Email: ${d.email}` : null,
 d.phone ? `Phone/WhatsApp: ${d.phone}` : null,
 d.notes ? `\nNotes: ${d.notes}` : null,
 ].filter(l => l !== null).join('\n');
 return `https://wa.me/94779892268?text=${encodeURIComponent(lines)}`;
 }

 /* ── Build mailto URL with pre-filled booking email ── */
 function buildBookingEmailUrl(d) {
 const subject = `Tour Booking Request — ${d.tourName}`;
 const body = [
 `Hi ExploringLanka,`,
 ``,
 `I would like to book the following tour:`,
 ``,
 `BOOKING DETAILS`,
 `---------------`,
 `Tour:        ${d.tourName}`,
 `Arrival:     ${d.arrival}`,
 `Departure:   ${d.departure}`,
 `Adults:      ${d.adults}`,
 `Children:    ${d.children}`,
 d.accom ? `Accommodation: ${d.accom}` : null,
 ``,
 `MY DETAILS`,
 `----------`,
 `Name:  ${d.name}`,
 d.email ? `Email: ${d.email}` : null,
 d.phone ? `Phone: ${d.phone}` : null,
 d.notes ? `\nSpecial Requests:\n${d.notes}` : null,
 ``,
 `Please send me a personalised quote and availability. Thank you!`,
 ].filter(l => l !== null).join('\n');
 return `mailto:dhanushka8997@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 }

 /* ── WhatsApp icon SVG (inline, reused in buttons) ── */
 const WA_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
 const EMAIL_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;

 window.openBookingModal = function openBookingModal(tourName = '') {
 const backdrop = document.getElementById('booking-modal-backdrop');
 if (!backdrop) return;

 const tourNameEl = document.getElementById('booking-tour-name');
 if (tourNameEl && tourName) tourNameEl.textContent = tourName;

 bookingStep = 1;
 updateBookingStep();
 backdrop.classList.add('is-open');
 document.body.style.overflow = 'hidden';
 backdrop.querySelector('.modal')?.focus();
 };

 window.closeBookingModal = function closeBookingModal() {
 const backdrop = document.getElementById('booking-modal-backdrop');
 if (!backdrop) return;
 backdrop.classList.remove('is-open');
 document.body.style.overflow = '';
 };

 function updateBookingStep() {
 $$('.booking-step').forEach((step, i) => {
 step.style.display = i + 1 === bookingStep ? 'block' : 'none';
 });

 $$('.modal__progress-dot').forEach((dot, i) => {
 dot.classList.toggle('is-active', i + 1 === bookingStep);
 dot.classList.toggle('is-done', i + 1 < bookingStep);
 });

 const nextBtn  = document.getElementById('booking-next');
 const prevBtn  = document.getElementById('booking-prev');
 const submitBtn = document.getElementById('booking-submit');

 // Always hide the old single submit; we inject two buttons on last step
 if (submitBtn) submitBtn.style.display = 'none';

 // Remove previously injected action buttons before re-rendering
 document.getElementById('booking-actions')?.remove();

 if (bookingStep < TOTAL_STEPS) {
 if (nextBtn) nextBtn.style.display = 'flex';
 } else {
 // Last step — inject WhatsApp + Email buttons
 if (nextBtn) nextBtn.style.display = 'none';

 const btnRow = document.querySelector('.modal__footer > div');
 if (btnRow) {
 const actions = document.createElement('div');
 actions.id = 'booking-actions';
 actions.style.cssText = 'display:flex;flex-direction:column;gap:var(--space-3);width:100%';
 actions.innerHTML = `
 <button class="btn btn--whatsapp btn--full" id="booking-send-wa">
 ${WA_ICON} Send via WhatsApp
 </button>
 <button class="btn btn--ghost btn--full" id="booking-send-email">
 ${EMAIL_ICON} Send via Email
 </button>
 `;
 btnRow.appendChild(actions);

 document.getElementById('booking-send-wa').addEventListener('click', () => {
 const data = collectBookingData();
 window.open(buildBookingWaUrl(data), '_blank', 'noopener');
 closeBookingModal();
 showToast('Opening WhatsApp with your booking details...', 'success', 4000);
 });

 document.getElementById('booking-send-email').addEventListener('click', () => {
 const data = collectBookingData();
 window.location.href = buildBookingEmailUrl(data);
 closeBookingModal();
 showToast('Opening your email with booking details pre-filled...', 'info', 4000);
 });
 }
 }

 if (prevBtn) prevBtn.style.display = bookingStep > 1 ? 'flex' : 'none';
 }

 function initBookingModal() {
 const backdrop = document.getElementById('booking-modal-backdrop');
 if (!backdrop) return;

 backdrop.addEventListener('click', (e) => {
 if (e.target === backdrop) closeBookingModal();
 });

 document.getElementById('booking-modal-close')?.addEventListener('click', closeBookingModal);

 document.getElementById('booking-next')?.addEventListener('click', () => {
 if (bookingStep < TOTAL_STEPS) { bookingStep++; updateBookingStep(); }
 });

 document.getElementById('booking-prev')?.addEventListener('click', () => {
 if (bookingStep > 1) { bookingStep--; updateBookingStep(); }
 });

 document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape') closeBookingModal();
 });
 }

 /* 
 ACCORDION
 */

 function initAccordions() {
 const items = $$('.accordion__item');
 items.forEach(item => {
 const trigger = item.querySelector('.accordion__trigger');
 if (!trigger) return;

 trigger.addEventListener('click', () => {
 const isOpen = item.classList.contains('is-open');
 // Close siblings in same accordion
 const accordion = item.closest('.accordion');
 if (accordion) {
 $$('.accordion__item.is-open', accordion).forEach(open => {
 if (open !== item) open.classList.remove('is-open');
 });
 }
 item.classList.toggle('is-open', !isOpen);
 trigger.setAttribute('aria-expanded', String(!isOpen));
 });

 trigger.setAttribute('aria-expanded', 'false');
 });
 }

 /* 
 TOUR CARDS — BOOK CTA
 */

 function initTourCardCTAs() {
 $$('[data-open-booking]').forEach(el => {
 el.addEventListener('click', (e) => {
 e.stopPropagation();
 const tourName = el.dataset.openBooking || '';
 openBookingModal(tourName);
 });
 });
 }

 /* 
 GALLERY LIGHTBOX (simple)
 */

 function initGallery() {
 const items = $$('.gallery__item[data-src]');
 if (!items.length) return;

 items.forEach(item => {
 item.addEventListener('click', () => {
 const src = item.dataset.src;
 const alt = item.dataset.alt || 'Gallery image';
 openLightbox(src, alt);
 });
 });
 }

 function openLightbox(src, alt) {
 const existing = document.getElementById('lightbox');
 if (existing) existing.remove();

 const lb = document.createElement('div');
 lb.id = 'lightbox';
 lb.setAttribute('role', 'dialog');
 lb.setAttribute('aria-label', 'Image lightbox');
 lb.style.cssText = `
 position: fixed; inset: 0; z-index: 500;
 background: rgba(0,0,0,0.95);
 display: flex; align-items: center; justify-content: center;
 cursor: zoom-out;
 animation: fadeIn 0.2s ease;
 `;

 lb.innerHTML = `
 <img src="${src}" alt="${alt}" style="max-width:94vw; max-height:90dvh; object-fit:contain; border-radius:8px;">
 <button aria-label="Close" style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.1);border:none;color:white;width:44px;height:44px;border-radius:50%;font-size:1.4rem;cursor:pointer;display:flex;align-items:center;justify-content:center;"></button>
 `;

 lb.addEventListener('click', () => lb.remove());
 lb.querySelector('button')?.addEventListener('click', () => lb.remove());

 document.body.appendChild(lb);

 document.addEventListener('keydown', function handler(e) {
 if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', handler); }
 });
 }

 /* 
 FORM VALIDATION
 */

 function initForms() {
 $$('form[data-validate]').forEach(form => {
 form.addEventListener('submit', (e) => {
 e.preventDefault();
 const inputs = $$('[required]', form);
 let valid = true;

 inputs.forEach(input => {
 const err = input.parentNode.querySelector('.form-error');
 if (!input.value.trim()) {
 valid = false;
 input.style.borderColor = '#E8536A';
 if (err) err.textContent = 'This field is required.';
 } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
 valid = false;
 input.style.borderColor = '#E8536A';
 if (err) err.textContent = 'Please enter a valid email.';
 } else {
 input.style.borderColor = '';
 if (err) err.textContent = '';
 }
 });

 if (valid) {
 const successMsg = form.dataset.success || ' Thank you! We\'ll be in touch soon.';
 showToast(successMsg, 'success', 5000);
 form.reset();
 }
 });
 });
 }

 /* 
 HORIZONTAL SCROLL SHELF — keyboard navigation
 */

 function initScrollShelves() {
 $$('.scroll-row').forEach(shelf => {
 // Make it keyboard scrollable
 shelf.setAttribute('tabindex', '0');
 shelf.addEventListener('keydown', (e) => {
 if (e.key === 'ArrowRight') shelf.scrollBy({ left: 320, behavior: 'smooth' });
 if (e.key === 'ArrowLeft') shelf.scrollBy({ left: -320, behavior: 'smooth' });
 });
 });
 }

 /* 
 MOBILE SWIPE CAROUSEL (generic)
 */

 function initSwipeCarousels() {
 $$('[data-carousel]').forEach(carousel => {
 const track = carousel.querySelector('[data-carousel-track]');
 if (!track) return;

 let startX = 0;
 let scrollLeft = 0;
 let isDown = false;

 track.addEventListener('pointerdown', (e) => {
 isDown = true;
 startX = e.clientX - track.offsetLeft;
 scrollLeft = track.scrollLeft;
 track.setPointerCapture(e.pointerId);
 });

 track.addEventListener('pointermove', (e) => {
 if (!isDown) return;
 e.preventDefault();
 const x = e.clientX - track.offsetLeft;
 const walk = (x - startX) * 1.5;
 track.scrollLeft = scrollLeft - walk;
 });

 track.addEventListener('pointerup', () => { isDown = false; });
 track.addEventListener('pointerleave', () => { isDown = false; });
 });
 }

 /* 
 URL PARAMS — Pre-fill forms / filters
 */

 function handleUrlParams() {
 const params = new URLSearchParams(window.location.search);
 const searchInput = document.getElementById('search-input');
 if (searchInput && params.get('q')) {
 searchInput.value = params.get('q');
 }
 }

 /* 
 INIT — Run after DOM + components ready
 */

 function init() {
 initHeroCarousel();
 initDestinationCards();
 initTestimonialsCarousel();
 initSearchBar();
 initTourFilters();
 initWishlist();
 initCounters();
 initScrollReveal();
 initBookingModal();
 initAccordions();
 initTourCardCTAs();
 initGallery();
 initForms();
 initScrollShelves();
 initSwipeCarousels();
 handleUrlParams();
 }

 // Wait for components (navbar/footer) to be injected
 document.addEventListener('components:ready', init);

 // Also run on DOMContentLoaded in case components.js isn't used
 document.addEventListener('DOMContentLoaded', () => {
 // Small delay to ensure component injection has happened
 setTimeout(() => {
 if (!document.getElementById('main-navbar')) init();
 }, 50);
 });

})();
