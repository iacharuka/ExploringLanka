/* =====================================================
   ExploringLanka Main JavaScript
   WhatsApp + Email Booking System
===================================================== */

const BUSINESS_WHATSAPP = "94700000000";
const BUSINESS_EMAIL = "exploringlankaofficial@gmail.com";

function openWhatsApp(message) {
  const url = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function openEmail(subject, body) {
  const url = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

function byId(id) {
  return document.getElementById(id);
}

function getValue(id, fallback = "Not provided") {
  const element = byId(id);
  if (!element) return fallback;
  const value = element.value.trim();
  return value || fallback;
}

function getFirstValue(ids, fallback = "Not provided") {
  for (const id of ids) {
    const element = byId(id);
    if (element && element.value.trim()) return element.value.trim();
  }
  return fallback;
}

function setFirstValue(ids, value) {
  for (const id of ids) {
    const element = byId(id);
    if (element) {
      element.value = value;
      return;
    }
  }
}

function checkedValues(name) {
  const values = [...document.querySelectorAll(`input[name="${name}"]:checked`)]
    .map((input) => input.value);
  return values.length ? values.join(", ") : "Not selected";
}

function bindOnce(element, key, handler, eventName = "click") {
  if (!element || element.dataset[key] === "true") return;
  element.dataset[key] = "true";
  element.addEventListener(eventName, handler);
}

function showToast(message, type = "success") {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.background = type === "error" ? "#ef4444" : "#111827";
  toast.classList.add("show");

  clearTimeout(window.__exploringLankaToastTimer);
  window.__exploringLankaToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function initHeroSearch() {
  const form = byId("heroSearchForm") || byId("heroSearch");
  if (!form) return;

  bindOnce(form, "heroSearchBound", (event) => {
    event.preventDefault();

    const message = `
Hello ExploringLanka,

I would like to search for Sri Lanka travel experiences.

Location: ${getFirstValue(["location", "heroLocation"], "Not selected")}
Travel Date: ${getFirstValue(["travelDate", "heroDate"], "Not selected")}
Experience Type: ${getFirstValue(["experienceType", "heroType"], "Not selected")}
Guests: ${getFirstValue(["guests", "heroGuests"], "Not selected")}

Please send me available options, prices, and details.
`;

    showToast("Opening WhatsApp search inquiry...");
    openWhatsApp(message);
  }, "submit");
}

function initCategoryCards() {
  document.querySelectorAll(".category-card, .cat-card").forEach((card) => {
    bindOnce(card, "categoryBound", (event) => {
      event.preventDefault();
      const category = card.dataset.category || card.textContent.trim();

      const message = `
Hello ExploringLanka,

I am interested in this travel style:

Category: ${category}

Please send me available Sri Lanka packages, prices, and details.
`;

      showToast("Opening WhatsApp category inquiry...");
      openWhatsApp(message);
    });
  });
}

function initDestinationLinks() {
  document.querySelectorAll("[data-destination]").forEach((link) => {
    bindOnce(link, "destinationBound", (event) => {
      event.preventDefault();
      const destination = link.dataset.destination;

      const message = `
Hello ExploringLanka,

I want to explore tours in ${destination}.

Please send me available experiences, prices, pickup options, and tour details.
`;

      showToast("Opening WhatsApp destination inquiry...");
      openWhatsApp(message);
    });
  });
}

function bookingModal() {
  return byId("bookingModal");
}

function openBookingModal(tourName) {
  const modal = bookingModal();

  if (!modal) {
    openWhatsApp(`Hello ExploringLanka,\n\nI would like to book: ${tourName}.\n\nPlease send me availability and price details.`);
    return;
  }

  setFirstValue(["modalTourName", "bookingTour"], tourName);

  modal.classList.add("show");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";

  showToast("Booking form opened");
}

function closeBookingModal() {
  const modal = bookingModal();
  if (!modal) return;

  modal.classList.remove("show");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
}

function initBookingModal() {
  document.querySelectorAll(".book-now-btn, .book-btn").forEach((button) => {
    bindOnce(button, "bookingOpenBound", () => {
      openBookingModal(button.dataset.tour || "Selected Tour");
    });
  });

  document.querySelectorAll(".modal-close, .close-modal").forEach((button) => {
    bindOnce(button, "bookingCloseBound", closeBookingModal);
  });

  const modal = bookingModal();
  if (modal) {
    bindOnce(modal, "bookingBackdropBound", (event) => {
      if (event.target === modal) closeBookingModal();
    });
  }

  if (!document.documentElement.dataset.bookingEscapeBound) {
    document.documentElement.dataset.bookingEscapeBound = "true";
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeBookingModal();
    });
  }
}

function validateBookingForm() {
  const name = getFirstValue(["customerName", "bookingName"], "");
  const phone = getFirstValue(["customerPhone", "bookingPhone"], "");
  const date = getValue("bookingDate", "");
  const errorBox = byId("bookingError");

  if (!name || !phone || !date) {
    if (errorBox) {
      errorBox.textContent = "Please fill your name, WhatsApp number, and travel date.";
    }
    showToast("Please fill required booking details", "error");
    return false;
  }

  if (errorBox) errorBox.textContent = "";
  return true;
}

function buildBookingMessage() {
  return `
Hello ExploringLanka,

I would like to book this Sri Lanka travel experience.

Tour: ${getFirstValue(["modalTourName", "bookingTour"])}
Name: ${getFirstValue(["customerName", "bookingName"])}
Email: ${getFirstValue(["customerEmail", "bookingEmail"])}
WhatsApp Number: ${getFirstValue(["customerPhone", "bookingPhone"])}
Travel Date: ${getValue("bookingDate")}
Travelers: ${getFirstValue(["bookingGuests", "bookingTravelers"])}
Pickup Location: ${getFirstValue(["pickupLocation", "bookingPickup"])}
Special Message: ${getFirstValue(["specialMessage", "bookingMessage"])}

Please confirm availability, final price, pickup time, and payment details.
`;
}

function initBookingActions() {
  const whatsAppButton = byId("sendWhatsApp") || byId("sendBookingWhatsApp");
  const emailButton = byId("sendEmail") || byId("sendBookingEmail");

  bindOnce(whatsAppButton, "bookingWhatsAppBound", () => {
    if (!validateBookingForm()) return;
    showToast("Opening WhatsApp booking request...");
    openWhatsApp(buildBookingMessage());
    closeBookingModal();
  });

  bindOnce(emailButton, "bookingEmailBound", () => {
    if (!validateBookingForm()) return;
    const tourName = getFirstValue(["modalTourName", "bookingTour"], "Selected Tour");
    showToast("Opening email booking request...");
    openEmail(`Booking Request - ${tourName}`, buildBookingMessage());
    closeBookingModal();
  });
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("exploringLankaWishlist") || "[]");
  } catch {
    return [];
  }
}

