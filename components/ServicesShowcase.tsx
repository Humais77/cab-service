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
    setActiveIndex((current) =>
      (current - 1 + services.length) % services.length
    );
  };

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % services.length);
  };

  return (
    <section className="services-showcase" id="journey-services">
      <div className="showcase-container">
        {/* Section heading */}
        <header className="showcase-heading">
          <h2>Arrive at your best.</h2>

          <p>Effortless journeys, tailored to you.</p>
        </header>

        {/* Service cards */}
        <div className="showcase-grid">
          {visibleServices.map((service) => (
            <article
              className="showcase-card"
              key={service.category}
            >
              <a
                href={service.link}
                className="showcase-image-link"
                aria-label={`Learn more about ${service.category}`}
              >
                <img
                  className="showcase-image"
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                />
              </a>

              <div className="showcase-content">
                <span className="showcase-category">
                  {service.category}
                </span>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <a
                  href={service.link}
                  className="showcase-learn-more"
                >
                  Learn more
                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="showcase-controls">
          <button
            type="button"
            className="showcase-arrow"
            onClick={previousSlide}
            aria-label="Previous services"
          >
            <ChevronLeft size={21} />
          </button>

          <div
            className="showcase-pagination"
            aria-label={`Service group ${activeIndex + 1} of ${services.length}`}
          >
            {services.map((service, index) => (
              <button
                key={service.category}
                type="button"
                className={`showcase-dot ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show services starting with ${service.category}`}
                aria-pressed={activeIndex === index}
              />
            ))}
          </div>

          <button
            type="button"
            className="showcase-arrow"
            onClick={nextSlide}
            aria-label="Next services"
          >
            <ChevronRight size={21} />
          </button>
        </div>
      </div>
    </section>
  );
}