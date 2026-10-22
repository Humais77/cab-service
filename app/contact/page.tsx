import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";
export default function ContactPage() {
  return (
    <main className="site-page">
      <TransparentHeader />
      <section className="contact-hero">
        <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>Contact us</span></div>
        <span className="eyebrow">WE'RE HERE TO HELP</span>
        <h1>Let's talk about your journey.</h1>
        <p>Ask a question, tell us about an upcoming trip or share the details of a transport request.</p>
      </section>

      <section className="contact-layout">
        <div className="contact-info">
          <span className="eyebrow">GET IN TOUCH</span>
          <h2>How can we help?</h2>
          <p>Send us a message using the form. Replace the placeholder business details below before publishing your website.</p>
          <div className="contact-info__item"><span><Phone size={21} /></span><div><strong>Call us</strong><p>Add your business phone number</p></div></div>
          <div className="contact-info__item"><span><Mail size={21} /></span><div><strong>Email us</strong><p>Add your business email address</p></div></div>
          <div className="contact-info__item"><span><MapPin size={21} /></span><div><strong>Service area</strong><p>Add your operating cities or regions</p></div></div>
          <div className="contact-info__note">For a new ride, you can also go straight to the booking form.</div>
          <Link className="text-link-new" href="/#booking">Go to booking <ArrowRight size={17} /></Link>
        </div>
        <div className="contact-form-panel">
          <h2>Send an enquiry</h2>
          <p>Fields marked as required need to be completed.</p>
          <ContactForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
