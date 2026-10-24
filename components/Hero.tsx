import { ArrowRight, Phone } from "lucide-react";

const PHONE_TEL = "+61200000000";
const PHONE_DISPLAY = "(02) 0000 0000";

export default function CabHero() {
  return (
    <section
      className="relative isolate flex min-h-[760px] items-center justify-center overflow-hidden bg-[#101722] text-white sm:min-h-[820px] lg:min-h-[850px]"
      aria-labelledby="hero-title"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20 scale-[1.02] bg-[url('/Hero.png')] bg-cover bg-center" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/25 to-[#101722]/85" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/45 via-transparent to-black/20" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 pb-36 pt-28 text-center sm:px-8 sm:pb-40 sm:pt-32 lg:px-12 lg:pb-44 lg:pt-32">
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          Sydney&apos;s reliable cab service · 24/7
        </div>

        <h1 id="hero-title" className="m-0 font-serif text-[clamp(48px,6vw,88px)] leading-[1.05] font-normal tracking-[-0.045em] [text-shadow:0_2px_18px_#0004] max-[900px]:text-[clamp(44px,8.5vw,72px)] max-[520px]:text-[clamp(40px,11vw,54px)] max-[520px]:leading-[1.08]">
          Your ride<br className="max-[520px]:hidden" /> is a tap away.
        </h1>

        <p className="mx-auto mt-[18px] mb-0 max-w-[620px] text-[clamp(18px,1.6vw,24px)] leading-[1.5] [text-shadow:0_1px_8px_#0006] max-[520px]:max-w-[340px] max-[520px]:text-[18px]">
          Travel on your schedule, with comfort at every turn.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a href="#booking" className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#1674e8] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition duration-200 hover:bg-[#0863d2] focus:outline-none focus:ring-4 focus:ring-blue-300/50">
            Book your ride <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a href={`tel:${PHONE_TEL}`} aria-label={`Call us at ${PHONE_DISPLAY}`} className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white/35 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30">
            <Phone size={16} aria-hidden="true" /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#101722]/80 to-transparent" />
    </section>
  );
}
