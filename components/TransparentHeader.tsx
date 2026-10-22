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
    <header className={`site-header ${isHome ? "site-header--home" : "site-header--inner"}`}>
      <div className="site-header__inner">
        <Link className="site-wordmark" href="/" onClick={closeMenus} aria-label="Cab Service home">
          <span className="site-wordmark__mark">S</span>
          <span className="site-wordmark__text">
            <strong>Cab Service</strong>
            <small>YOUR JOURNEY, OUR PRIORITY</small>
          </span>
        </Link>

        <button
          className="site-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={27} /> : <Menu size={27} />}
        </button>

        <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`} aria-label="Main navigation">
          <div
            className={`site-nav__dropdown ${servicesOpen ? "site-nav__dropdown--open" : ""}`}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="site-nav__dropdown-trigger"
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((open) => !open)}
            >
              Our services <ChevronDown size={16} />
            </button>
            <div className="site-nav__dropdown-menu">
              {serviceLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenus}>
                  {item.label}
                  <ArrowUpRight size={15} />
                </Link>
              ))}
            </div>
          </div>

          <Link href="/why-choose-us" onClick={closeMenus}>Why choose us</Link>
          <Link href="/contact" onClick={closeMenus}>Contact us</Link>
          <Link className="site-nav__book" href="/#booking" onClick={closeMenus}>Book a ride <ArrowUpRight size={16} /></Link>
        </nav>
      </div>
    </header>
  );
}
