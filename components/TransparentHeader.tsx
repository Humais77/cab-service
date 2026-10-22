"use client";

import { useState } from "react";
import { ChevronDown, Menu, UserCircle2, X } from "lucide-react";

export default function TransparentHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex min-h-[82px] items-center justify-between gap-6 bg-gradient-to-b from-black/40 to-transparent px-[clamp(20px,3.2vw,58px)] py-[18px] text-white max-[900px]:min-h-[76px] max-[900px]:px-5 max-[900px]:py-[14px] max-[520px]:min-h-[70px]">
      <a
        className="whitespace-nowrap text-[clamp(27px,2.1vw,36px)] font-medium tracking-[-1.7px] text-white max-[520px]:text-[29px]"
        href="#home"
        aria-label="Cab Service home"
      >
        Cab Service
      </a>

      <button
        className="hidden text-white border-0 bg-transparent p-2 max-[900px]:inline-flex max-[900px]:items-center max-[900px]:justify-center"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={27} /> : <Menu size={27} />}
      </button>

      <nav
        aria-label="Main navigation"
        className={[
          "flex items-center gap-[clamp(20px,3vw,48px)]",
          "[&_a]:inline-flex [&_a]:items-center [&_a]:gap-2 [&_a]:text-base [&_a]:font-[650] [&_a]:text-white [&_a]:no-underline [&_a]:[text-shadow:0_1px_8px_#0005] [&_a:hover]:opacity-80",
          "max-[900px]:absolute max-[900px]:top-[calc(100%-2px)] max-[900px]:left-3 max-[900px]:right-3 max-[900px]:hidden max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-0 max-[900px]:rounded-[14px] max-[900px]:border max-[900px]:border-white/30 max-[900px]:bg-[rgba(20,25,31,0.96)] max-[900px]:p-3 max-[900px]:shadow-[0_14px_30px_#0003] max-[900px]:[&_a]:min-h-[54px] max-[900px]:[&_a]:px-3 max-[900px]:[&_a]:py-2.5 max-[900px]:[&_a]:text-lg",
          open ? "max-[900px]:flex" : "",
        ].join(" ")}
      >
        <a href="#services" onClick={close}>
          Our services <ChevronDown size={15} />
        </a>
        <a href="#why-us" onClick={close}>Why choose us</a>
        <a href="#contact" onClick={close}>Contact</a>
        <a
          className="min-h-[46px] rounded-[30px] border border-[#ffffffb8] px-[19px] max-[900px]:mt-2 max-[900px]:justify-center"
          href="#booking"
          onClick={close}
        >
          <UserCircle2 size={18} /> Book a ride
        </a>
      </nav>
    </header>
  );
}