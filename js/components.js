/* ExploringLanka — Navbar & Footer loader */

const FALLBACK_NAVBAR = `
  <header class="site-header site-header--travel">
    <div class="container header-wrapper">
      <a href="index.html" class="logo logo-text" aria-label="ExploringLanka home">
        <img src="assets/images/exploringlanka-logo-cropped.png" alt="ExploringLanka" class="site-logo site-logo--img" width="200" height="48" decoding="async" />
        <span class="logo-wordmark">EXPLORINGLANKA</span>
      </a>
      <nav class="main-nav" id="mainNav" aria-label="Main navigation">
        <a href="about.html">About</a>
        <a href="index.html#destinations">Destination</a>
        <a href="tours.html">Tour</a>
        <a href="fleet.html">Fleet</a>
        <a href="contact.html">Contact</a>
      </nav>
      <div class="header-actions">
        <span class="lang-pill" aria-hidden="true">EN</span>
        <a href="#" class="btn btn-login js-whatsapp-help">WhatsApp</a>
        <button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mainNav">☰</button>
      </div>
    </div>
  </header>
`;

const FALLBACK_FOOTER = `
  <footer class="site-footer site-footer--travel">
    <div class="container footer-grid footer-grid--travel">
      <div class="footer-column">
        <h3>About</h3>
        <a href="about.html">About Us</a>
        <a href="tours.html">Our Tours</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="footer-column">
        <h3>Support</h3>
        <a href="contact.html">Contact Us</a>
        <a href="contact.html">Help Center</a>
        <a href="transfers.html">Airport Transfers</a>
      </div>
      <div class="footer-column">
        <h3>FAQ</h3>
        <a href="contact.html">Booking</a>
        <a href="contact.html">Payments</a>
        <a href="custom-tour.html">Custom Tours</a>
      </div>
      <div class="footer-newsletter">
        <h3>Newsletter</h3>
        <p>Get Sri Lanka travel updates by email.</p>
        <form id="newsletterForm" class="newsletter-form newsletter-form--travel">
          <input type="email" id="newsletterEmail" placeholder="Enter your email" name="email" />
          <button type="submit" class="btn btn-submit">Submit</button>
        </form>
      </div>
    </div>
    <div class="container footer-bottom footer-bottom--travel">
      <span>© 2026 ExploringLanka. All rights reserved.</span>
      <div class="footer-socials">
        <a href="https://www.facebook.com/" target="_blank" rel="noopener">Facebook</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a>
        <a href="https://wa.me/94779892268" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </footer>
`;

const FALLBACK_COMPONENTS = {
  navbar: FALLBACK_NAVBAR,
  footer: FALLBACK_FOOTER
};

async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to load ${file}`);
    const htmlContent = await response.text();
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    if (doc.body.children.length > 0) {
      element.replaceChildren(...Array.from(doc.body.children));
    }
  } catch (error) {
    const fallback = FALLBACK_COMPONENTS[id];
    if (fallback) {
      const doc = new DOMParser().parseFromString(fallback, 'text/html');
      if (doc.body.children.length > 0) {
        element.replaceChildren(...Array.from(doc.body.children));
      }
    }
  }
}

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");
  const header = document.querySelector(".site-header");

  if (!mobileMenuBtn || !mainNav) return;
  if (mobileMenuBtn.dataset.menuBound === "true") return;
  mobileMenuBtn.dataset.menuBound = "true";

  function closeMenu() {
    mainNav.classList.remove("active");
    mobileMenuBtn.textContent = "☰";
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  }

  mobileMenuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("active");
    const isOpen = mainNav.classList.contains("active");
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenuBtn.textContent = isOpen ? "×" : "☰";
  });

  mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (!mainNav.classList.contains("active")) return;
    if (header?.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function initNavbarScrollStyle() {
  const header = document.querySelector(".site-header");
  if (!header || document.documentElement.dataset.navbarScrollBound === "true") return;
  document.documentElement.dataset.navbarScrollBound = "true";

  const updateNavbar = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPage = href.split("#")[0];
    if (linkPage === currentPage || (currentPage === "index.html" && href.includes("#destinations") && window.location.hash === "#destinations")) {
      link.classList.add("active");
    }
  });
}

function initNewsletterForm() {
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  if (!newsletterForm || !newsletterEmail) return;

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterEmail.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const body = `Hello ExploringLanka,\n\nSubscribe me to travel updates.\n\nEmail: ${email}`;
    window.location.href = `mailto:dhanushka8997@gmail.com?subject=${encodeURIComponent("Newsletter")}&body=${encodeURIComponent(body)}`;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("navbar", "components/navbar.html");
  await loadComponent("footer", "components/footer.html");
  initMobileMenu();
  initNavbarScrollStyle();
  setActiveNavLink();
  initNewsletterForm();
  document.dispatchEvent(new Event("componentsLoaded"));
});
