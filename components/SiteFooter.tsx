import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-[#202120] px-[5%] pt-12 text-[#f8f6f1] max-[800px]:pb-20 max-[560px]:px-5 max-[560px]:pb-20 max-[560px]:pt-[37px]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-[35px] pb-[43px] max-[1050px]:grid-cols-[1.3fr_1fr_1fr] max-[560px]:grid-cols-2 max-[560px]:gap-x-[18px] max-[560px]:gap-y-[30px]">
        <div className="max-[560px]:col-span-2">
          <Link className="inline-flex items-center gap-2.5 text-white no-underline" href="/">
            <span className="grid h-[39px] w-[39px] place-items-center rounded-full border border-current font-serif text-2xl max-[560px]:h-[35px] max-[560px]:w-[35px] max-[560px]:text-[21px]">
              S
            </span>
            <span className="flex flex-col gap-[3px]">
              <strong className="text-[21px] font-[550] leading-[1.1] tracking-[-0.6px] max-[560px]:text-[19px]">
                Silver Cap Sydney
              </strong>
              <small className="text-[8px] tracking-[1.25px] opacity-75 max-[560px]:text-[7px] max-[560px]:tracking-[1px]">
                YOUR JOURNEY, OUR PRIORITY
              </small>
            </span>
          </Link>
          <p className="max-w-[300px] text-sm leading-[1.8] text-[#c4c2bc]">
            Thoughtful travel. Comfortable rides. Reliable service for wherever
            life takes you.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3">
          <h3 className="mb-2 mt-1 text-[15px] font-[650]">Our services</h3>
          {[
            ["All services", "/services"],
            ["City-to-city rides", "/services/city-to-city"],
            ["Airport transfers", "/services/airport-transfers"],
            ["Hourly & full-day hire", "/services/hourly-hire"],
            ["Corporate travel", "/services/corporate-travel"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-sm leading-[1.5] text-[#c9c7c1] no-underline hover:text-white hover:underline"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3">
          <h3 className="mb-2 mt-1 text-[15px] font-[650]">Explore</h3>
          {[
            ["Why choose us", "/why-choose-us"],
            ["Contact us", "/contact"],
            ["Book a ride", "/#booking"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-sm leading-[1.5] text-[#c9c7c1] no-underline hover:text-white hover:underline"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3 max-[1050px]:col-span-2 max-[1050px]:col-start-2 max-[560px]:col-span-2 max-[560px]:col-start-1">
          <h3 className="mb-2 mt-1 text-[15px] font-[650]">Get in touch</h3>
          <p className="m-0 flex items-center gap-2 text-sm leading-[1.5] text-[#c9c7c1]">
            <Phone size={16} /> Add your business phone
          </p>
          <p className="m-0 flex items-center gap-2 text-sm leading-[1.5] text-[#c9c7c1]">
            <MapPin size={16} /> Add your service area
          </p>
          <Link
            className="mt-[5px] inline-flex items-center gap-[7px] text-white"
            href="/contact"
          >
            Contact our team <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1320px] justify-between gap-5 border-t border-white/[0.17] py-[18px] pb-[22px] text-xs text-[#c4c2bc] max-[560px]:flex-col max-[560px]:gap-2">
        <span>© 2026 Silver Cap Sydney. All rights reserved.</span>
        <span>Comfortable journeys, thoughtfully arranged.</span>
      </div>
    </footer>
  );
}