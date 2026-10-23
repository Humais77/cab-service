import { Sparkles, Check, ArrowRight } from "lucide-react";

export function SectionHeading({
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

export default function AboutSection() {
  return (
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
            eyebrow="WELCOME TO Silver Cab Sydney"
            title="A Better Way to Get Where You're Going"
            text="We believe every journey should feel effortless. From the moment you book to the moment you arrive, our focus is on comfort, convenience and dependable service."
          />
          <p className="mt-5 text-[14px] leading-[1.9] text-muted max-[480px]:text-[15px]">
            Whether you need an airport transfer, a family ride, a group
            vehicle or professional business transport, Silver Cab Sydney makes
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
  );
}