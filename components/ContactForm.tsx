"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full min-h-12 rounded-md border border-[#d9d4cb] bg-white px-[13px] py-3 font-inherit text-[15px] text-[#242424] focus:border-site-blue focus:outline-3 focus:outline-site-blue/20 max-[560px]:min-h-[52px] max-[560px]:text-base";

const labelClass = "grid gap-2 text-sm font-semibold text-[#34332f]";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to send your enquiry.");
        return;
      }

      setSuccess(
        "Thank you for contacting us. Your enquiry has been received, and our team will get back to you.",
      );
      form.reset();
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-6 grid gap-[19px]" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1 max-[560px]:gap-[18px]">
        <label className={labelClass}>
          Full name
          <input
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            required
            minLength={2}
            maxLength={100}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={254}
            className={inputClass}
          />
        </label>
      </div>

      <label className={labelClass}>
        Phone number
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          required
          minLength={7}
          maxLength={30}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Message
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us how we can help..."
          required
          minLength={10}
          maxLength={5000}
          className={`${inputClass} min-h-[125px] resize-y max-[560px]:text-base`}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 justify-self-start rounded-[28px] border border-site-blue bg-site-blue px-[19px] py-[13px] text-[15px] font-semibold text-white transition-transform hover:-translate-y-px hover:bg-[#0068df] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send enquiry"}
        {!loading && <ArrowRight size={18} />}
      </button>

      {error && (
        <p
          role="alert"
          className="m-0 rounded-md bg-red-50 px-3.5 py-3 text-sm leading-[1.6] text-red-700"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="m-0 flex items-start gap-2 rounded-md bg-[#edf7ef] px-3.5 py-3 text-sm leading-[1.6] text-[#235c32]"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          {success}
        </p>
      )}
    </form>
  );
}