function saveWishlist(wishlist) {
  localStorage.setItem("exploringLankaWishlist", JSON.stringify(wishlist));
}

function initWishlist() {
  document.querySelectorAll(".heart-btn, .heart").forEach((button) => {
    const tourCard = button.closest(".tour-card");
    const title = button.dataset.wishlist || tourCard?.querySelector("h3")?.textContent.trim();
    if (!title) return;

    if (getWishlist().includes(title)) {
      button.classList.add("active");
      button.textContent = "♥";
    }

    bindOnce(button, "wishlistBound", (event) => {
      event.preventDefault();
      let wishlist = getWishlist();

      if (wishlist.includes(title)) {
        wishlist = wishlist.filter((item) => item !== title);
        button.classList.remove("active");
        button.textContent = "♡";
        showToast("Removed from wishlist");
      } else {
        wishlist.push(title);
        button.classList.add("active");
        button.textContent = "♥";
        showToast("Added to wishlist");
      }

      saveWishlist(wishlist);
    });
  });
}

function initWhatsAppHelpButtons() {
  document.querySelectorAll(".js-whatsapp-help").forEach((button) => {
    bindOnce(button, "whatsAppHelpBound", (event) => {
      event.preventDefault();

      const message = `
Hello ExploringLanka,

I need help planning my Sri Lanka trip.

Please send me details about your tours, airport transfers, and custom travel packages.
`;

      showToast("Opening WhatsApp...");
      openWhatsApp(message);
    });
  });
}

