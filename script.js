const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector("#main-menu");
const themeToggle = document.querySelector(".theme-toggle");
const contactForm = document.querySelector(".contact-form");
const helpForm = document.querySelector(".help-form");
const siteHeader = document.querySelector("#site-header");
const backToTop = document.querySelector(".back-to-top");
const navLinks = document.querySelectorAll("[data-nav]");

const coordinatorPhone = document.body.dataset.phone || "";
const phoneDisplay = document.body.dataset.phoneDisplay || coordinatorPhone;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const supabaseUrl = document.body.dataset.supabaseUrl || "";
const supabaseAnonKey = document.body.dataset.supabaseAnonKey || "";
const supabaseClient =
  supabaseUrl && supabaseAnonKey && window.supabase
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

function initPhoneLinks() {
  if (!coordinatorPhone) return;

  document.querySelectorAll("[data-phone-display]").forEach((element) => {
    element.textContent = phoneDisplay;
  });

  document.querySelectorAll("[data-wa-link]").forEach((link) => {
    link.href = `https://wa.me/${coordinatorPhone}`;
  });
}

function openWhatsApp(message) {
  if (!coordinatorPhone) return;

  window.open(
    `https://wa.me/${coordinatorPhone}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

async function saveToSupabase(table, payload) {
  if (!supabaseClient) return;

  const { error } = await supabaseClient.from(table).insert(payload);
  if (error) {
    console.warn(`Supabase (${table}):`, error.message);
  }
}

const savedTheme = localStorage.getItem("shekinah-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

function syncThemeButton() {
  const isDark = document.body.classList.contains("dark-mode");
  const label = themeToggle.querySelector("span");
  if (label) label.textContent = isDark ? "Claro" : "Oscuro";
  themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
}

syncThemeButton();
initPhoneLinks();

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("shekinah-theme", isDark ? "dark" : "light");
  syncThemeButton();
});

menuButton.addEventListener("click", () => {
  const isOpen = mainMenu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mainMenu.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    mainMenu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener(
  "scroll",
  () => {
    const scrolled = window.scrollY > 20;
    siteHeader.classList.toggle("scrolled", scrolled);
    backToTop.hidden = window.scrollY < 400;
  },
  { passive: true }
);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

const sectionIds = Array.from(navLinks).map((link) => link.getAttribute("href").slice(1));
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

function updateActiveNav() {
  const scrollPos = window.scrollY + siteHeader.offsetHeight + 40;
  let current = sectionIds[0];

  for (const section of sections) {
    if (section.offsetTop <= scrollPos) {
      current = section.id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealElements.forEach((el) => revealObserver.observe(el));

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("nombre") || "Visitante";
  const contact = formData.get("contacto") || "Sin contacto";
  const message = formData.get("mensaje") || "Quiero mas informacion.";
  const whatsappMessage = `Hola, soy ${name}. Mi contacto es ${contact}. ${message}`;

  await saveToSupabase("mensajes_contacto", {
    nombre: name,
    contacto: contact,
    mensaje: message,
  });

  openWhatsApp(whatsappMessage);
});

helpForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(helpForm);
  const name = formData.get("nombre-ayuda");
  const type = formData.get("tipo-ayuda") || "Ayuda general";
  const message = formData.get("mensaje-ayuda");
  const whatsappMessage = `Hola, solicito ayuda (${type}). Soy ${name}. ${message}`;

  await saveToSupabase("solicitudes_ayuda", {
    nombre: name,
    tipo: type,
    mensaje: message,
  });

  openWhatsApp(whatsappMessage);
  helpForm.reset();
});
