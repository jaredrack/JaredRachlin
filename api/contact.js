const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const name = clean(request.body?.name, MAX_NAME_LENGTH);
  const email = clean(request.body?.email, MAX_EMAIL_LENGTH).toLowerCase();
  const message = clean(request.body?.message, MAX_MESSAGE_LENGTH);
  const website = clean(request.body?.website, 200);

  // Quietly accept bot-filled honeypot submissions without sending email.
  if (website) return response.status(200).json({ ok: true });

  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ error: "Please enter your name, a valid email, and a message." });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) {
    return response.status(503).json({ error: "Messaging is temporarily unavailable." });
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: ["jaredrachlin@gmail.com"],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `${name} (${email}) sent a message from jaredrachlin.dev:\n\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#10233d"><h2>New portfolio message</h2><p><strong>From:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p></div>`,
    }),
  });

  if (!emailResponse.ok) {
    const providerError = await emailResponse.text();
    console.error("Contact email delivery failed", emailResponse.status, providerError.slice(0, 600));
    return response.status(502).json({ error: "The message could not be sent. Please try again." });
  }

  return response.status(200).json({ ok: true });
};
