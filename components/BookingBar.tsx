"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CalendarDays, CarFront, Clock3, MapPin, Users, UserRound, Mail, Phone } from "lucide-react";

/** Uses the existing frontend booking flow: validation + local demo confirmation only. */
export default function BookingBar() {
  const [tripType, setTripType] = useState<"One way" | "Return">("One way");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Your request is ready. This demo does not send or save bookings yet.");
  }

  return (
    <section className="bl-booking-wrap" id="booking" aria-label="Book a ride">
      <form className="bl-booking" onSubmit={handleSubmit}>
        <div className="bl-trip-switch" role="group" aria-label="Trip type">
          {(["One way", "Return"] as const).map((type) => (
            <button key={type} type="button" className={tripType === type ? "bl-trip-active" : ""} aria-pressed={tripType === type} onClick={() => { setTripType(type); setNotice(""); }}>{type}</button>
          ))}
        </div>
        <label className="bl-field"><span><MapPin size={17} /> Pickup location</span><input name="pickup" placeholder="Enter pickup address" autoComplete="street-address" required /></label>
        <label className="bl-field"><span><MapPin size={17} /> Drop-off location</span><input name="destination" placeholder="Enter destination" required /></label>
        <label className="bl-field"><span><CalendarDays size={17} /> Date</span><input name="date" type="date" min={new Date().toISOString().slice(0, 10)} required /></label>
        <label className="bl-field"><span><Clock3 size={17} /> Pickup time</span><input name="time" type="time" required /></label>
        {tripType === "Return" && <>
          <label className="bl-field"><span><CalendarDays size={17} /> Return date</span><input name="returnDate" type="date" min={new Date().toISOString().slice(0, 10)} required /></label>
          <label className="bl-field"><span><Clock3 size={17} /> Return time</span><input name="returnTime" type="time" required /></label>
        </>}
        <label className="bl-field"><span><CarFront size={17} /> Vehicle</span><select name="vehicle" defaultValue="" required><option value="" disabled>Select a vehicle</option><option>Standard Sedan</option><option>Premium Sedan</option><option>Maxi Cab</option><option>Accessible Vehicle</option></select></label>
        <label className="bl-field"><span><Users size={17} /> Passengers</span><select name="passengers" defaultValue="1">{Array.from({ length: 13 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "passenger" : "passengers"}</option>)}</select></label>
        <label className="bl-field"><span><UserRound size={17} /> Full name</span><input name="name" autoComplete="name" placeholder="Your name" required /></label>
        <label className="bl-field"><span><Mail size={17} /> Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label className="bl-field"><span><Phone size={17} /> Phone number</span><input name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" required /></label>
        <label className="bl-field"><span><CarFront size={17} /> Service type</span><select name="service" defaultValue="General Transfer"><option>General Transfer</option><option>Airport Transfer</option><option>Corporate Transfer</option><option>Family Travel</option></select></label>
        <button className="bl-booking-submit" type="submit">View options <ArrowRight size={18} /></button>
        {notice && <p className="bl-booking-notice" role="status">{notice}</p>}
      </form>
    </section>
  );
}
