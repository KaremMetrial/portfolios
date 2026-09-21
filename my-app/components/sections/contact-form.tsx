"use client";

import { useState, type FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";

type ContactFormProps = {
  /** Address the composed message goes to. */
  to: string;
  dict: {
    name: string;
    email: string;
    type: string;
    typePlaceholder: string;
    types: string[];
    message: string;
    messagePlaceholder: string;
    send: string;
    note: string;
    required: string;
  };
};

const labelClass =
  "font-display text-[0.65rem] font-semibold tracking-[0.16em] text-silver uppercase";

/**
 * Contact form. There is no mail endpoint yet, so it composes the message and
 * hands it to the visitor's email app — nothing is sent from the site.
 */
export function ContactForm({ to, dict }: ContactFormProps) {
  const [error, setError] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const type = String(data.get("type") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError(true);
      return;
    }
    setError(false);

    const subject = type ? `${type} — ${name}` : name;
    const body = `${message}\n\n— ${name} <${email}>`;
    track("contact_submit", { type: type || null });
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>{dict.name}</span>
          <Input name="name" autoComplete="name" required invalid={error} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>{dict.email}</span>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            required
            invalid={error}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>{dict.type}</span>
        <select
          name="type"
          defaultValue=""
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-offwhite focus:outline-2 focus:outline-offset-1 focus:outline-gold"
        >
          <option value="">{dict.typePlaceholder}</option>
          {dict.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>{dict.message}</span>
        <Textarea
          name="message"
          rows={6}
          required
          placeholder={dict.messagePlaceholder}
          invalid={error}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {dict.required}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gold px-7 font-display text-sm font-semibold text-charcoal transition-colors hover:bg-gold-light active:bg-gold-dark"
        >
          {dict.send}
          <span aria-hidden="true" className="rtl:rotate-180">
            →
          </span>
        </button>
        <p className="text-xs text-silver/70">{dict.note}</p>
      </div>
    </form>
  );
}
