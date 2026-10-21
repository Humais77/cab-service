
"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Headphones,
  MapPin,
  Menu,
  Phone,
  Plane,
  ShieldCheck,
  Star,
  Users,
  X,
  Baby,
  Accessibility,
  BriefcaseBusiness,
  Navigation,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    text: "Enjoy stress-free airport pickups and drop-offs with professional drivers and on-time service.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: CarFront,
    title: "General Transfers",
    text: "Comfortable, convenient rides for daily travel, family outings and special occasions.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate Transfers",
    text: "Professional transportation for business meetings, events and executive travel.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: Users,
    title: "Maxi Cab Service",
    text: "Extra room for groups, luggage, family trips and comfortable journeys together.",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Safe & Reliable",
    text: "Professional service with passenger comfort and safety in mind.",
  },
  {
    icon: Clock3,
    title: "Always On Time",
    text: "Thoughtful scheduling to make every journey smoother.",
  },
  {
    icon: CarFront,
    title: "Comfortable Vehicles",
    text: "Travel in clean, spacious and well-maintained vehicles.",
  },
  {
    icon: Headphones,
    title: "Friendly Support",
    text: "Helpful assistance for your travel and booking enquiries.",
  },
];

const faqs = [
  {
    q: "Can I book a cab in advance?",
    a: "Yes. This demo supports selecting your preferred pickup date and time. Advance booking requests can be connected to a booking system in the backend phase.",
  },
  {
    q: "Do you offer airport transfers?",
    a: "Yes, airport transfers are one of the featured services. Add your actual airport coverage, pickup instructions and pricing before launching the live website.",
  },
  {
    q: "Can I book a vehicle for a group?",
    a: "Yes. Choose the appropriate vehicle and passenger count in the booking form. Vehicle availability will need to be connected to your real fleet later.",
  },
  {
    q: "Are child seats or wheelchair-accessible vehicles available?",
    a: "The demo includes options for child seats and wheelchair-accessible transport. Actual availability should be confirmed with the operating team.",
  },
  {
    q: "How do I receive my booking confirmation?",
    a: "This frontend demo displays a local confirmation message. A live version can send confirmation emails or messages after the booking backend is implemented.",
  },
];

