import { Plane, Baby, Accessibility, BriefcaseBusiness, ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionHeading } from "./AboutSection";

export default function SpecialServices() {
  return (
    <section className="relative overflow-hidden bg-[#faf7f1] text-ink px-0 py-[57px] md:py-[95px]">
      <div className="container-cab grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[95px]">
        <div>
          <SectionHeading
            eyebrow="TRAVEL THAT FITS YOU"
            title="Thoughtful Travel for Every Passenger"
            text="Different journeys call for different needs. Our service options make it easier to plan a comfortable trip for you and your passengers."
          />
          <a href="#booking" className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-[2px] border border-transparent bg-accent px-[19px] py-[13px] text-sm font-[750] text-navy-deep transition-transform hover:-translate-y-0.5 hover:bg-accent-light max-[480px]:min-h-[52px] max-[480px]:px-[22px] max-[480px]:text-[15px]">
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
  );
}