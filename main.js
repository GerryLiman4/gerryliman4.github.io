// Placeholder until the backend is added: nothing is sent or stored.
const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  statusText.textContent = "This form isn't connected yet, so your message wasn't sent. Please reach me on LinkedIn for now.";
});
