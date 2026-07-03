"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailto = () => {
    const subject = encodeURIComponent(`${site.product.name} inquiry from ${name || "website"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${site.contact.support}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <div className="field">
        <label htmlFor="c-name">Name</label>
        <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div className="field">
        <label htmlFor="c-email">Email</label>
        <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
      </div>
      <div className="field">
        <label htmlFor="c-msg">How can we help?</label>
        <textarea id="c-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your CASA deadline, your stack, or your question…" />
      </div>
      <button className="btn btn--primary" onClick={mailto} disabled={!message.trim()}>
        Send message
      </button>
    </div>
  );
}
