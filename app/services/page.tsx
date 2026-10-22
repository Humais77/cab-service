import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import StickyBookingCard from "@/components/StickyBookingCard";
import SiteFooter from "@/components/SiteFooter";

const services = [
  {
    category: "LONG-DISTANCE TRAVEL",
    title: "City-to-city rides",
    description: "Travel between cities with the convenience of a private, door-to-door ride arranged around your schedule.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    alt: "Open road stretching into the distance",
    href: "/services/city-to-city",
  },
  {
    category: "AIRPORT TRANSFERS",
    title: "Smooth landings, every time.",
    description: "Make airport journeys simpler with a planned pickup and a comfortable ride to your next destination.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
    alt: "Passenger airplane travelling through the sky",
    href: "/services/airport-transfers",
  },
  {
    category: "FLEXIBLE CHAUFFEUR HIRE",
    title: "Your day, your schedule.",
    description: "Arrange a driver for several appointments, shopping, events or a day with multiple stops.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=85",
    alt: "Comfortable car interior",
    href: "/services/hourly-hire",
  },
  {
    category: "BUSINESS TRAVEL",
    title: "Arrive ready for business.",
    description: "A considered transport option for meetings, corporate visits, conferences and client travel.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    alt: "Professional modern office",
    href: "/services/corporate-travel",
  },
];

export default function ServicesPage() {
  return (
    <main className="site-page">
      <TransparentHeader />
      <section className="listing-hero">
        <span className="eyebrow">OUR SERVICES</span>
        <h1>Every journey,<br />considered.</h1>
        <p>From airport pickups to longer journeys between cities, find a ride that fits your plans.</p>
        <Link className="button button--blue" href="/#booking">Plan your journey <ArrowRight size={18} /></Link>
      </section>

      <div className="service-listing-layout">
        <section className="service-listing-grid" aria-label="Available services">
          {services.map((service, index) => (
            <article className="service-listing-card" key={service.href}>
              <Link href={service.href} className="service-listing-card__image-link" aria-label={`Explore ${service.title}`}>
                <img src={service.image} alt={service.alt} loading="lazy" />
                <span className="service-listing-card__number">0{index + 1}</span>
              </Link>
              <div className="service-listing-card__body">
                <span className="eyebrow">{service.category}</span>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <Link className="text-link-new" href={service.href}>Explore service <ArrowUpRight size={17} /></Link>
              </div>
            </article>
          ))}
        </section>
        <aside className="service-listing-sidebar"><StickyBookingCard /></aside>
      </div>

      <section className="service-listing-bottom">
        <span className="eyebrow">A MORE THOUGHTFUL WAY TO TRAVEL</span>
        <h2>Tell us where you need to go.</h2>
        <p>Choose your service and continue to the booking form to share your trip details.</p>
        <Link className="button button--dark" href="/#booking">Start a booking <ArrowRight size={18} /></Link>
      </section>
      <SiteFooter />
    </main>
  );
}
