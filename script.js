const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector("#main-menu");
const contactForm = document.querySelector(".contact-form");
const helpForm = document.querySelector(".help-form");
const helpBoard = document.querySelector(".help-board");
const coordinatorPhone = "50364465489";

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
  const message = formData.get("mensaje") || "Quiero más información.";
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
  tag.className = "tag";
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
