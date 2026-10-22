"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

const inputClass =
  "w-full min-h-12 rounded-md border border-[#d9d4cb] bg-white px-[13px] py-3 font-inherit text-[15px] text-[#242424] focus:border-site-blue focus:outline-3 focus:outline-site-blue/20 max-[560px]:min-h-[52px] max-[560px]:text-base";

const labelClass =
  "grid gap-2 text-sm font-semibold text-[#34332f]";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="mt-6 grid gap-[19px]" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1 max-[560px]:gap-[18px]">
        <label className={labelClass}>
          Full name
          <input name="name" autoComplete="name" placeholder="Your full name" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Email address
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required className={inputClass} />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1 max-[560px]:gap-[18px]">
        <label className={labelClass}>
          Phone number <span className="font-normal text-[#777]">(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" className={inputClass} />
        </label>
        <label className={labelClass}>
          What can we help with?
          <select name="topic" defaultValue="Booking enquiry" className={inputClass}>
            <option>Booking enquiry</option>
            <option>Airport transfer</option>
            <option>City-to-city ride</option>
            <option>Corporate travel</option>
            <option>Other question</option>
          </select>
        </label>
      </div>
      <label className={labelClass}>
        Message
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us a little about your journey..."
          required
          className={`${inputClass} min-h-[125px] resize-y max-[560px]:text-base`}
        />
      </label>
      <button
        className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2.5 justify-self-start rounded-[28px] border border-site-blue bg-site-blue px-[19px] py-[13px] text-[15px] font-semibold text-white transition-transform hover:-translate-y-px hover:bg-[#0068df]"
        type="submit"
      >
        Send enquiry <ArrowRight size={18} />
      </button>
      {submitted && (
        <p className="m-0 rounded-md bg-[#edf7ef] px-3.5 py-3 text-sm leading-[1.6] text-[#235c32]" role="status">
          Thanks for your enquiry. This demo form has not sent a message yet;
          connect it to your email service or backend to receive submissions.
        </p>
      )}
    </form>
  );
}