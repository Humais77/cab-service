import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-site-cream text-site-ink">
      <TransparentHeader />

      <section className="px-6 pb-[55px] pt-[46px] text-center max-[560px]:px-[18px] max-[560px]:pb-[35px] max-[560px]:pt-[30px]">
        <div className="mb-[26px] flex flex-wrap items-center justify-center gap-2 text-[13px] text-[#777] max-[560px]:mb-[21px] max-[560px]:text-xs [&_a:hover]:underline">
          <Link href="/">Home</Link>
          <span>›</span>
          <span>Contact us</span>
        </div>
        <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
          WE&apos;RE HERE TO HELP
        </span>
        <h1 className="mx-auto mb-[18px] mt-3.5 max-w-[850px] font-serif text-[clamp(44px,6vw,76px)] font-normal leading-[1.05] tracking-[-1.8px] max-[560px]:text-[clamp(39px,11vw,52px)] max-[560px]:tracking-[-1px]">
          Let&apos;s talk about your journey.
        </h1>
        <p className="mx-auto mb-[25px] mt-0 max-w-[680px] text-lg leading-[1.75] text-[#62615e] max-[560px]:text-[17px]">
          Ask a question, tell us about an upcoming trip or share the details of
          a transport request.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-[clamp(35px,7vw,100px)] px-7 pb-[90px] pt-2.5 max-[800px]:grid-cols-1 max-[560px]:gap-8 max-[560px]:px-[18px] max-[560px]:pb-[55px]">
        <div>
          <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
            GET IN TOUCH
          </span>
          <h2 className="mb-3 mt-3 font-serif text-[39px] font-normal leading-[1.12] tracking-[-0.7px] max-[560px]:text-[35px]">
            How can we help?
          </h2>
          <p className="text-base leading-[1.75] text-[#5f5c57]">
            Send us a message using the form. Replace the placeholder business
            details below before publishing your website.
          </p>
          {[
            { icon: Phone, label: "Call us", value: "Add your business phone number" },
            { icon: Mail, label: "Email us", value: "Add your business email address" },
            { icon: MapPin, label: "Service area", value: "Add your operating cities or regions" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="mt-[25px] flex items-start gap-3.5">
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-[#eeebe4]">
                <Icon size={21} />
              </span>
              <div>
                <strong className="text-base">{label}</strong>
                <p className="mb-0 mt-[5px] text-[15px] leading-[1.5] text-[#66635d]">
                  {value}
                </p>
              </div>
            </div>
          ))}
          <div className="mt-7 border-l-[3px] border-site-blue bg-[#f0ece4] p-[15px] text-sm leading-[1.65] text-[#5f5c57]">
            For a new ride, you can also go straight to the booking form.
          </div>
          <Link
            className="mt-[17px] inline-flex items-center gap-[7px] text-[15px] font-semibold text-[#006cf0] no-underline hover:underline"
            href="/#booking"
          >
            Go to booking <ArrowRight size={17} />
          </Link>
        </div>

        <div className="rounded-[10px] border border-site-line bg-[#fffdfa] px-[30px] py-[30px] max-[560px]:px-[17px] max-[560px]:py-[22px]">
          <h2 className="mb-3 mt-0 font-serif text-[39px] font-normal leading-[1.12] tracking-[-0.7px] max-[560px]:text-[35px]">
            Send an enquiry
          </h2>
          <p className="text-base leading-[1.75] text-[#5f5c57]">
            Fields marked as required need to be completed.
          </p>
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}