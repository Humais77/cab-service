import { ArrowRight } from "lucide-react";

export default function ChauffeurHero() {
  return (
    <section
      className="relative flex min-h-[clamp(650px,91vh,950px)] items-center justify-center overflow-hidden bg-[#34383d] text-white max-[900px]:min-h-[82svh] max-[520px]:min-h-[78svh]"
      aria-labelledby="bl-hero-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-[1.015] bg-[url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=2400&q=90')] bg-cover bg-[58%_54%] max-[900px]:bg-[58%_center] max-[520px]:bg-[60%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,17,23,0.48),rgba(12,17,23,0.08)_68%),linear-gradient(0deg,rgba(12,17,23,0.42),transparent_55%)] max-[520px]:bg-[linear-gradient(0deg,rgba(10,15,22,0.65),rgba(10,15,22,0.18)_78%)]"
      />
      <div className="relative z-[1] mx-auto mt-20 mb-[65px] w-[min(1100px,90vw)] text-center max-[900px]:mt-[75px] max-[900px]:w-[calc(100%-36px)] max-[520px]:mt-14 max-[520px]:mb-20">
        <p className="m-0 mb-5 text-[clamp(14px,1vw,16px)] font-bold tracking-[0.15em] max-[520px]:mx-auto max-[520px]:mb-[17px] max-[520px]:max-w-[300px] max-[520px]:text-[13px] max-[520px]:leading-[1.5]">
          COMFORTABLE, RELIABLE PRIVATE RIDES
        </p>
        <h1
          id="bl-hero-title"
          className="m-0 font-serif text-[clamp(52px,6.2vw,92px)] leading-[1.04] font-normal tracking-[-0.045em] [text-shadow:0_2px_18px_#0004] max-[900px]:text-[clamp(48px,9vw,76px)] max-[520px]:text-[clamp(47px,12vw,65px)] max-[520px]:leading-[1.08]"
        >
          Your chauffeur
          <br className="max-[520px]:hidden" /> awaits.
        </h1>
        <p className="mx-auto mt-[22px] mb-7 max-w-[620px] text-[clamp(19px,1.6vw,24px)] leading-[1.5] [text-shadow:0_1px_8px_#0006] max-[520px]:max-w-[340px] max-[520px]:mt-[18px] max-[520px]:mb-6 max-[520px]:text-[20px]">
          Travel on your schedule, with comfort at every turn.
        </p>
        <a
          className="inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-[32px] bg-white px-[25px] text-lg font-bold text-ink no-underline max-[520px]:min-h-[58px] max-[520px]:w-[min(100%,300px)] max-[520px]:text-[19px]"
          href="#booking"
        >
          Plan your journey <ArrowRight size={19} />
        </a>
      </div>
      <a
        className="absolute left-1/2 bottom-[30px] z-[1] -translate-x-1/2 text-base font-bold text-white no-underline max-[520px]:bottom-[18px] max-[520px]:text-[17px]"
        href="#booking"
      >
        Book your ride ↓
      </a>
    </section>
  );
}