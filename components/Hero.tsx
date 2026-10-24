import { ArrowRight, Phone } from "lucide-react";

const PHONE_TEL = "+61200000000"; // e.g. "+61291234567"
const PHONE_DISPLAY = "(02) 0000 0000";

export default function CabHero() {
  return (
    <section
      className="relative flex min-h-[clamp(560px,80vh,880px)] items-center justify-center overflow-hidden bg-[#34383d] text-white max-[900px]:min-h-[70svh] max-[520px]:min-h-[64svh]"
      aria-labelledby="hero-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-[1.015] bg-[url('/Hero.png')] bg-cover bg-[58%_54%] max-[900px]:bg-[58%_center] max-[520px]:bg-[60%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,17,23,0.55),rgba(12,17,23,0.12)_68%),linear-gradient(0deg,rgba(12,17,23,0.45),transparent_55%)] max-[520px]:bg-[linear-gradient(0deg,rgba(10,15,22,0.78),rgba(10,15,22,0.32)_78%)]"
      />
      <div className="relative z-[1] mx-auto mt-20 w-[min(1100px,90vw)] text-center max-[900px]:mt-[75px] max-[900px]:w-[calc(100%-36px)] max-[520px]:mt-16">
        <p className="m-0 mb-4 text-[clamp(12px,1vw,15px)] font-bold tracking-[0.15em] max-[520px]:mx-auto max-[520px]:max-w-[320px] max-[520px]:text-[11px]">
          SYDNEY'S RELIABLE CAB SERVICE · 24/7
        </p>
        <h1
          id="hero-title"
          className="m-0 font-serif text-[clamp(48px,6vw,88px)] leading-[1.05] font-normal tracking-[-0.045em] [text-shadow:0_2px_18px_#0004] max-[900px]:text-[clamp(44px,8.5vw,72px)] max-[520px]:text-[clamp(40px,11vw,54px)] max-[520px]:leading-[1.08]"
        >
          Your ride
          <br className="max-[520px]:hidden" /> is a tap away.
        </h1>
        <p className="mx-auto mt-[18px] mb-0 max-w-[620px] text-[clamp(18px,1.6vw,24px)] leading-[1.5] [text-shadow:0_1px_8px_#0006] max-[520px]:max-w-[340px] max-[520px]:text-[18px]">
          Travel on your schedule, with comfort at every turn.
        </p>

        {/* Call us */}
        <a
          href={`tel:${PHONE_TEL}`}
          className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-full border border-white/70 bg-white/10 px-6 py-3 text-[15px] font-semibold text-white no-underline backdrop-blur transition-colors hover:bg-white/20 max-[520px]:mt-5 max-[520px]:px-5 max-[520px]:py-2.5 max-[520px]:text-sm"
          aria-label={`Call us at ${PHONE_DISPLAY}`}
        >
          <Phone size={17} aria-hidden="true" />
          <span>
            Call us: <span className="whitespace-nowrap">{PHONE_DISPLAY}</span>
          </span>
        </a>
      </div>
    </section>
  );
}