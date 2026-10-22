import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import StickyBookingCard from "@/components/StickyBookingCard";
import SiteFooter from "@/components/SiteFooter";

export type ServiceLandingData = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  benefits: string[];
  sections: { title: string; text: string }[];
};

export default function ServiceLandingPage({ data }: { data: ServiceLandingData }) {
  return (
    <main className="site-page">
      <TransparentHeader />
      <section className="inner-hero">
        <div className="inner-hero__copy">
          <div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={14} /><Link href="/services">Our services</Link><ChevronRight size={14} /><span>{data.title}</span></div>
          <span className="eyebrow">{data.eyebrow}</span>
          <h1>{data.title}</h1>
          <p>{data.intro}</p>
          <Link className="button button--blue" href="/#booking">Plan your journey <ArrowRight size={18} /></Link>
        </div>
        <div className="inner-hero__image-wrap">
          <img src={data.image} alt={data.imageAlt} className="inner-hero__image" />
        </div>
      </section>

      <div className="service-detail-layout">
        <article className="service-detail-content">
          <section className="detail-intro">
            <span className="eyebrow">TRAVEL, MADE MORE COMFORTABLE</span>
            <h2>A smoother way to get there.</h2>
            <p>{data.intro}</p>
            <ul className="check-list">
              {data.benefits.map((benefit) => <li key={benefit}><Check size={19} />{benefit}</li>)}
            </ul>
          </section>

          <div className="detail-feature-grid">
            {data.sections.map((section, index) => (
              <section className="detail-feature" key={section.title}>
                <span className="detail-feature__number">0{index + 1}</span>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </section>
            ))}
          </div>

          <section className="detail-bottom-cta">
            <span className="eyebrow">READY WHEN YOU ARE</span>
            <h2>Make your next journey a little easier.</h2>
            <p>Tell us where you need to go and prepare your booking request.</p>
            <Link className="button button--dark" href="/#booking">Book a ride <ArrowRight size={18} /></Link>
          </section>
        </article>

        <div className="service-detail-sidebar">
          <StickyBookingCard />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
