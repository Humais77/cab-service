"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

const services = [
  {
    category: "Airport transfers",
    title: "Smooth landings, every time.",
    description:
      "Delayed flight? Chauffeurs track arrivals and adjust accordingly. Plus, you have 1 hour of complimentary wait time just in case.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=90",
    alt: "Airport and air travel",
    link: "#booking",
  },
  {
    category: "Hourly and full day hire",
    title: "Seize the day.",
    description:
      "Reserve a dedicated chauffeur from 2 to 24 hours. They'll be on standby as long as you need them.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=90",
    alt: "Comfortable car ready for your journey",
    link: "#booking",
  },
  {
    category: "Business travel",
    title: "Make every meeting count.",
    description:
      "Travel between meetings in comfort with dependable transportation for your business schedule.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=90",
    alt: "Modern professional workspace",
    link: "#booking",
  },
  {
    category: "Family and group travel",
    title: "Room for everyone.",
    description:
      "Enjoy convenient journeys with family and friends. Choose a suitable vehicle for your passengers and luggage.",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=90",
    alt: "Vehicle for comfortable group travel",
    link: "#booking",
  },
];

export default function ServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleServices = [
    services[activeIndex],
    services[(activeIndex + 1) % services.length],
  ];

  const previousSlide = () => {
    setActiveIndex((c) => (c - 1 + services.length) % services.length);
  };

  const nextSlide = () => {
    setActiveIndex((c) => (c + 1) % services.length);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#faf7f1] px-6 pt-[78px] pb-[42px] text-[#17191d] max-[900px]:px-6 max-[900px]:pt-16 max-[900px]:pb-9 max-[600px]:px-5 max-[600px]:pt-12 max-[600px]:pb-[30px] max-[360px]:px-4"
      id="journey-services"
    >
      <div className="mx-auto w-full max-w-[1060px] max-[900px]:max-w-[720px] max-[600px]:max-w-[480px]">
        {/* Section heading */}
        <header className="mx-auto mb-16 text-center max-[900px]:mb-[42px] max-[600px]:mb-[30px]">
          <h2 className="m-0 font-serif text-[clamp(38px,4vw,48px)] font-normal leading-[1.2] tracking-[-1px] text-[#777571] max-[600px]:text-[clamp(34px,8vw,42px)] max-[600px]:tracking-[-0.6px] max-[360px]:text-[32px]">
            Arrive at your best.
          </h2>
          <p className="mt-2.5 mb-0 text-[15px] font-normal leading-[1.6] text-[#777571] max-[600px]:mx-auto max-[600px]:mt-2.5 max-[600px]:max-w-[310px] max-[600px]:text-base">
            Effortless journeys, tailored to you.
          </p>
        </header>

        {/* Service cards */}
        <div className="grid grid-cols-2 items-start gap-[26px] max-[900px]:gap-[22px] max-[600px]:grid-cols-1 max-[600px]:gap-[34px]">
          {visibleServices.map((service) => (
            <article
              className="flex min-w-0 flex-col"
              key={service.category}
            >
              <a
                href={service.link}
                aria-label={`Learn more about ${service.category}`}
                className="group block aspect-[1.95/1] w-full overflow-hidden rounded-md bg-[#e7e2d9] max-[900px]:aspect-[1.5/1] max-[600px]:aspect-[1.45/1] max-[600px]:rounded-lg"
              >
                <img
                  className="block h-full w-full object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                />
              </a>

              <div className="pt-[18px] px-[9px] pb-0 max-[900px]:pt-4 max-[900px]:px-1 max-[600px]:px-0.5 max-[600px]:pt-4">
                <span className="mb-1.5 block text-[13px] font-medium leading-[1.5] text-[#777777] max-[600px]:mb-2 max-[600px]:text-[15px]">
                  {service.category}
                </span>

                <h3 className="mb-[5px] text-[23px] font-medium leading-[1.35] tracking-[-0.35px] text-[#17191d] font-sans max-[900px]:text-[21px] max-[600px]:mb-[9px] max-[600px]:text-[25px] max-[600px]:tracking-[-0.3px] max-[360px]:text-[23px]">
                  {service.title}
                </h3>

                <p className="m-0 max-w-[510px] text-[15px] font-normal leading-[1.6] text-[#292a2d] max-[900px]:text-base max-[900px]:leading-[1.65] max-[600px]:text-[17px] max-[600px]:leading-[1.75] max-[360px]:text-base">
                  {service.description}
                </p>

                <a
                  href={service.link}
                  className="mt-[17px] inline-flex min-h-[42px] items-center justify-center gap-[7px] rounded-3xl border border-[#0878f9] bg-transparent px-[15px] py-2 text-sm font-medium leading-[1.3] text-[#006cf0] transition-colors hover:bg-[#0878f9] hover:text-white focus-visible:outline-3 focus-visible:outline-[#005fcc] focus-visible:outline-offset-4 motion-reduce:transition-none max-[600px]:min-h-12 max-[600px]:mt-[17px] max-[600px]:px-[19px] max-[600px]:py-[11px] max-[600px]:text-base max-[600px]:gap-2"
                >
                  Learn more
                  <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="mx-auto mt-[30px] flex min-h-12 w-fit items-center justify-center gap-3 rounded-[28px] border border-[#e9e4db] bg-white/65 px-[9px] py-[5px] shadow-[0_2px_9px_rgba(0,0,0,0.07)] max-[600px]:mt-[30px] max-[600px]:gap-3.5 max-[600px]:min-h-[52px] max-[600px]:px-2.5 max-[600px]:py-1.5">
          <button
            type="button"
            aria-label="Previous services"
            onClick={previousSlide}
            className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#e9e5de] bg-white p-0 text-[#292929] transition-colors hover:border-[#0878f9] hover:bg-[#0878f9] hover:text-white focus-visible:outline-3 focus-visible:outline-[#005fcc] focus-visible:outline-offset-4 motion-reduce:transition-none max-[600px]:h-[38px] max-[600px]:w-[38px]"
          >
            <ChevronLeft size={21} />
          </button>

          <div
            className="flex items-center justify-center gap-[7px]"
            aria-label={`Service group ${activeIndex + 1} of ${services.length}`}
          >
            {services.map((service, index) => (
              <button
                key={service.category}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show services starting with ${service.category}`}
                aria-pressed={activeIndex === index}
                className={[
                  "h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-[180ms] motion-reduce:transition-none",
                  "focus-visible:outline-3 focus-visible:outline-[#005fcc] focus-visible:outline-offset-4",
                  "max-[600px]:h-[9px]",
                  activeIndex === index
                    ? "w-5 bg-[#0878f9] max-[600px]:w-[23px]"
                    : "w-2 bg-[#c9c5bd] max-[600px]:w-[9px]",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next services"
            onClick={nextSlide}
            className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#e9e5de] bg-white p-0 text-[#292929] transition-colors hover:border-[#0878f9] hover:bg-[#0878f9] hover:text-white focus-visible:outline-3 focus-visible:outline-[#005fcc] focus-visible:outline-offset-4 motion-reduce:transition-none max-[600px]:h-[38px] max-[600px]:w-[38px]"
          >
            <ChevronRight size={21} />
          </button>
        </div>
      </div>
    </section>
  );
}