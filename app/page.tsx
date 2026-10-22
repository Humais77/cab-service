"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Headphones,
  MapPin,
  Phone,
  Star,
  Users,
  ShieldCheck,
  CarFront,
  Plane,
  BriefcaseBusiness,
  Baby,
  Accessibility,
  Sparkles,
} from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import ChauffeurHero from "@/components/ChauffeurHero";
import BookingBar from "@/components/BookingBar";
import ServicesShowcase from "@/components/ServicesShowcase";

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
    title: "Maxi Silver Cap Sydney",
    text: "Extra room for groups, luggage, family trips and comfortable journeys together.",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85",
  },
];

const benefits = [
  { icon: ShieldCheck, title: "Safe & Reliable", text: "Professional service with passenger comfort and safety in mind." },
  { icon: Clock3, title: "Always On Time", text: "Thoughtful scheduling to make every journey smoother." },
  { icon: CarFront, title: "Comfortable Vehicles", text: "Travel in clean, spacious and well-maintained vehicles." },
  { icon: Headphones, title: "Friendly Support", text: "Helpful assistance for your travel and booking enquiries." },
];

const faqs = [
  { q: "Can I book a cab in advance?", a: "Yes. This demo supports selecting your preferred pickup date and time. Advance booking requests can be connected to a booking system in the backend phase." },
  { q: "Do you offer airport transfers?", a: "Yes, airport transfers are one of the featured services. Add your actual airport coverage, pickup instructions and pricing before launching the live website." },
  { q: "Can I book a vehicle for a group?", a: "Yes. Choose the appropriate vehicle and passenger count in the booking form. Vehicle availability will need to be connected to your real fleet later." },
  { q: "Are child seats or wheelchair-accessible vehicles available?", a: "The demo includes options for child seats and wheelchair-accessible transport. Actual availability should be confirmed with the operating team." },
  { q: "How do I receive my booking confirmation?", a: "This frontend demo displays a local confirmation message. A live version can send confirmation emails or messages after the booking backend is implemented." },
];

const reviews = [
  { name: "Alex Morgan", location: "Airport Transfer", quote: "A comfortable ride, a courteous driver and a smooth journey from pickup to destination." },
  { name: "Sarah Williams", location: "Family Travel", quote: "Booking was straightforward, and the spacious vehicle made travelling with family easier." },
  { name: "Daniel Brooks", location: "Corporate Travel", quote: "Professional service and a comfortable travel experience. Exactly what business travel needs." },
];

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" className="inline-flex flex-shrink-0 items-center gap-3">
      <span className="grid h-[45px] w-[45px] place-items-center rounded-[3px] bg-accent font-serif text-[30px] font-bold italic leading-none text-navy max-[780px]:h-10 max-[780px]:w-10 max-[780px]:text-[26px]">
        S
      </span>
      <span className="flex flex-col leading-[1.4]">
        <strong className={`text-[20px] font-[750] tracking-[-0.7px] max-[1080px]:text-lg max-[780px]:text-[18px] ${light ? "text-white" : "text-ink"}`}>
          Silver Cap Sydney
        </strong>
        <small className={`mt-[3px] text-[8px] font-bold tracking-[1.5px] max-[780px]:text-[10px] ${light ? "text-[#a3adbd]" : "text-[#818795]"}`}>
          YOUR JOURNEY, OUR PRIORITY
        </small>
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
    <div>
      <span className="inline-flex items-center gap-2.5 text-[11px] font-extrabold tracking-[2px] text-[#a27f49] max-[480px]:text-[12px]">
        {eyebrow}
      </span>
      <h2
        className={`m-0 mt-3.5 mb-4 font-serif text-[clamp(32px,3.5vw,46px)] font-normal leading-[1.22] tracking-[-0.8px] max-[480px]:text-[36px] ${light ? "text-white" : "text-navy"}`}
      >
        {title}
      </h2>
      {text && (
        <p className={`m-0 text-[14px] leading-[1.9] max-[480px]:text-[15px] ${light ? "text-[#bbc4d2]" : "text-muted"}`}>
          {text}
        </p>
      )}
    </div>
  );
}

const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-[2px] border px-[19px] py-[13px] text-sm font-[750] transition-transform hover:-translate-y-0.5 max-[480px]:min-h-[52px] max-[480px]:px-[22px] max-[480px]:text-[15px]";
const buttonPrimary =
  "border-transparent bg-accent text-navy-deep hover:bg-accent-light";
const buttonDark =
  "border-transparent bg-navy text-white hover:bg-[#293954]";