const reviews = [
  {
    name: "Alex Morgan",
    location: "Airport Transfer",
    quote:
      "A comfortable ride, a courteous driver and a smooth journey from pickup to destination.",
  },
  {
    name: "Sarah Williams",
    location: "Family Travel",
    quote:
      "Booking was straightforward, and the spacious vehicle made travelling with family easier.",
  },
  {
    name: "Daniel Brooks",
    location: "Corporate Travel",
    quote:
      "Professional service and a comfortable travel experience. Exactly what business travel needs.",
  },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" className={`brand ${light ? "brand-light" : ""}`}>
      <span className="brand-mark">S</span>
      <span className="brand-copy">
        <strong>Cab Service</strong>
        <small>YOUR JOURNEY, OUR PRIORITY</small>
      </span>
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className={`section-heading ${light ? "heading-light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tripType, setTripType] = useState("One Way");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [notice, setNotice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setNotice(
      "Demo request completed! No booking was sent or saved. Connect the backend to enable real bookings."
    );
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="home">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>
            <Clock3 size={14} /> Available for your next journey
          </span>
          <a href="tel:+61000000000">
            <Phone size={14} /> Call our team
          </a>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-inner">
          <Brand />

          <button
            className="mobile-menu-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={`navigation ${menuOpen ? "navigation-open" : ""}`}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#services" onClick={closeMenu}>Our Services</a>
            <a href="#why-us" onClick={closeMenu}>Why Choose Us</a>
            <a href="#faq" onClick={closeMenu}>FAQs</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <a className="nav-book" href="#booking" onClick={closeMenu}>
              Book a Cab <ArrowUpRight size={16} />
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-image" />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="hero-kicker">
              <span className="live-dot" /> YOUR RIDE, YOUR WAY
            </span>
            <h1>
              Every Journey.
              <br />
              <span>Elevated.</span>
            </h1>
            <p>
              Reliable cab services for airport transfers, business travel
              and everything in between. Sit back and enjoy the journey.
            </p>
            <div className="hero-actions">
              <a href="#booking" className="button button-primary">
                Book Your Ride <ArrowRight size={17} />
              </a>
              <a href="#services" className="button button-outline">
                Explore Services
              </a>
            </div>
            <div className="hero-trust">
              <div className="avatar-stack">
                <span>J</span><span>M</span><span>A</span><span>+</span>
              </div>
              <div>
                <div className="trust-stars">★★★★★</div>
                <small>Your comfort comes first</small>
              </div>
            </div>
          </div>
          <div className="hero-side-note">
            <span className="hero-side-line" />
            <span>COMFORT · SAFETY · RELIABILITY</span>
          </div>
        </div>
        <a className="scroll-cue" href="#booking" aria-label="Scroll to booking">
          <ArrowDown size={18} />
        </a>
      </section>

      <section className="booking-section" id="booking">
        <div className="container">
          <div className="booking-card">
            <div className="booking-intro">
              <span className="eyebrow">LET&apos;S GET YOU THERE</span>
              <h2>Book Your Cab</h2>
              <p>Plan your next journey in just a few simple steps.</p>
              <div className="booking-promise">
                <Check size={16} /> Quick &amp; easy booking
              </div>
              <div className="booking-promise">
                <Check size={16} /> Comfortable rides
              </div>
              <div className="booking-promise">
                <Check size={16} /> Friendly service
              </div>
            </div>

            <form className="booking-form" onSubmit={handleBooking}>
              <div className="trip-tabs">
                {["One Way", "Return"].map((type) => (
                  <button
                    type="button"
                    key={type}
                    className={tripType === type ? "trip-tab active" : "trip-tab"}
                    onClick={() => setTripType(type)}
                  >
                    {type === "One Way" ? <Navigation size={15} /> : <ArrowRight size={15} />}
                    {type}
                  </button>
                ))}
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Pickup Location *</span>
                  <span className="input-wrap">
                    <MapPin size={17} />
                    <input required placeholder="Enter pickup address" />
                  </span>
                </label>
                <label className="field">
                  <span>Destination *</span>
                  <span className="input-wrap">
                    <MapPin size={17} />
                    <input required placeholder="Where are you going?" />
                  </span>
                </label>
                <label className="field">
                  <span>Pickup Date *</span>
                  <span className="input-wrap">
                    <CalendarDays size={17} />
                    <input type="date" required />
                  </span>
                </label>
                <label className="field">
                  <span>Pickup Time *</span>
                  <span className="input-wrap">
                    <Clock3 size={17} />
                    <input type="time" required />
                  </span>
                </label>

                {tripType === "Return" && (
                  <>
                    <label className="field">
                      <span>Return Date *</span>
                      <span className="input-wrap">
                        <CalendarDays size={17} />
                        <input type="date" required />
                      </span>
                    </label>
                    <label className="field">
                      <span>Return Time *</span>
                      <span className="input-wrap">
                        <Clock3 size={17} />
                        <input type="time" required />
                      </span>
                    </label>
                  </>
                )}

                <label className="field">
                  <span>Vehicle *</span>
                  <span className="input-wrap">
                    <CarFront size={17} />
                    <select defaultValue="" required>
                      <option value="" disabled>Select a vehicle</option>
                      <option>Standard Sedan</option>
                      <option>Premium Sedan</option>
                      <option>Maxi Cab</option>
                      <option>Accessible Vehicle</option>
                    </select>
                    <ChevronDown size={15} className="select-arrow" />
                  </span>
                </label>
                <label className="field">
                  <span>Passengers *</span>
                  <span className="input-wrap">
                    <Users size={17} />
                    <select defaultValue="1" required>
                      {Array.from({ length: 13 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "Passenger" : "Passengers"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="select-arrow" />
                  </span>
                </label>
                <label className="field">
                  <span>Full Name *</span>
                  <input required placeholder="Your name" />
                </label>
                <label className="field">
                  <span>Email Address *</span>
                  <input type="email" required placeholder="you@example.com" />
                </label>
                <label className="field">
                  <span>Phone Number *</span>
                  <input type="tel" required placeholder="Your phone number" />
                </label>
                <label className="field">
                  <span>Service Type</span>
                  <span className="input-wrap">
                    <CarFront size={17} />
                    <select defaultValue="General Transfer">
                      <option>General Transfer</option>
                      <option>Airport Transfer</option>
                      <option>Corporate Transfer</option>
                      <option>Family Travel</option>
                    </select>
                    <ChevronDown size={15} className="select-arrow" />
                  </span>
                </label>
              </div>

              <button className="button button-primary submit-booking" type="submit">
                Request a Booking <ArrowRight size={17} />
              </button>

              {notice && (
                <div className="form-notice" role="status">
                  {notice}
                </div>
              )}
              {submitted && (
                <button
                  className="reset-demo"
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setNotice("");
                  }}
                >
                  Dismiss demo confirmation
                </button>
              )}
              <p className="demo-note">
                Demo only — no personal details are transmitted or stored.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="container about-grid">
          <div className="about-visual">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1100&q=90"
              alt="Premium car ready for a comfortable journey"
            />
            <div className="experience-card">
              <Sparkles size={23} />
              <strong>Travel in comfort</strong>
              <span>Every mile matters.</span>
            </div>
            <div className="image-caption">
              <span>01 /</span> YOUR JOURNEY STARTS HERE
            </div>
          </div>

          <div className="about-copy">
            <SectionHeading
              eyebrow="WELCOME TO CAB SERVICE"
              title="A Better Way to Get Where You're Going"
              text="We believe every journey should feel effortless. From the moment you book to the moment you arrive, our focus is on comfort, convenience and dependable service."
            />
            <p className="body-copy">
              Whether you need an airport transfer, a family ride, a group
              vehicle or professional business transport, Cab Service makes
              planning your journey straightforward.
            </p>
            <div className="about-checks">
              <span><Check size={17} /> Easy booking experience</span>
              <span><Check size={17} /> Comfort-focused travel</span>
              <span><Check size={17} /> Service for different needs</span>
              <span><Check size={17} /> Professional approach</span>
            </div>
            <a href="#services" className="text-link">
              Discover our services <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="container feature-grid">
          <div>
            <span className="feature-number">01</span>
            <span className="feature-label">YOUR TIME</span>
            <strong>On-time pickups</strong>
          </div>
          <div>
            <span className="feature-number">02</span>
            <span className="feature-label">YOUR COMFORT</span>
            <strong>Relaxed travel</strong>
          </div>
          <div>
            <span className="feature-number">03</span>
            <span className="feature-label">YOUR JOURNEY</span>
            <strong>Flexible services</strong>
          </div>
          <div>
            <span className="feature-number">04</span>
            <span className="feature-label">YOUR PEACE OF MIND</span>
            <strong>Care at every step</strong>
          </div>
        </div>
      </section>

      <section className="services-section section-pad" id="services">
        <div className="container">
          <div className="section-row">
            <SectionHeading
              eyebrow="WHAT WE OFFER"
              title="Services for Every Journey"
              text="From everyday travel to special trips, find a ride that suits your plans."
            />
            <a href="#booking" className="button button-dark">
              Book a Cab <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article className="service-card" key={service.title}>
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                    <span className="service-number">0{index + 1}</span>
                  </div>
                  <div className="service-content">
                    <span className="service-icon"><Icon size={21} /></span>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <a href="#booking" className="service-link">
                      Book this service <ArrowRight size={16} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="special-services section-pad">
        <div className="container special-grid">
          <div className="special-copy">
            <SectionHeading
              eyebrow="TRAVEL THAT FITS YOU"
              title="Thoughtful Travel for Every Passenger"
              text="Different journeys call for different needs. Our service options make it easier to plan a comfortable trip for you and your passengers."
              light
            />
            <a href="#booking" className="button button-primary">
              Plan Your Journey <ArrowRight size={17} />
            </a>
          </div>
          <div className="special-list">
            <article>
              <span className="special-icon"><Plane size={23} /></span>
              <div>
                <h3>Airport Transfers</h3>
                <p>Plan pickups and drop-offs around your flight schedule.</p>
              </div>
              <ArrowUpRight size={19} />
            </article>
            <article>
              <span className="special-icon"><Baby size={23} /></span>
              <div>
                <h3>Family &amp; Baby Seats</h3>
                <p>Request child-seat options when arranging your journey.</p>
              </div>
              <ArrowUpRight size={19} />
            </article>
            <article>
              <span className="special-icon"><Accessibility size={23} /></span>
              <div>
                <h3>Accessible Transport</h3>
                <p>Request a vehicle suitable for your accessibility needs.</p>
              </div>
              <ArrowUpRight size={19} />
            </article>
            <article>
              <span className="special-icon"><BriefcaseBusiness size={23} /></span>
              <div>
                <h3>Business Travel</h3>
                <p>Professional transport for meetings and corporate events.</p>
              </div>
              <ArrowUpRight size={19} />
            </article>
          </div>
        </div>
      </section>

      <section className="why-section section-pad" id="why-us">
        <div className="container">
          <SectionHeading
            eyebrow="THE CAB SERVICE DIFFERENCE"
            title="Why Travel With Us?"
            text="The details matter. We focus on the little things that make every ride better."
          />
          <div className="benefits-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <article className="benefit-card" key={benefit.title}>
                  <div className="benefit-top">
                    <span className="benefit-icon"><Icon size={25} /></span>
                    <span>0{index + 1}</span>
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="testimonial-section section-pad">
        <div className="container testimonial-inner">
          <div className="testimonial-heading">
            <span className="eyebrow">THE EXPERIENCE MATTERS</span>
            <h2>Every Ride Should Leave You Smiling.</h2>
            <p>
              A great journey is about more than getting from A to B. It&apos;s
              about how you feel along the way.
            </p>
            <a href="#booking" className="text-link">
              Start your journey <ArrowRight size={17} />
            </a>
          </div>
          <div className="review-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="review-stars" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={15} fill="currentColor" />
                  ))}
                </div>
                <p>&ldquo;{review.quote}&rdquo;</p>
                <div className="review-author">
                  <span>{review.name.charAt(0)}</span>
                  <div>
                    <strong>{review.name}</strong>
                    <small>{review.location}</small>
                  </div>
                </div>
              </article>
            ))}
            <p className="review-disclaimer">
              Illustrative sample reviews for the design demo. Replace with
              genuine, authorized customer testimonials before launch.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section section-pad" id="faq">
        <div className="container faq-grid">
          <div className="faq-intro">
            <SectionHeading
              eyebrow="GOT QUESTIONS?"
              title="Frequently Asked Questions"
              text="Find answers to common questions about booking your next ride."
            />
            <div className="faq-help">
              <span className="faq-help-icon"><Headphones size={23} /></span>
              <div>
                <strong>Still need help?</strong>
                <p>Our team is here to help with your enquiry.</p>
                <a href="#contact">Contact us <ArrowRight size={14} /></a>
              </div>
            </div>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article
                className={`faq-item ${faqOpen === index ? "faq-active" : ""}`}
                key={faq.q}
              >
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={faqOpen === index}
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                >
                  <span><small>0{index + 1}</small>{faq.q}</span>
                  <ChevronDown size={19} />
                </button>
                {faqOpen === index && <p className="faq-answer">{faq.a}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" id="contact">
        <div className="cta-image" />
        <div className="cta-overlay" />
        <div className="container cta-inner">
          <div>
            <span className="eyebrow eyebrow-light">YOUR NEXT JOURNEY AWAITS</span>
            <h2>Ready to Ride?</h2>
            <p>Let&apos;s make your next journey a comfortable one.</p>
          </div>
          <a href="#booking" className="button button-primary">
            Book Your Cab <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <Brand light />
            <p>
              Thoughtful travel. Comfortable rides. Reliable service for
              wherever life takes you.
            </p>
            <a href="tel:+61000000000" className="footer-phone">
              <Phone size={17} /> Speak to our team
            </a>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#services">Our Services</a>
            <a href="#why-us">Why Choose Us</a>
            <a href="#faq">FAQs</a>
          </div>
          <div className="footer-column">
            <h3>Our Services</h3>
            <a href="#booking">Airport Transfers</a>
            <a href="#booking">General Transfers</a>
            <a href="#booking">Corporate Travel</a>
            <a href="#booking">Maxi Cab</a>
            <a href="#booking">Accessible Transport</a>
          </div>
          <div className="footer-column footer-contact">
            <h3>Get In Touch</h3>
            <p><Phone size={16} /> Add your business phone</p>
            <p><MapPin size={16} /> Add your service location</p>
            <p><Clock3 size={16} /> Add your operating hours</p>
            <a href="#booking" className="footer-book">
              Request a booking <ArrowRight size={16} />
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2026 Cab Service. All rights reserved.</p>
          <div>
            <a href="#contact">Privacy Policy</a>
            <a href="#contact">Terms &amp; Conditions</a>
          </div>
          <a href="#home" className="back-top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
