const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector("#main-menu");
const themeToggle = document.querySelector(".theme-toggle");
const contactForm = document.querySelector(".contact-form");
const helpForm = document.querySelector(".help-form");
const helpBoard = document.querySelector(".help-board");
const coordinatorPhone = "50364465489";

const savedTheme = localStorage.getItem("shekinah-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

function syncThemeButton() {
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = isDark ? "Claro" : "Oscuro";
  themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
}

syncThemeButton();

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

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("nombre") || "Visitante";
  const contact = formData.get("contacto") || "Sin contacto";
  const message = formData.get("mensaje") || "Quiero mas informacion.";
  const whatsappMessage = `Hola, soy ${name}. Mi contacto es ${contact}. ${message}`;

  window.open(
    `https://wa.me/${coordinatorPhone}?text=${encodeURIComponent(whatsappMessage)}`,
    "_blank",
    "noopener,noreferrer"
  );
});

helpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(helpForm);
  const name = formData.get("nombre-ayuda");
  const type = formData.get("tipo-ayuda");
  const message = formData.get("mensaje-ayuda");
  const card = document.createElement("article");
  card.className = "help-card";

  const tag = document.createElement("span");
  tag.textContent = type;

  const title = document.createElement("h3");
  title.textContent = name;

  const text = document.createElement("p");
  text.textContent = message;

  const link = document.createElement("a");
  link.className = "button dark";
  link.href = `https://wa.me/${coordinatorPhone}?text=${encodeURIComponent(
    `Hola, quiero ayudar o consultar sobre esta solicitud: ${type} - ${message}`
  )}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Coordinar ayuda";

  card.append(tag, title, text, link);
  helpBoard.prepend(card);
  helpForm.reset();
});
