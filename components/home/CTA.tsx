import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
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
        <a href="#booking" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[2px] border border-transparent bg-accent px-[19px] py-[13px] text-sm font-[750] text-navy-deep transition-transform hover:-translate-y-0.5 hover:bg-accent-light max-[480px]:min-h-[52px] max-[480px]:px-[22px] max-[480px]:text-[15px] shrink-0">
          Book Your Cab <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}