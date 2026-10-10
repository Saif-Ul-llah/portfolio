export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Best-effort rate limit: 5 messages per IP per 10 minutes. In-memory, so it
// resets on cold starts, which is fine for a portfolio's spam volume.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) hits.clear(); // keep memory bounded
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden honeypot field or submit within a couple of seconds. Pretend success.
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : Infinity;
  if (str(body.company, 200) || elapsed < 3) return NextResponse.json({ success: true });

  const name = str(body.name, 100);
  const email = str(body.email, 200);
  const subject = str(body.subject, 150) || "New message";
  const message = str(body.message, 5000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please add your name, a valid email and a message." }, { status: 400 });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("Contact form: SMTP_USER / SMTP_PASS are not configured");
    return NextResponse.json({ error: "Email is not configured right now." }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      // Gmail rejects or rewrites spoofed senders, so send as ourselves and reply to the visitor.
      from: `"Portfolio: ${name.replace(/["\r\n]/g, "")}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nLooking for: ${subject}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escape(name)}</p>
             <p><strong>Email:</strong> ${escape(email)}</p>
             <p><strong>Looking for:</strong> ${escape(subject)}</p>
             <p><strong>Message:</strong><br/>${escape(message).replace(/\n/g, "<br/>")}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Could not send right now." }, { status: 500 });
  }
}
