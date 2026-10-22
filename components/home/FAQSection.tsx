"use client";

import { useState } from "react";
import { ChevronDown, Headphones, ArrowRight } from "lucide-react";
import { SectionHeading } from "./AboutSection";

const faqs = [
  { q: "Can I book a cab in advance?", a: "Yes. This demo supports selecting your preferred pickup date and time. Advance booking requests can be connected to a booking system in the backend phase." },
  { q: "Do you offer airport transfers?", a: "Yes, airport transfers are one of the featured services. Add your actual airport coverage, pickup instructions and pricing before launching the live website." },
  { q: "Can I book a vehicle for a group?", a: "Yes. Choose the appropriate vehicle and passenger count in the booking form. Vehicle availability will need to be connected to your real fleet later." },
  { q: "Are child seats or wheelchair-accessible vehicles available?", a: "The demo includes options for child seats and wheelchair-accessible transport. Actual availability should be confirmed with the operating team." },
  { q: "How do I receive my booking confirmation?", a: "This frontend demo displays a local confirmation message. A live version can send confirmation emails or messages after the booking backend is implemented." },
];

export default function FAQSection() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
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
  );
}