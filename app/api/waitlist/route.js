import { Resend } from "resend";

// Loose RFC-5322-ish check — good enough to catch typos without rejecting
// valid addresses a stricter regex would choke on.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return Response.json(
      { error: "Waitlist signup is temporarily unavailable." },
      { status: 500 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let error;
  try {
    ({ error } = await resend.emails.send({
      from: "Omnigent <hello@omnigent.ai>",
      to: email,
      subject: "You're on the Omnigent waitlist",
      html: `<p>Thanks for your interest in Omnigent! We'll email you as soon as your spot is ready.</p>`,
    }));
  } catch (err) {
    console.error("Resend send threw:", err);
    return Response.json(
      { error: "Couldn't add you to the waitlist. Please try again." },
      { status: 502 },
    );
  }

  if (error) {
    console.error("Resend send failed:", error);
    return Response.json(
      { error: "Couldn't add you to the waitlist. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
