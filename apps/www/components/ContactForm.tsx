"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch(`${site.appApiBase}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, source: "marketing", company_website: website }),
      });
      if (!res.ok) throw new Error("failed");
      setState("sent");
      setName(""); setEmail(""); setMessage("");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="card" style={{ maxWidth: 520 }}>
        <h3 style={{ fontSize: 18, marginBottom: 8 }}>Thanks — we got it. ✅</h3>
        <p className="muted" style={{ fontSize: 15 }}>
          Our team will get back to you shortly. For anything urgent, email{" "}
          <a href={`mailto:${site.contact.support}`} style={{ color: "var(--accent)" }}>
            {site.contact.support}
          </a>.
        </p>
      </div>
    );
  }

  return (
    <form className="card" style={{ maxWidth: 520 }} onSubmit={submit}>
      <div className="field">
        <label htmlFor="c-name">Name</label>
        <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
      </div>
      <div className="field">
        <label htmlFor="c-msg">How can we help?</label>
        <textarea id="c-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your CASA deadline, your stack, or your question…" required />
      </div>
      {/* Honeypot — hidden from humans; bots fill it and get dropped. */}
      <input
        type="text" tabIndex={-1} autoComplete="off" value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        aria-hidden="true"
      />
      {state === "error" && (
        <p style={{ color: "var(--bad)", fontSize: 14, marginBottom: 10 }}>
          Something went wrong. Please email {site.contact.support}.
        </p>
      )}
      <button className="btn btn--primary" type="submit" disabled={state === "sending" || !message.trim()}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
