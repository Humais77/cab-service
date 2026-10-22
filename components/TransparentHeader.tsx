"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";

const serviceLinks = [
  { href: "/services", label: "All services" },
  { href: "/services/city-to-city", label: "City-to-city rides" },
  { href: "/services/airport-transfers", label: "Airport transfers" },
  { href: "/services/hourly-hire", label: "Hourly & full-day hire" },
  { href: "/services/corporate-travel", label: "Corporate travel" },
];

export default function TransparentHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const isHome = pathname === "/";
  
  const closeMenus = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <header
      className={[
        "z-[999] w-full", // High z-index to stay above everything
        isHome
          ? "absolute left-0 top-0 bg-transparent text-white"
          : "sticky top-0 border-b border-black/[0.06] bg-site-cream/95 text-site-ink backdrop-blur-md",
      ].join(" ")}
    >
      <div className="mx-auto flex min-h-[88px] max-w-[1440px] items-center justify-between gap-[30px] px-[4.2%] py-[18px] max-[1050px]:min-h-[78px] max-[800px]:min-h-[74px] max-[800px]:px-5 max-[800px]:py-[14px]">
        <Link
          className="inline-flex flex-shrink-0 items-center gap-2.5 text-inherit no-underline"
          href="/"
          onClick={closeMenus}
          aria-label="Silver Cap Sydney home"
        >
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

        <button
          className="hidden border-0 bg-transparent text-inherit max-[800px]:inline-flex max-[800px]:h-[46px] max-[800px]:w-[46px] max-[800px]:items-center max-[800px]:justify-center max-[800px]:rounded-full max-[800px]:border max-[800px]:border-current"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={27} /> : <Menu size={27} />}
        </button>

        <nav
          className={[
            "hidden items-center gap-[clamp(18px,2.7vw,42px)] min-[801px]:flex",
            "[&>a]:inline-flex [&>a]:items-center [&>a]:gap-[7px] [&>a]:py-3 [&>a]:text-sm [&>a]:font-semibold [&>a]:no-underline [&>a]:whitespace-nowrap",
            "max-[1050px]:gap-[17px] max-[1050px]:[&>a]:text-[13px]",
            menuOpen
              ? "max-[800px]:absolute max-[800px]:left-0 max-[800px]:right-0 max-[800px]:top-[calc(100%+1px)] max-[800px]:flex max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-0 max-[800px]:border-b max-[800px]:border-site-line max-[800px]:bg-[#faf7f1] max-[800px]:px-5 max-[800px]:pb-[22px] max-[800px]:pt-3 max-[800px]:text-site-ink max-[800px]:shadow-[0_14px_25px_rgba(0,0,0,0.1)]"
              : "",
            "max-[800px]:[&>a]:min-h-12 max-[800px]:[&>a]:w-full max-[800px]:[&>a]:justify-between max-[800px]:[&>a]:border-b max-[800px]:[&>a]:border-[#e8e2d8] max-[800px]:[&>a]:px-1 max-[800px]:[&>a]:py-[13px] max-[800px]:[&>a]:text-base",
          ].join(" ")}
          aria-label="Main navigation"
        >
          <div
            className="relative max-[800px]:w-full"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="inline-flex items-center gap-[7px] border-0 bg-transparent py-3 text-sm font-semibold text-inherit hover:opacity-70 max-[1050px]:text-[13px] max-[800px]:min-h-12 max-[800px]:w-full max-[800px]:justify-between max-[800px]:border-b max-[800px]:border-[#e8e2d8] max-[800px]:px-1 max-[800px]:py-[13px] max-[800px]:text-base"
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((open) => !open)}
            >
              Our services <ChevronDown size={16} />
            </button>
            <div
              className={[
                "absolute left-[-20px] top-[calc(100%+3px)] z-[110] w-[265px] rounded-xl border border-site-line bg-[#fffdfa] p-[9px] shadow-[0_18px_50px_rgba(0,0,0,0.14)]",
                "transition-[opacity,transform,visibility] duration-150",
                "[&_a]:flex [&_a]:items-center [&_a]:justify-between [&_a]:gap-3 [&_a]:rounded-[7px] [&_a]:px-3 [&_a]:py-[13px] [&_a]:text-sm [&_a]:text-[#252525] [&_a]:no-underline [&_a:hover]:bg-[#f2eee7]",
                "max-[800px]:static max-[800px]:w-full max-[800px]:rounded-none max-[800px]:border-0 max-[800px]:bg-transparent max-[800px]:p-0 max-[800px]:pb-2 max-[800px]:pl-3 max-[800px]:shadow-none",
                "max-[800px]:[&_a]:min-h-[44px] max-[800px]:[&_a]:text-[15px]",
                servicesOpen
                  ? "visible translate-y-0 opacity-100 max-[800px]:block"
                  : "invisible translate-y-[7px] opacity-0 max-[800px]:hidden",
                "focus-within:visible focus-within:translate-y-0 focus-within:opacity-100",
              ].join(" ")}
            >
              {serviceLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenus}>
                  {item.label}
                  <ArrowUpRight size={15} />
                </Link>
              ))}
            </div>
          </div>

          <Link href="/why-choose-us" onClick={closeMenus}>
            Why choose us
          </Link>
          <Link href="/contact" onClick={closeMenus}>
            Contact us
          </Link>
          <Link
            className="gap-2 rounded-[25px] border border-current px-[17px] py-3 max-[800px]:mt-[15px] max-[800px]:justify-center max-[800px]:border-[#222]"
            href="/#booking"
            onClick={closeMenus}
          >
            Book a ride <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}