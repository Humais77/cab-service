import Link from "next/link";
import { ArrowRight, Clock3, HeartHandshake, ShieldCheck, CarFront, Check } from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import StickyBookingCard from "@/components/StickyBookingCard";
import SiteFooter from "@/components/SiteFooter";

const reasons = [
  { icon: ShieldCheck, title: "A comfort-first approach", text: "We design the experience around a smooth, considered journey from pickup to arrival." },
  { icon: Clock3, title: "Planned around your time", text: "Share your pickup time and journey details so your transport request reflects your schedule." },
  { icon: CarFront, title: "Options for different journeys", text: "From airport transfers to group travel and city-to-city trips, choose a service that suits your plans." },
  { icon: HeartHandshake, title: "Clear, helpful communication", text: "Have a question or a special request? Get in touch with the details so our team can guide you." },
];

export default function WhyChooseUsPage() {
  return (
    <main className="site-page">
      <TransparentHeader />
      <section className="inner-hero why-hero">
        <div className="inner-hero__copy">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><span>Why choose us</span></div>
          <span className="eyebrow">THE CAB SERVICE DIFFERENCE</span>
          <h1>Good journeys start with feeling taken care of.</h1>
          <p>We believe getting there should feel straightforward. Our focus is on comfort, thoughtful planning and helping you find the right ride for your journey.</p>
          <Link className="button button--blue" href="/#booking">Plan your journey <ArrowRight size={18} /></Link>
        </div>
        <div className="inner-hero__image-wrap">
          <img className="inner-hero__image" src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=90" alt="Premium car ready for a journey" />
        </div>
      </section>

      <div className="service-detail-layout why-layout">
        <section className="why-content">
          <span className="eyebrow">WHAT MATTERS TO US</span>
          <h2>Thoughtful travel, at every step.</h2>
          <p className="large-copy">Whether you are heading to the airport, travelling for work or planning a trip with family, we want the booking process to feel clear and your journey to feel comfortable.</p>
          <div className="reason-grid">
            {reasons.map(({ icon: Icon, title, text }, index) => (
              <article className="reason-card" key={title}>
                <div className="reason-card__top"><span><Icon size={24} /></span><small>0{index + 1}</small></div>
                <h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
          <section className="promise-panel">
            <span className="eyebrow">OUR PROMISE</span>
            <h2>Clear details. Comfortable travel.</h2>
            <ul className="check-list">
              <li><Check size={19} />Simple booking enquiries</li>
              <li><Check size={19} />Services for different travel needs</li>
              <li><Check size={19} />A focus on passenger comfort</li>
            </ul>
            <Link className="button button--dark" href="/contact">Talk to our team <ArrowRight size={18} /></Link>
          </section>
        </section>
        <aside className="service-detail-sidebar"><StickyBookingCard /></aside>
      </div>
      <SiteFooter />
    </main>
  );
}
