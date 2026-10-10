"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, MessageCircle, Send } from "lucide-react";
import { profile } from "@/lib/data";
import { openChat } from "@/lib/chat";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "mt-2 w-full rounded-md border border-inverse-line bg-transparent px-4 py-3 text-[15px] text-inverse-ink outline-none transition-colors placeholder:text-inverse-muted/70 focus:border-accent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  // When the form became usable; the API rejects submissions faster than a human could type.
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form)),
          elapsed: Math.round((Date.now() - shownAt.current) / 1000),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="on-inverse bg-inverse py-24 text-inverse-ink sm:py-32">
      <div className="page-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow reveal text-inverse-muted">Contact</p>
          <h2 className="display reveal mt-4 text-5xl sm:text-7xl">
            Got something
            <br />
            to <span className="accent-word">build?</span>
          </h2>
          <p className="reveal mt-6 max-w-md text-lg leading-relaxed text-inverse-muted">
            A product idea, a backend that&apos;s buckling, or a role on your team. Tell me where it&apos;s
            stuck and I&apos;ll reply within a day.
          </p>

          <div className="reveal mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openChat}
              className="btn h-12 rounded-full border border-inverse-line px-5 text-inverse-ink hover:border-accent hover:text-accent"
            >
              <MessageCircle size={16} /> Chat with my AI assistant
            </button>
            <span className="text-sm text-inverse-muted">Instant answers about my work and availability.</span>
          </div>

          <dl className="reveal mt-12 divide-y divide-inverse-line border-y border-inverse-line text-sm">
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="text-inverse-muted">Email</dt>
              <dd className="flex items-center gap-2">
                <a href={`mailto:${profile.email}`} className="link-underline">
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="grid h-9 w-9 place-items-center rounded-md text-inverse-muted hover:text-inverse-ink"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </dd>
            </div>
            {[
              ["LinkedIn", profile.linkedin, "saif-hammad"],
              ["GitHub", profile.github, "Saif-Ul-llah"],
            ].map(([k, href, label]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-4">
                <dt className="text-inverse-muted">{k}</dt>
                <dd>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1">
                    {label} <ArrowUpRight size={14} />
                  </a>
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 py-4">
              <dt className="text-inverse-muted">Based in</dt>
              <dd>Karachi, Pakistan · UTC+5</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={onSubmit} className="reveal lg:col-span-6 lg:col-start-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm text-inverse-muted">
              Your name
              <input name="name" required maxLength={100} autoComplete="name" className={fieldClass} />
            </label>
            <label className="block text-sm text-inverse-muted">
              Your email
              <input name="email" type="email" required maxLength={200} autoComplete="email" className={fieldClass} />
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm text-inverse-muted">I&apos;m looking for</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {["A project build", "Contract help", "A full-time hire", "Just saying hi"].map((opt, i) => (
                <label key={opt} className="cursor-pointer">
                  <input type="radio" name="subject" value={opt} defaultChecked={i === 0} className="peer sr-only" />
                  <span className="inline-flex min-h-[40px] items-center rounded-full border border-inverse-line px-4 text-sm text-inverse-muted transition-colors peer-checked:border-accent peer-checked:text-inverse-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-6 block text-sm text-inverse-muted">
            What are you building?
            <textarea
              name="message"
              required
              rows={6}
              maxLength={5000}
              placeholder="The product, who uses it, and where it's stuck."
              className={`${fieldClass} resize-none`}
            />
          </label>

          {/* Honeypot for bots */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn h-12 bg-inverse-ink px-6 text-inverse hover:bg-accent hover:text-accent-ink disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
              <Send size={16} />
            </button>
            <p role="status" aria-live="polite" className="text-sm">
              {status === "sent" && <span className="text-ok">Thanks! Your message is in. I&apos;ll reply soon.</span>}
              {status === "error" && (
                <span className="text-red-400">
                  {error} You can also{" "}
                  <a href={`mailto:${profile.email}`} className="underline underline-offset-2">
                    email me directly
                  </a>
                  .
                </span>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
