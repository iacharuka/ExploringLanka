/* =====================================================
   ExploringLanka Component Loader
   Loads Navbar and Footer into all pages
===================================================== */

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
  }
}

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");

  if (!mobileMenuBtn || !mainNav) return;

  mobileMenuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("active");

    if (mainNav.classList.contains("active")) {
      mobileMenuBtn.textContent = "×";
    } else {
      mobileMenuBtn.textContent = "☰";
    }
  });

  const navLinks = mainNav.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("active");
      mobileMenuBtn.textContent = "☰";
    });
  });
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

    const businessEmail = "exploringlankaofficial@gmail.com";

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
  setActiveNavLink();
  initNewsletterForm();

  document.dispatchEvent(new Event("componentsLoaded"));
});