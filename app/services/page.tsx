import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import StickyBookingCard from "@/components/StickyBookingCard";
import Footer from "@/components/home/Footer";

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

const buttonBlue =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[28px] border border-site-blue bg-site-blue px-[19px] py-[13px] text-[15px] font-semibold !text-white no-underline transition-transform hover:-translate-y-px hover:bg-[#0068df]";
const buttonDark =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[28px] border border-[#1b1c1e] bg-[#1b1c1e] px-[19px] py-[13px] text-[15px] font-semibold !text-white no-underline transition-transform hover:-translate-y-px hover:bg-[#333]";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-site-cream text-site-ink">
      <TransparentHeader />

      <section className="mx-auto max-w-[850px] px-6 pb-[62px] pt-[72px] text-center max-[800px]:pt-[58px] max-[560px]:px-5 max-[560px]:pb-[38px] max-[560px]:pt-11">
        <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
          OUR SERVICES
        </span>
        <h1 className="mb-[18px] mt-3.5 font-serif text-[clamp(44px,6vw,76px)] font-normal leading-[1.05] tracking-[-1.8px] max-[560px]:text-[clamp(39px,11vw,52px)] max-[560px]:tracking-[-1px]">
          Every journey,
          <br />
          considered.
        </h1>
        <p className="mx-auto mb-[25px] mt-0 max-w-[650px] text-lg leading-[1.75] text-[#62615e] max-[560px]:text-[17px]">
          From airport pickups to longer journeys between cities, find a ride that fits your plans.
        </p>
        <Link className={buttonBlue} href="/#booking">
          Plan your journey <ArrowRight size={18} />
        </Link>
      </section>

      <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_300px] items-start gap-[34px] px-7 pb-[76px] max-[1050px]:grid-cols-[minmax(0,1fr)_270px] max-[1050px]:gap-[22px] max-[800px]:grid-cols-1 max-[560px]:px-[18px] max-[560px]:pb-[55px]">
        <section
          className="grid grid-cols-2 gap-x-[25px] gap-y-10 max-[560px]:grid-cols-1 max-[560px]:gap-[34px]"
          aria-label="Available services"
        >
          {services.map((service, index) => (
            <article key={service.href} className="min-w-0">
              <Link
                href={service.href}
                aria-label={`Explore ${service.title}`}
                className="group relative block aspect-[1.45/1] overflow-hidden rounded-[7px] bg-[#e7e2d9] max-[560px]:aspect-[1.4/1]"
              >
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                  className="block h-full w-full object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.035]"
                />
                <span className="absolute bottom-3 left-3 rounded-[20px] bg-black/45 px-[9px] py-[5px] text-xs text-white">
                  0{index + 1}
                </span>
              </Link>
              <div className="pt-[18px] px-2 max-[560px]:px-[3px] max-[560px]:pt-[15px]">
                <span className="inline-block text-[11px] font-[650] uppercase leading-[1.5] tracking-[1.1px] text-site-muted">
                  {service.category}
                </span>
                <h2 className="mb-2 mt-2 text-[clamp(21px,2vw,27px)] font-medium leading-[1.25] tracking-[-0.55px] max-[560px]:text-[25px]">
                  {service.title}
                </h2>
                <p className="m-0 text-[15px] leading-[1.7] text-[#4e4d4a] max-[560px]:text-base max-[560px]:leading-[1.75]">
                  {service.description}
                </p>
                <Link
                  className="mt-[17px] inline-flex items-center gap-[7px] text-[15px] font-semibold text-[#006cf0] no-underline hover:underline"
                  href={service.href}
                >
                  Explore service <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </section>

        <aside className="sticky top-[108px] max-[800px]:hidden">
          <StickyBookingCard />
        </aside>
      </div>

      <section className="bg-[#f0ece4] px-6 pb-[72px] pt-[65px] text-center max-[560px]:px-5 max-[560px]:pb-14 max-[560px]:pt-12">
        <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
          A MORE THOUGHTFUL WAY TO TRAVEL
        </span>
        <h2 className="mb-3 mt-3 font-serif text-[clamp(32px,4vw,48px)] font-normal leading-[1.15]">
          Tell us where you need to go.
        </h2>
        <p className="mx-auto mb-[22px] mt-0 max-w-[600px] text-[17px] leading-[1.7] text-[#64615c] max-[560px]:text-base">
          Choose your service and continue to the booking form to share your trip details.
        </p>
        <Link className={buttonDark} href="/#booking">
          Start a booking <ArrowRight size={18} />
        </Link>
      </section>

      <Footer />
    </main>
  );
}