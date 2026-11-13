
import { ArrowRight, Phone } from "lucide-react";
import BookingBar from "@/components/BookingBar";

const PHONE_TEL = "+61200000000";
const PHONE_DISPLAY = "(02) 0000 0000";

export default function Hero() {
  return (
    <section
      className="relative isolate min-h-[760px] overflow-hidden bg-[#101722] px-3 pb-12 pt-24 text-white sm:min-h-[790px] sm:px-6 sm:pt-28 lg:min-h-[820px] lg:px-8 lg:pt-32"
      aria-labelledby="hero-title"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[url('/Hero.png')] bg-cover bg-center"
      />

      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/30 to-[#101722]/75" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/35 via-transparent to-black/20" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center text-center">

        {/* Hero heading */}
        <h1
          id="hero-title"
          className="max-w-[850px] font-serif text-[clamp(40px,5.5vw,72px)] font-normal leading-[1.06] tracking-[-0.045em] [text-shadow:0_2px_18px_#0005] max-[520px]:text-[42px]"
        >
          Your ride is a tap away.
        </h1>

        {/* Hero buttons */}
        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#booking"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1674e8] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0863d2]"
          >
            Book your ride
            <ArrowRight size={16} />
          </a>

          <a
            href={`tel:${PHONE_TEL}`}
            aria-label={`Call us at ${PHONE_DISPLAY}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <Phone size={16} />
            {PHONE_DISPLAY}
          </a>
        </div>

        {/* Booking bar directly below hero content */}
        <div className="mt-7 w-full max-w-[1180px] sm:mt-9">
          <BookingBar />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 -z-0 h-24 bg-gradient-to-t from-[#101722]/60 to-transparent" />
    </section>
  );
}