function initBackToTop() {
  const backToTop = byId("backToTop") || document.querySelector(".back-to-top");
  if (!backToTop) return;

  if (!document.documentElement.dataset.backToTopScrollBound) {
    document.documentElement.dataset.backToTopScrollBound = "true";
    window.addEventListener("scroll", () => {
      const button = byId("backToTop") || document.querySelector(".back-to-top");
      if (button) button.classList.toggle("show", window.scrollY > 500);
    });
  }

  bindOnce(backToTop, "backToTopBound", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initTourPageFilters() {
  const searchInput = byId("tourSearchInput") || byId("tourSearch");
  const filterCheckboxes = document.querySelectorAll(".tour-filter");
  const tourCards = document.querySelectorAll(".tour-result-card, .tour-list .tour-card");
  const resultsCount = byId("resultsCount");

  if (!tourCards.length) return;

  function filterTours() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeFilters = [...filterCheckboxes]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value.toLowerCase());
    let visibleCount = 0;

    tourCards.forEach((card) => {
      const searchableText = `${card.dataset.search || ""} ${card.dataset.title || ""} ${card.dataset.category || ""} ${card.dataset.destination || ""} ${card.textContent}`.toLowerCase();
      const matchesSearch = !searchText || searchableText.includes(searchText);
      const matchesFilters = activeFilters.length === 0 || activeFilters.some((filter) => searchableText.includes(filter));

      card.style.display = matchesSearch && matchesFilters ? "" : "none";
      if (matchesSearch && matchesFilters) visibleCount++;
    });

    if (resultsCount) {
      resultsCount.textContent = `${visibleCount} experiences available`;
    }
  }

  bindOnce(searchInput, "tourSearchBound", filterTours, "input");
  filterCheckboxes.forEach((checkbox) => bindOnce(checkbox, "tourFilterBound", filterTours, "change"));
  filterTours();
}

function buildTransferMessage() {
  return `
Hello ExploringLanka,

I need a private transfer quote in Sri Lanka.

Name: ${getValue("transferName")}
WhatsApp Number: ${getValue("transferPhone")}
Pickup Location: ${getValue("pickupLocationTransfer")}
Drop-off Location: ${getValue("dropLocationTransfer")}
Date: ${getValue("transferDate")}
Time: ${getValue("transferTime")}
Vehicle Type: ${getValue("vehicleType")}
Passengers: ${getValue("transferPassengers")}
Luggage: ${getValue("transferLuggage")}
Special Notes: ${getValue("transferMessage")}

Please send me the price, availability, pickup details, and vehicle options.
`;
}

function validateTransferForm() {
  const errorBox = byId("transferError");
  const missing = !getValue("transferName", "") ||
    !getValue("transferPhone", "") ||
    !getValue("pickupLocationTransfer", "") ||
    !getValue("dropLocationTransfer", "");

  if (missing) {
    if (errorBox) {
      errorBox.textContent = "Please fill your name, WhatsApp number, pickup location, and drop-off location.";
    }
    showToast("Please fill required transfer details", "error");
    return false;
  }

  if (errorBox) errorBox.textContent = "";
  return true;
}

function initTransferForm() {
  const form = byId("transferQuoteForm");
  const emailButton = byId("transferEmailBtn");

  bindOnce(form, "transferSubmitBound", (event) => {
    event.preventDefault();
    if (!validateTransferForm()) return;
    showToast("Opening WhatsApp transfer quote...");
    openWhatsApp(buildTransferMessage());
  }, "submit");

  bindOnce(emailButton, "transferEmailBound", () => {
    if (!validateTransferForm()) return;
    showToast("Opening email transfer quote...");
    openEmail("Private Transfer Quote Request", buildTransferMessage());
  });
}

