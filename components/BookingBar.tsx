"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Clock3,
  MapPin,
  Users,
  UserRound,
  Mail,
  Phone,
} from "lucide-react";

/** Uses the existing frontend booking flow: validation + local demo confirmation only. */
export default function BookingBar() {
  const [tripType, setTripType] = useState<"One way" | "Return">("One way");
  const [notice, setNotice] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
const [specialInstructions, setSpecialInstructions] = useState("");
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (isSubmitting) return;

  setIsSubmitting(true);
  setNotice("");

  const form = event.currentTarget;
  const data = new FormData(form);

  const payload = {
    customerName: String(data.get("name") ?? "").trim(),
    customerEmail: String(data.get("email") ?? "").trim(),
    customerPhone: String(data.get("phone") ?? "").trim(),
    pickup: String(data.get("pickup") ?? "").trim(),
    destination: String(data.get("destination") ?? "").trim(),
    tripType,
    journeyDate: String(data.get("date") ?? ""),
    journeyTime: String(data.get("time") ?? ""),
    returnDate:
      tripType === "Return" ? String(data.get("returnDate") ?? "") : "",
    returnTime:
      tripType === "Return" ? String(data.get("returnTime") ?? "") : "",
    vehicleName: String(data.get("vehicle") ?? ""),
    passengerCount: Number(data.get("passengers") ?? 1),
    serviceType: String(data.get("service") ?? "General Transfer"),
    specialInstructions,
  };

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setNotice(result.error || "Unable to submit your booking.");
      return;
    }

    window.location.assign(
      `/thank-you?ref=${encodeURIComponent(result.reference)}`,
    );
  } catch {
    setNotice("A connection error occurred. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
}

  const fieldBase =
    "block min-w-0 border-b border-white/70 pt-1 pb-2.5 pr-[17px] pl-[17px] max-[900px]:border-b-0 max-[900px]:border-b max-[900px]:border-white/30 max-[900px]:px-3 max-[900px]:pt-2 max-[900px]:pb-3 max-[520px]:px-[7px] max-[520px]:pt-3 max-[520px]:pb-3.5";

  const labelBase =
    "flex items-center gap-2 mb-2 text-base font-bold max-[900px]:text-[17px] max-[520px]:mb-[7px] max-[520px]:text-[18px] [&_svg]:shrink-0";

  const inputBase =
    "w-full min-w-0 min-h-[43px] border-0 border-b border-white/70 bg-transparent px-0 py-[5px] text-[17px] text-white outline-offset-4 placeholder:text-white/85 focus:outline-none [color-scheme:dark] max-[900px]:min-h-[48px] max-[900px]:text-lg max-[520px]:min-h-[49px] max-[520px]:text-lg";

  const selectBase = `${inputBase} [&>option]:bg-white [&>option]:text-ink`;

  return (
    <section
      className="relative z-[5] mx-auto -mt-[92px] w-[min(1180px,calc(100%-48px))] scroll-mt-5 max-[900px]:-mt-12 max-[900px]:w-[calc(100%-28px)] max-[520px]:-mt-8 max-[520px]:w-[calc(100%-22px)]"
      id="booking"
      aria-label="Book a ride"
    >
      <form
        className="grid grid-cols-4 gap-0 rounded-[10px] border border-white/80 bg-[rgba(29,35,43,0.72)] p-5 text-white shadow-[0_12px_45px_#0002] backdrop-blur-[18px] max-[900px]:grid-cols-2 max-[900px]:gap-y-3 max-[900px]:px-3 max-[900px]:py-[18px] max-[520px]:grid-cols-1 max-[520px]:gap-0 max-[520px]:rounded-[14px] max-[520px]:px-[13px] max-[520px]:py-4"
        onSubmit={handleSubmit}
      >
        <div
          className="col-span-full mb-[17px] flex justify-self-start gap-1 rounded-[30px] border border-white/50 bg-white/[0.07] p-1 max-[900px]:ml-[5px] max-[520px]:mb-[13px] max-[520px]:grid max-[520px]:w-full max-[520px]:grid-cols-2 max-[520px]:justify-self-stretch"
          role="group"
          aria-label="Trip type"
        >
          {(["One way", "Return"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={[
                "min-h-10 min-w-[115px] rounded-[25px] border-0 px-[18px] text-base font-bold",
                "max-[520px]:min-h-[48px] max-[520px]:text-[17px]",
                tripType === type
                  ? "bg-bl-blue text-white"
                  : "bg-transparent text-white",
              ].join(" ")}
              aria-pressed={tripType === type}
              onClick={() => {
                setTripType(type);
                setNotice("");
              }}
            >
              {type}
            </button>
          ))}
        </div>

        <label className={fieldBase}>
          <span className={labelBase}><MapPin size={17} /> Pickup location</span>
          <input name="pickup" placeholder="Enter pickup address" autoComplete="street-address" required className={inputBase} />
        </label>

        <label className={fieldBase}>
          <span className={labelBase}><MapPin size={17} /> Drop-off location</span>
          <input name="destination" placeholder="Enter destination" required className={inputBase} />
        </label>

        <label className={fieldBase}>
          <span className={labelBase}><CalendarDays size={17} /> Date</span>
          <input name="date" type="date" min={new Date().toISOString().slice(0, 10)} required className={inputBase} />
        </label>

        <label className={fieldBase}>
          <span className={labelBase}><Clock3 size={17} /> Pickup time</span>
          <input name="time" type="time" required className={inputBase} />
        </label>

        {tripType === "Return" && (
          <>
            <label className={fieldBase}>
              <span className={labelBase}><CalendarDays size={17} /> Return date</span>
              <input name="returnDate" type="date" min={new Date().toISOString().slice(0, 10)} required className={inputBase} />
            </label>
            <label className={fieldBase}>
              <span className={labelBase}><Clock3 size={17} /> Return time</span>
              <input name="returnTime" type="time" required className={inputBase} />
            </label>
          </>
        )}

        <label className={fieldBase}>
          <span className={labelBase}><CarFront size={17} /> Vehicle</span>
          <select name="vehicle" defaultValue="" required className={selectBase}>
            <option value="" disabled>Select a vehicle</option>
            <option>Standard Sedan</option>
            <option>Premium Sedan</option>
            <option>Maxi Cab</option>
            <option>Accessible Vehicle</option>
          </select>
        </label>

        <label className={fieldBase}>
          <span className={labelBase}><Users size={17} /> Passengers</span>
          <select name="passengers" defaultValue="1" className={selectBase}>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "passenger" : "passengers"}
              </option>
            ))}
          </select>
        </label>

        <label className={fieldBase}>
          <span className={labelBase}><UserRound size={17} /> Full name</span>
          <input name="name" autoComplete="name" placeholder="Your name" required className={inputBase} />
        </label>

        <label className={fieldBase}>
          <span className={labelBase}><Mail size={17} /> Email address</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required className={inputBase} />
        </label>

        <label className={fieldBase}>
          <span className={labelBase}><Phone size={17} /> Phone number</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" required className={inputBase} />
        </label>

        <label className={fieldBase}>
          <span className={labelBase}><CarFront size={17} /> Service type</span>
          <select name="service" defaultValue="General Transfer" className={selectBase}>
            <option>General Transfer</option>
            <option>Airport Transfer</option>
            <option>Corporate Transfer</option>
            <option>Family Travel</option>
          </select>
        </label>

       <button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Submitting..." : "Book Now"}
</button>

        {notice && (
          <p
            className="col-span-full mt-3 mb-0 mx-2 rounded-lg bg-white/90 px-3.5 py-3 text-base leading-[1.5] text-[#15202a] max-[520px]:mx-0 max-[520px]:mt-3 max-[520px]:text-[17px]"
            role="status"
          >
            {notice}
          </p>
        )}
        <div className="md:col-span-2">
  <label
    htmlFor="specialInstructions"
    className="mb-2 block text-sm font-medium"
  >
    Special instructions (optional)
  </label>

  <textarea
    id="specialInstructions"
    value={specialInstructions}
    onChange={(event) => setSpecialInstructions(event.target.value)}
    maxLength={2000}
    rows={3}
    placeholder="Any additional requirements for your journey?"
    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
  />
</div>
      </form>
    </section>
  );
}