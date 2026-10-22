import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer-new">
      <div className="site-footer-new__main">
        <div className="site-footer-new__brand">
          <Link className="site-wordmark site-wordmark--footer" href="/">
            <span className="site-wordmark__mark">S</span>
            <span className="site-wordmark__text"><strong>Cab Service</strong><small>YOUR JOURNEY, OUR PRIORITY</small></span>
          </Link>
          <p>Thoughtful travel. Comfortable rides. Reliable service for wherever life takes you.</p>
        </div>
        <div className="site-footer-new__column">
          <h3>Our services</h3>
          <Link href="/services">All services</Link>
          <Link href="/services/city-to-city">City-to-city rides</Link>
          <Link href="/services/airport-transfers">Airport transfers</Link>
          <Link href="/services/hourly-hire">Hourly & full-day hire</Link>
          <Link href="/services/corporate-travel">Corporate travel</Link>
        </div>
        <div className="site-footer-new__column">
          <h3>Explore</h3>
          <Link href="/why-choose-us">Why choose us</Link>
          <Link href="/contact">Contact us</Link>
          <Link href="/#booking">Book a ride</Link>
        </div>
        <div className="site-footer-new__column site-footer-new__contact">
          <h3>Get in touch</h3>
          <p><Phone size={16} /> Add your business phone</p>
          <p><MapPin size={16} /> Add your service area</p>
          <Link className="footer-contact-link" href="/contact">Contact our team <ArrowUpRight size={16} /></Link>
        </div>
      </div>
      <div className="site-footer-new__bottom">
        <span>© {new Date().getFullYear()} Cab Service. All rights reserved.</span>
        <span>Comfortable journeys, thoughtfully arranged.</span>
      </div>
    </footer>
  );
}