function initRouteQuoteButtons() {
  document.querySelectorAll(".route-quote-btn").forEach((button) => {
    bindOnce(button, "routeQuoteBound", () => {
      const route = button.dataset.route || "Private Transfer";

      const message = `
Hello ExploringLanka,

I would like to request a transfer quote.

Route / Vehicle: ${route}

Please send me the price, available vehicle options, travel time, and booking details.
`;

      showToast("Opening WhatsApp route quote...");
      openWhatsApp(message);
    });
  });
}

function buildCustomTourMessage() {
  return `
Hello ExploringLanka,

I would like to plan a custom Sri Lanka tour.

Name: ${getValue("customName")}
Email: ${getValue("customEmail")}
WhatsApp Number: ${getValue("customPhone")}
Travelers: ${getValue("customTravelers")}
Arrival Date: ${getValue("arrivalDate")}
Departure Date: ${getValue("departureDate")}
Starting Location: ${getValue("startLocation")}
Ending Location: ${getValue("endLocation")}
Preferred Destinations: ${checkedValues("destinations")}
Travel Interests: ${checkedValues("interests")}
Budget Range: ${getValue("budgetRange")}
Accommodation Preference: ${getValue("accommodationPreference")}
Transport Preference: ${getValue("transportPreference")}
Special Requests: ${getValue("customMessage")}

Please create a private itinerary and send me a quotation.
`;
}

function validateCustomTourForm() {
  const errorBox = byId("customTourError");
  const missing = !getValue("customName", "") || !getValue("customPhone", "");

  if (missing) {
    if (errorBox) {
      errorBox.textContent = "Please fill your name and WhatsApp number.";
    }
    showToast("Please fill required custom tour details", "error");
    return false;
  }

  if (errorBox) errorBox.textContent = "";
  return true;
}

function initCustomTourForm() {
  const form = byId("customTourForm");
  const emailButton = byId("customTourEmailBtn");

  bindOnce(form, "customSubmitBound", (event) => {
    event.preventDefault();
    if (!validateCustomTourForm()) return;
    showToast("Opening WhatsApp custom tour request...");
    openWhatsApp(buildCustomTourMessage());
  }, "submit");

  bindOnce(emailButton, "customEmailBound", () => {
    if (!validateCustomTourForm()) return;
    showToast("Opening email custom tour request...");
    openEmail("Custom Sri Lanka Tour Request", buildCustomTourMessage());
  });
}

function initItineraryButtons() {
  document.querySelectorAll(".itinerary-btn").forEach((button) => {
    bindOnce(button, "itineraryBound", () => {
      const itinerary = button.dataset.itinerary || "Custom Sri Lanka itinerary";

      const message = `
Hello ExploringLanka,

I am interested in this sample itinerary:

${itinerary}

Please send me the itinerary, price range, hotel options, and available dates.
`;

      showToast("Opening WhatsApp itinerary request...");
      openWhatsApp(message);
    });
  });
}

function buildContactMessage() {
  return `
Hello ExploringLanka,

I would like to contact you.

Name: ${getValue("contactName")}
Email: ${getValue("contactEmail")}
WhatsApp Number: ${getValue("contactPhone")}
Subject: ${getValue("contactSubject")}

Message:
${getValue("contactMessage")}

Please reply when possible.
`;
}

function validateContactForm() {
  const errorBox = byId("contactError");
  const missing = !getValue("contactName", "") ||
    !getValue("contactPhone", "") ||
    !getValue("contactMessage", "");

  if (missing) {
    if (errorBox) {
      errorBox.textContent = "Please fill your name, WhatsApp number, and message.";
    }
    showToast("Please fill required contact details", "error");
    return false;
  }

  if (errorBox) errorBox.textContent = "";
  return true;
}

function initContactForm() {
  const form = byId("contactForm");
  const emailButton = byId("contactEmailBtn");

  bindOnce(form, "contactSubmitBound", (event) => {
    event.preventDefault();
    if (!validateContactForm()) return;
    showToast("Opening WhatsApp contact message...");
    openWhatsApp(buildContactMessage());
  }, "submit");

  bindOnce(emailButton, "contactEmailBound", () => {
    if (!validateContactForm()) return;
    showToast("Opening email contact message...");
    openEmail(getValue("contactSubject", "Contact Inquiry"), buildContactMessage());
  });
}

