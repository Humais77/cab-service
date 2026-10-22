import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

export default function StickyBookingCard() {
  return (
    <>
      <aside className="sticky-booking" aria-label="Quick booking">
        <span className="eyebrow">YOUR JOURNEY STARTS HERE</span>
        <h2>Where would you like to go?</h2>
        <p>Enter your journey details in our booking form to continue.</p>
        <div className="sticky-booking__preview">
          <span><MapPin size={18} /> Pickup & destination</span>
          <span><CalendarDays size={18} /> Date & pickup time</span>
        </div>
        <Link className="button button--blue sticky-booking__button" href="/#booking">
          Plan your journey <ArrowRight size={18} />
        </Link>
        <small>Need help? Visit our <Link href="/contact">contact page</Link>.</small>
      </aside>

      <Link className="mobile-booking-cta" href="/#booking">
        Book your ride <ArrowRight size={19} />
      </Link>
    </>
  );
}
