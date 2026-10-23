import { ShieldCheck, Clock3, CarFront, Headphones } from "lucide-react";
import { SectionHeading } from "./AboutSection";

const benefits = [
  { icon: ShieldCheck, title: "Safe & Reliable", text: "Professional service with passenger comfort and safety in mind." },
  { icon: Clock3, title: "Always On Time", text: "Thoughtful scheduling to make every journey smoother." },
  { icon: CarFront, title: "Comfortable Vehicles", text: "Travel in clean, spacious and well-maintained vehicles." },
  { icon: Headphones, title: "Friendly Support", text: "Helpful assistance for your travel and booking enquiries." },
];

export default function WhyUs() {
  return (
    <section className="bg-white py-[57px] md:py-[95px]" id="why-us">
      <div className="container-cab">
        <div className="mx-auto mb-[42px] max-w-[630px] text-center">
          <SectionHeading
            eyebrow="THE Silver Cab Sydney DIFFERENCE"
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
  );
}