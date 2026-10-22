"use client";

import { useState } from "react";
import { ChevronDown, Menu, UserCircle2, X } from "lucide-react";

export default function TransparentHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="bl-header">
      <a className="bl-wordmark" href="#home" aria-label="Cab Service home">Cab Service</a>
      <button className="bl-menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X size={27} /> : <Menu size={27} />}
      </button>
      <nav className={`bl-nav ${open ? "bl-nav-open" : ""}`} aria-label="Main navigation">
        <a href="#services" onClick={close}>Our services <ChevronDown size={15} /></a>
        <a href="#why-us" onClick={close}>Why choose us</a>
        <a href="#contact" onClick={close}>Contact</a>
        <a className="bl-sign-in" href="#booking" onClick={close}><UserCircle2 size={18} /> Book a ride</a>
      </nav>
    </header>
  );
}
