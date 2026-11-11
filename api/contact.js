import { neon } from "@neondatabase/serverless";

// Both values come from Vercel's environment variables, never from the code.
const sql = neon(process.env.DATABASE_URL);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns trimmed text, or "" if the value isn't a string.
const text = (value) => (typeof value === "string" ? value.trim() : "");

export default async function handler(req, res) {
  // Browsers only let your GitHub Pages site call this API if these headers allow it.
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (req.headers.origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: "Forbidden." });
  }

  let body;
  try {
    body = req.body ?? {};
  } catch {
    return res.status(400).json({ error: "Invalid request." });
  }

  // Hidden "website" field: people never see it, so only bots fill it in.
  if (body.website) {
    return res.status(201).json({ ok: true });
  }

  const name = text(body.name);
  const email = text(body.email);
  const message = text(body.message);

  const errors = [];
  if (!name || name.length > 100) errors.push("Please enter your name (up to 100 characters).");
  if (email.length > 200 || !EMAIL_PATTERN.test(email)) errors.push("Please enter a valid email address.");
  if (!message || message.length > 5000) errors.push("Please enter a message (up to 5,000 characters).");

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  try {
    await sql`
      INSERT INTO messages (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;
  } catch (error) {
    console.error("Could not save message:", error);
    return res.status(500).json({ error: "Your message couldn't be saved. Please try again later." });
  }

  return res.status(201).json({ ok: true });
}
