// Sends the contact form to the backend on Vercel, which saves it in the database.
const API_URL = "https://gerryliman4githubio.vercel.app/api/contact";

const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Turns the form fields into { name, email, message, website }.
  const data = Object.fromEntries(new FormData(form));

  submitButton.disabled = true;
  statusText.textContent = "Sending…";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      form.reset();
      statusText.textContent = "Thanks! Your message was sent. I'll get back to you soon.";
    } else {
      statusText.textContent = result.error || "Something went wrong. Please try again.";
    }
  } catch {
    // fetch only throws when the server can't be reached at all.
    statusText.textContent = "Couldn't reach the server. Please try again later, or message me on LinkedIn.";
  } finally {
    submitButton.disabled = false;
  }
});
