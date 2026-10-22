"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <label>Full name<input name="name" autoComplete="name" placeholder="Your full name" required /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
      </div>
      <div className="contact-form__row">
        <label>Phone number <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" /></label>
        <label>What can we help with?
          <select name="topic" defaultValue="Booking enquiry">
            <option>Booking enquiry</option>
            <option>Airport transfer</option>
            <option>City-to-city ride</option>
            <option>Corporate travel</option>
            <option>Other question</option>
          </select>
        </label>
      </div>
      <label>Message<textarea name="message" rows={5} placeholder="Tell us a little about your journey..." required /></label>
      <button className="button button--blue" type="submit">Send enquiry <ArrowRight size={18} /></button>
      {submitted && <p className="contact-form__notice" role="status">Thanks for your enquiry. This demo form has not sent a message yet; connect it to your email service or backend to receive submissions.</p>}
    </form>
  );
}