const buttonOutline =
  "border-white/40 bg-white/[0.03] text-white hover:border-accent hover:bg-white/10";

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <main id="home">
      <TransparentHeader />
      <ChauffeurHero />
      <BookingBar />
      <ServicesShowcase />

      {/* About */}
      <section className="bg-white px-0 pt-[30px] pb-[70px] md:pb-[95px]" id="about">
        <div className="container-cab grid grid-cols-1 items-center gap-[42px] lg:grid-cols-[1fr_0.9fr] lg:gap-[85px]">
          <div className="relative max-w-[570px] pr-[35px] pb-[38px] pl-0 max-[480px]:pr-[17px] max-[480px]:pb-[33px]">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1100&q=90"
              alt="Premium car ready for a comfortable journey"
              className="h-[455px] w-full object-cover object-center max-[780px]:h-[400px] max-[480px]:h-[320px]"
            />
            <div className="absolute bottom-[75px] right-0 flex w-[200px] flex-col gap-[5px] bg-navy p-[23px] text-white shadow-[0_12px_30px_rgba(8,15,30,0.18)] max-[480px]:w-[165px] max-[480px]:bottom-[61px] max-[480px]:p-[15px]">
              <Sparkles size={23} className="mb-2 text-accent" />
              <strong className="text-sm max-[480px]:text-[15px]">Travel in comfort</strong>
              <span className="text-[11px] text-[#c4cbd5] max-[480px]:text-[13px]">Every mile matters.</span>
            </div>
            <div className="absolute bottom-1 left-0 flex gap-3 text-[9px] tracking-[1.6px] text-[#757e8c] max-[480px]:text-[11px]">
              <span className="text-[#ad8850]">01 /</span> YOUR JOURNEY STARTS HERE
            </div>
          </div>

          <div className="max-w-[650px]">
            <SectionHeading
              eyebrow="WELCOME TO Silver Cap Sydney"
              title="A Better Way to Get Where You're Going"
              text="We believe every journey should feel effortless. From the moment you book to the moment you arrive, our focus is on comfort, convenience and dependable service."
            />
            <p className="mt-5 text-[14px] leading-[1.9] text-muted max-[480px]:text-[15px]">
              Whether you need an airport transfer, a family ride, a group
              vehicle or professional business transport, Silver Cap Sydney makes
              planning your journey straightforward.
            </p>
            <div className="my-6 grid grid-cols-2 gap-[15px] max-[480px]:grid-cols-1 max-[480px]:gap-3.5">
              {["Easy booking experience", "Comfort-focused travel", "Service for different needs", "Professional approach"].map((t) => (
                <span key={t} className="flex items-start gap-2 text-[12px] font-[650] text-[#3b4555] max-[480px]:text-[14px]">
                  <Check size={17} className="shrink-0 text-[#9c7845]" /> {t}
                </span>
              ))}
            </div>
            <a href="#services" className="group inline-flex items-center gap-2.5 border-b border-accent pb-1.5 text-[13px] font-[750] text-navy max-[480px]:text-[15px]">
              Discover our services{" "}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Feature strip — cream background */}
      <section className="bg-[#faf7f1] text-ink">
        <div className="container-cab grid grid-cols-4 py-[35px] max-[780px]:grid-cols-2 max-[780px]:gap-y-7">
          {[
            { n: "01", l: "YOUR TIME", v: "On-time pickups" },
            { n: "02", l: "YOUR COMFORT", v: "Relaxed travel" },
            { n: "03", l: "YOUR JOURNEY", v: "Flexible services" },
            { n: "04", l: "YOUR PEACE OF MIND", v: "Care at every step" },
          ].map((f, i) => (
            <div
              key={f.n}
              className={[
                "flex flex-col gap-1.5 px-[27px]",
                i < 3 ? "border-r border-[#e7e1d8]" : "border-r-0",
                "max-[780px]:px-[18px] max-[480px]:px-[14px]",
                i === 0 ? "pl-0" : "",
                i === 3 ? "pr-0" : "",
                "max-[780px]:[&:nth-child(2)]:border-r-0",
                "max-[780px]:[&:nth-child(3)]:pl-0",
              ].join(" ")}
            >
              <span className="font-serif text-[23px] text-[#a27f49] max-[480px]:text-[26px]">{f.n}</span>
              <span className="text-[9px] tracking-[1.3px] text-[#8b8578] max-[480px]:text-[11px] max-[480px]:tracking-[0.8px]">{f.l}</span>
              <strong className="text-[13px] font-semibold max-[480px]:text-[15px]">{f.v}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-[#f8f9fb] py-[57px] md:py-[95px]" id="services">
        <div className="container-cab">
          <div className="mb-[38px] flex flex-col items-start justify-between gap-4 max-[780px]:items-start lg:flex-row lg:items-end">
            <div className="max-w-[570px]">
              <SectionHeading
                eyebrow="WHAT WE OFFER"
                title="Services for Every Journey"
                text="From everyday travel to special trips, find a ride that suits your plans."
              />
            </div>
            <a href="#booking" className={`${buttonBase} ${buttonDark} shrink-0 mb-1.5`}>
              Book a Cab <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="group overflow-hidden rounded-none border border-[#e8eaf0] bg-white transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[5px] hover:shadow-[0_15px_35px_rgba(18,29,50,0.09)]"
                >
                  <div className="relative h-[225px] overflow-hidden bg-[#e4e7ed] md:h-[230px] lg:h-[195px] max-[480px]:h-[225px]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-[450ms] group-hover:scale-[1.055]"
                    />
                    <span className="absolute left-3 top-3 bg-[#0c1527]/80 px-[9px] py-[5px] text-[11px] tracking-[1px] text-white">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="relative px-[19px] pt-[23px] pb-5">
                    <span className="relative -mt-[44px] mb-[17px] box-content grid h-[42px] w-[42px] place-items-center border-4 border-white bg-accent text-navy">
                      <Icon size={21} />
                    </span>
                    <h3 className="mb-2.5 mt-0 font-serif text-[20px] font-normal leading-[1.4] text-navy max-[480px]:text-[22px]">
                      {service.title}
                    </h3>
                    <p className="m-0 min-h-[80px] text-[13px] leading-[1.8] text-muted max-[1080px]:min-h-0 max-[480px]:text-[15px]">
                      {service.text}
                    </p>
                    <a href="#booking" className="mt-[18px] inline-flex items-center gap-2 text-[12px] font-[750] text-[#8b6a3c] max-[480px]:text-[14px]">
                      Book this service <ArrowRight size={16} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Special services — cream background */}
      <section className="relative overflow-hidden bg-[#faf7f1] text-ink px-0 py-[57px] md:py-[95px]">
        <div className="container-cab grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[95px]">
          <div>
            <SectionHeading
              eyebrow="TRAVEL THAT FITS YOU"
              title="Thoughtful Travel for Every Passenger"
              text="Different journeys call for different needs. Our service options make it easier to plan a comfortable trip for you and your passengers."
            />
            <a href="#booking" className={`${buttonBase} ${buttonPrimary} mt-6`}>
              Plan Your Journey <ArrowRight size={17} />
            </a>
          </div>
          <div className="border-t border-[#e7e1d8]">
            {[
              { icon: Plane, title: "Airport Transfers", text: "Plan pickups and drop-offs around your flight schedule." },
              { icon: Baby, title: "Family & Baby Seats", text: "Request child-seat options when arranging your journey." },
              { icon: Accessibility, title: "Accessible Transport", text: "Request a vehicle suitable for your accessibility needs." },
              { icon: BriefcaseBusiness, title: "Business Travel", text: "Professional transport for meetings and corporate events." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="grid grid-cols-[55px_1fr_20px] items-center gap-[18px] border-b border-[#e7e1d8] py-[23px] max-[480px]:grid-cols-[43px_1fr_17px] max-[480px]:gap-3"
                >
                  <span className="grid h-[51px] w-[51px] place-items-center border border-[#d8b477]/40 bg-[#f0e6d3] text-[#8b6a3c] max-[480px]:h-[41px] max-[480px]:w-[41px]">
                    <Icon size={23} />
                  </span>
                  <div>
                    <h3 className="mb-1 mt-0 font-serif text-[19px] font-normal text-ink max-[480px]:text-[21px]">{item.title}</h3>
                    <p className="m-0 text-[13px] leading-[1.8] text-[#777571] max-[480px]:text-[15px]">{item.text}</p>
                  </div>
                  <ArrowUpRight size={19} className="text-[#a27f49]" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-white py-[57px] md:py-[95px]" id="why-us">
        <div className="container-cab">
          <div className="mx-auto mb-[42px] max-w-[630px] text-center">
            <SectionHeading
              eyebrow="THE Silver Cap Sydney DIFFERENCE"
              title="Why Travel With Us?"
              text="The details matter. We focus on the little things that make every ride better."
            />
          </div>
          <div className="grid grid-cols-1 border border-line sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className={[
                    "p-[27px] px-[23px] pb-[29px] transition-colors hover:bg-[#faf7f1]",
                    "border-line",
                    "max-[780px]:border-b",
                    "sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0 sm:[&:nth-child(n)]:border-r-0",
                    index < 3 ? "lg:border-r" : "lg:border-r-0",
                    index < 2 ? "sm:border-b" : "sm:border-b-0",
                    "max-[480px]:p-[22px] max-[480px]:px-[18px]",
                  ].join(" ")}
                >
                  <div className="mb-[26px] flex items-center justify-between">
                    <span className="grid h-[50px] w-[50px] place-items-center bg-[#f8f0e2] text-[#8b6a3c]">
                      <Icon size={25} />
                    </span>
                    <span className="font-serif text-[17px] text-[#a5abb5]">0{index + 1}</span>
                  </div>
                  <h3 className="mb-2.5 mt-0 font-serif text-[19px] font-normal text-navy max-[480px]:text-[21px]">{benefit.title}</h3>
                  <p className="m-0 text-[13px] leading-[1.8] text-muted max-[480px]:text-[15px]">{benefit.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials — cream background */}
      <section className="bg-[#faf7f1] py-[57px] md:py-[95px]">
        <div className="container-cab grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-[75px]">
          <div className="lg:sticky lg:top-[120px]">
            <SectionHeading
              eyebrow="THE EXPERIENCE MATTERS"
              title="Every Ride Should Leave You Smiling."
              text="A great journey is about more than getting from A to B. It's about how you feel along the way."
            />
            <a href="#booking" className="group mt-6 inline-flex items-center gap-2.5 border-b border-accent pb-1.5 text-[13px] font-[750] text-navy max-[480px]:text-[15px]">
              Start your journey <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-[17px] sm:grid-cols-2 max-[480px]:grid-cols-1">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="flex min-h-[230px] flex-col border border-line bg-white p-[23px] max-[480px]:p-[22px]"
              >
                <div className="flex gap-[3px] text-[#b58b4d]" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={17} fill="currentColor" />
                  ))}
                </div>
                <p className="mb-6 mt-[19px] flex-1 font-serif text-[15px] leading-[1.85] text-[#616b7a] max-[480px]:text-[16px]">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center gap-[11px]">
                  <span className="grid h-[37px] w-[37px] place-items-center rounded-full bg-[#f1e6d4] font-serif text-[17px] text-navy">
                    {review.name.charAt(0)}
                  </span>
                  <div className="flex flex-col">
                    <strong className="text-[13px] text-navy max-[480px]:text-[14px]">{review.name}</strong>
                    <small className="text-[11px] text-[#9097a3] max-[480px]:text-[12px]">{review.location}</small>
                  </div>
                </div>
              </article>
            ))}
            <p className="col-span-full m-0 text-[11px] leading-[1.7] text-[#858c97] max-[480px]:col-span-1 max-[480px]:text-[12px]">
              Illustrative sample reviews for the design demo. Replace with
              genuine, authorized customer testimonials before launch.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-[57px] md:py-[95px]" id="faq">
        <div className="container-cab grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-[90px]">
          <div>
            <SectionHeading
              eyebrow="GOT QUESTIONS?"
              title="Frequently Asked Questions"
              text="Find answers to common questions about booking your next ride."
            />
            <div className="mt-[33px] flex items-start gap-4 border border-line bg-[#f7f8fa] p-[21px]">
              <span className="grid h-[43px] w-[43px] shrink-0 place-items-center bg-[#f2e7d5] text-[#8c6b3d]">
                <Headphones size={23} />
              </span>
              <div>
                <strong className="text-[14px] text-navy">Still need help?</strong>
                <p className="mb-2.5 mt-1 text-[13px] text-muted max-[480px]:text-[14px]">Our team is here to help with your enquiry.</p>
                <a href="#contact" className="inline-flex items-center gap-[7px] text-[13px] font-[750] text-[#906b36] max-[480px]:text-[14px]">
                  Contact us <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-line">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <article key={faq.q} className="border-b border-line">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-[18px] border-0 bg-transparent py-[22px] text-left text-[14px] font-[650] text-navy max-[480px]:text-[16px]"
                    aria-expanded={isOpen}
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                  >
                    <span className="flex items-start gap-[17px]">
                      <small className="font-serif text-[15px] text-[#a2824f]">0{index + 1}</small>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={19}
                      className={`shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-[#a17a43]" : "text-[#8c95a3]"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mx-[25px] mb-[23px] mt-[-2px] ml-[35px] text-[13px] leading-[1.9] text-muted max-[480px]:text-[15px]">
                      {faq.a}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — cream background */}
      <section className="relative overflow-hidden bg-[#faf7f1] text-ink" id="contact">
        <div className="container-cab relative z-[1] flex flex-col items-start justify-between gap-[30px] py-12 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2.5 text-[11px] font-extrabold tracking-[2px] text-[#a27f49] max-[480px]:text-[12px]">
              YOUR NEXT JOURNEY AWAITS
            </span>
            <h2 className="mb-1.5 mt-[9px] font-serif text-[43px] font-normal leading-[1.22] tracking-[-0.8px] text-ink max-[480px]:text-[38px]">
              Ready to Ride?
            </h2>
            <p className="m-0 text-[14px] text-[#777571] max-[480px]:text-[15px]">
              Let&apos;s make your next journey a comfortable one.
            </p>
          </div>
          <a href="#booking" className={`${buttonBase} ${buttonPrimary} shrink-0`}>
            Book Your Cab <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* Footer — unchanged dark background */}
      <footer className="bg-[#080f1e] text-[#d5dbe5]">
        <div className="container-cab grid grid-cols-1 gap-[34px] py-12 lg:grid-cols-[1.3fr_0.75fr_0.9fr_1fr] lg:gap-[50px] lg:py-[65px] lg:pb-[55px]">
          <div>
            <Brand light />
            <p className="my-6 max-w-[280px] text-[13px] leading-[1.9] text-[#a5afbf] max-[480px]:text-[14px]">
              Thoughtful travel. Comfortable rides. Reliable service for
              wherever life takes you.
            </p>
            <a href="tel:+61000000000" className="inline-flex items-center gap-2.5 text-[13px] font-[650] text-accent-light max-[480px]:text-[14px]">
              <Phone size={17} /> Speak to our team
            </a>
          </div>

          <div className="flex flex-col items-start gap-3">
            <h3 className="mb-3 mt-1 text-[14px] font-bold text-white">Quick Links</h3>
            {[
              ["Home", "#home"],
              ["About Us", "#about"],
              ["Our Services", "#services"],
              ["Why Choose Us", "#why-us"],
              ["FAQs", "#faq"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-[13px] text-[#aab3c1] hover:text-accent-light max-[480px]:text-[14px]">
                {label}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-start gap-3">
            <h3 className="mb-3 mt-1 text-[14px] font-bold text-white">Our Services</h3>
            {["Airport Transfers", "General Transfers", "Corporate Travel", "Maxi Cab", "Accessible Transport"].map((label) => (
              <a key={label} href="#booking" className="text-[13px] text-[#aab3c1] hover:text-accent-light max-[480px]:text-[14px]">
                {label}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-start gap-3">
            <h3 className="mb-3 mt-1 text-[14px] font-bold text-white">Get In Touch</h3>
            <p className="m-0 flex items-start gap-2.5 text-[13px] text-[#aab3c1] max-[480px]:text-[14px]">
              <Phone size={16} className="shrink-0 text-accent" /> Add your business phone
            </p>
            <p className="m-0 flex items-start gap-2.5 text-[13px] text-[#aab3c1] max-[480px]:text-[14px]">
              <MapPin size={16} className="shrink-0 text-accent" /> Add your service location
            </p>
            <p className="m-0 flex items-start gap-2.5 text-[13px] text-[#aab3c1] max-[480px]:text-[14px]">
              <Clock3 size={16} className="shrink-0 text-accent" /> Add your operating hours
            </p>
            <a href="#booking" className="mt-2.5 inline-flex items-center gap-2 border-b border-accent/50 pb-1.5 text-[13px] font-[650] text-accent-light max-[480px]:text-[14px]">
              Request a booking <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="container-cab flex flex-col items-start justify-between gap-4 border-t border-white/10 py-5 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="m-0 text-[11px] text-[#919cad] max-[480px]:text-[12px]">© 2026 Silver Cap Sydney. All rights reserved.</p>
          <div className="flex gap-[22px]">
            <a href="#contact" className="text-[11px] text-[#919cad] hover:text-accent-light max-[480px]:text-[12px]">Privacy Policy</a>
            <a href="#contact" className="text-[11px] text-[#919cad] hover:text-accent-light max-[480px]:text-[12px]">Terms &amp; Conditions</a>
          </div>
          <a href="#home" className="text-[11px] text-[#919cad] hover:text-accent-light max-[480px]:text-[12px]">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}