function initDetailsButtons() {
  document.querySelectorAll(".details-btn").forEach((button) => {
    bindOnce(button, "detailsBound", () => {
      const tour = button.dataset.tour || "Selected Tour";
      if (tour.toLowerCase().includes("sigiriya")) {
        window.location.href = "tour-details.html?tour=sigiriya-rock-fortress";
        return;
      }
      openWhatsApp(`Hello ExploringLanka,\n\nPlease send me full details for ${tour}.`);
    });
  });
}

function initNewsletterForms() {
  document.querySelectorAll(".js-newsletter").forEach((form) => {
    bindOnce(form, "newsletterBound", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const email = input?.value.trim() || "Not provided";

      openEmail(
        "Newsletter Subscription Request",
        `Hello ExploringLanka,\n\nI would like to subscribe to your Sri Lanka travel updates.\n\nEmail: ${email}`
      );
    }, "submit");
  });
}

function initHeroCarousel() {
  const hero = document.querySelector(".hero-section");
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll("[data-hero-slide]")];
  const label = byId("heroCarouselLabel");
  const previousButton = document.querySelector("[data-hero-prev]");
  const nextButton = document.querySelector("[data-hero-next]");
  const slideLabels = ["Sigiriya sunrise", "Hill country escapes", "Galle coast routes"];

  if (!hero || slides.length < 2) return;

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("active"));
  let timer = null;
  activeIndex = activeIndex >= 0 ? activeIndex : 0;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });

    if (label) {
      label.textContent = slideLabels[activeIndex] || `Slide ${activeIndex + 1}`;
    }
  }

  function startCarousel() {
    if (timer) return;
    timer = setInterval(() => showSlide(activeIndex + 1), 5200);
  }

  function stopCarousel() {
    clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot) => {
    bindOnce(dot, "heroCarouselDotBound", () => {
      showSlide(Number(dot.dataset.heroSlide || 0));
      stopCarousel();
      startCarousel();
    });
  });

  bindOnce(previousButton, "heroCarouselPrevBound", () => {
    showSlide(activeIndex - 1);
    stopCarousel();
    startCarousel();
  });

  bindOnce(nextButton, "heroCarouselNextBound", () => {
    showSlide(activeIndex + 1);
    stopCarousel();
    startCarousel();
  });

  bindOnce(hero, "heroCarouselMouseEnterBound", stopCarousel, "mouseenter");
  bindOnce(hero, "heroCarouselMouseLeaveBound", startCarousel, "mouseleave");

  showSlide(activeIndex);
  startCarousel();
}

/* ================= FLEET PAGE WHATSAPP QUOTE ================= */

function initFleetQuoteButtons() {
  const fleetButtons = document.querySelectorAll(".fleet-quote-btn");

  fleetButtons.forEach((button) => {
    bindOnce(button, "fleetQuoteBound", () => {
      const vehicle = button.dataset.vehicle || "Selected Vehicle";

      const message = `
Hello ExploringLanka,

I would like to request a vehicle quote.

Vehicle: ${vehicle}

Please send me the price and availability.

My travel details:
Pickup Location:
Destination:
Travel Date:
Number of Passengers:
Luggage:
Special Requests:
`;

      showToast("Opening WhatsApp vehicle quote...");
      openWhatsApp(message);
    });
  });
}

function initPageScripts() {
  initHeroSearch();
  initCategoryCards();
  initDestinationLinks();
  initBookingModal();
  initBookingActions();
  initWishlist();
  initWhatsAppHelpButtons();
  initBackToTop();
  initTourPageFilters();
  initTransferForm();
  initRouteQuoteButtons();
  initCustomTourForm();
  initItineraryButtons();
  initContactForm();
  initDetailsButtons();
  initNewsletterForms();
  initHeroCarousel();
  initFleetQuoteButtons();
}

document.addEventListener("DOMContentLoaded", initPageScripts);
document.addEventListener("componentsLoaded", initPageScripts);
