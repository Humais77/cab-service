import { ArrowRight } from "lucide-react";

export default function ChauffeurHero() {
  return (
    <section
      className="relative flex min-h-[clamp(600px,85vh,950px)] items-center justify-center overflow-hidden bg-[#34383d] text-white max-[900px]:min-h-[72svh] max-[520px]:min-h-[65svh]"
      aria-labelledby="bl-hero-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-[1.015] bg-[url('/Hero.png')] bg-cover bg-[58%_54%] max-[900px]:bg-[58%_center] max-[520px]:bg-[60%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,17,23,0.48),rgba(12,17,23,0.08)_68%),linear-gradient(0deg,rgba(12,17,23,0.42),transparent_55%)] max-[520px]:bg-[linear-gradient(0deg,rgba(10,15,22,0.75),rgba(10,15,22,0.3)_78%)]"
      />
      <div className="relative z-[1] mx-auto mt-20 w-[min(1100px,90vw)] text-center max-[900px]:mt-[75px] max-[900px]:w-[calc(100%-36px)] max-[520px]:mt-16">
        <p className="m-0 mb-4 text-[clamp(13px,1vw,16px)] font-bold tracking-[0.15em] max-[520px]:mx-auto max-[520px]:max-w-[300px] max-[520px]:text-[12px]">
          COMFORTABLE, RELIABLE PRIVATE RIDES
        </p>
        <h1
          id="bl-hero-title"
          className="m-0 font-serif text-[clamp(52px,6.2vw,92px)] leading-[1.04] font-normal tracking-[-0.045em] [text-shadow:0_2px_18px_#0004] max-[900px]:text-[clamp(48px,9vw,76px)] max-[520px]:text-[clamp(44px,12vw,60px)] max-[520px]:leading-[1.08]"
        >
          Your chauffeur
          <br className="max-[520px]:hidden" /> awaits.
        </h1>
        <p className="mx-auto mt-[18px] mb-0 max-w-[620px] text-[clamp(18px,1.6vw,24px)] leading-[1.5] [text-shadow:0_1px_8px_#0006] max-[520px]:max-w-[340px] max-[520px]:text-[18px]">
          Travel on your schedule, with comfort at every turn.
        </p>
      </div>
    </section>
  );
}