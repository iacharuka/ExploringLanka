/* =====================================================
   ExploringLanka Component Loader
   Loads Navbar and Footer into all pages
===================================================== */

const FALLBACK_COMPONENTS = {
  navbar: `
    <header class="site-header">
      <div class="container header-wrapper">
        <a href="index.html" class="logo" aria-label="ExploringLanka Tourism Transport home">
          <img
            src="assets/images/exploringlanka-logo-cropped.png"
            alt="ExploringLanka Tourism Transport"
            class="site-logo"
            width="220"
            height="58"
            decoding="async"
          >
        </a>

        <nav class="main-nav" id="mainNav" aria-label="Primary navigation">
          <a href="index.html">Home</a>
          <a href="transfers.html">Airport Transfers</a>
          <a href="tours.html">Private Tours</a>
          <a href="fleet.html">Fleet</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </nav>

        <div class="header-actions">
          <a href="#" class="btn btn-whatsapp js-whatsapp-help">WhatsApp</a>
        </div>

        <button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mainNav">
          ☰
        </button>
      </div>
    </header>
  `,
  footer: `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <img
            src="assets/images/exploringlanka-logo-cropped.png"
            alt="ExploringLanka Tourism Transport"
            class="footer-logo"
            width="260"
            height="72"
            decoding="async"
            loading="lazy"
          >
          <p>Discover Sri Lanka, One Experience at a Time.</p>
          <div class="footer-socials">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook">f</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">ig</a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="TikTok">tt</a>
            <a href="https://wa.me/94779892268" target="_blank" rel="noopener" aria-label="WhatsApp">wa</a>
          </div>
        </div>

        <div class="footer-column">
          <h3>Company</h3>
          <a href="about.html">About ExploringLanka</a>
          <a href="about.html">Why Choose Us</a>
          <a href="contact.html">Careers</a>
          <a href="contact.html">Contact</a>
        </div>

        <div class="footer-column">
          <h3>Support</h3>
          <a href="contact.html">Help Center</a>
          <a href="contact.html">Cancellation Policy</a>
          <a href="contact.html">Booking Guide</a>
          <a href="contact.html">Safety Information</a>
        </div>

        <div class="footer-column">
          <h3>Destinations</h3>
          <a href="tours.html">Colombo</a>
          <a href="tours.html">Kandy</a>
          <a href="tours.html">Ella</a>
          <a href="tours.html">Sigiriya</a>
          <a href="tours.html">Galle</a>
          <a href="tours.html">Mirissa</a>
        </div>

        <div class="footer-newsletter">
          <h3>Contact</h3>
          <p>WhatsApp: +94 779892268</p>
          <p>Email: dhanushka8997@gmail.com</p>
          <p>Location: Sri Lanka</p>
        </div>
      </div>
    </footer>
  `
};

async function loadComponent(id, file) {
  const element = document.getElementById(id);

  if (!element) return;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Failed to load ${file}`);
    }

    const html = await response.text();
    element.innerHTML = html;
  } catch (error) {
    console.error(error);

    if (FALLBACK_COMPONENTS[id]) {
      element.innerHTML = FALLBACK_COMPONENTS[id];
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

    if (isOpen) {
      mobileMenuBtn.textContent = "×";
    } else {
      mobileMenuBtn.textContent = "☰";
    }
  });

  const navLinks = mainNav.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!mainNav.classList.contains("active")) return;
    if (header && header.contains(event.target)) return;
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

  const updateNavbar = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".main-nav a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
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

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    const businessEmail = "dhanushka8997@gmail.com";

    const subject = "Newsletter Subscription Request";

    const body = `
Hello ExploringLanka,

I would like to subscribe to your Sri Lanka travel updates.

Email: ${email}
`;

    const mailUrl = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailUrl;
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
