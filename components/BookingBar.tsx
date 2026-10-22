"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  ChevronDown,
  Clock3,
  MapPin,
  Users,
  UserRound,
  Mail,
  Phone,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function BookingBar() {
  const [tripType, setTripType] = useState<"One way" | "Return">("One way");
  const [notice, setNotice] = useState("");
  const [showOptions, setShowOptions] = useState(false);
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

  // Field styling optimized for the dark UI
  const fieldBase =
    "block min-w-0 flex flex-col pt-1 pb-2.5 max-[900px]:pb-1 max-[520px]:pb-2";

  const labelBase =
    "flex items-center gap-2 mb-1 text-[13px] font-bold text-white max-[520px]:text-[14px] [&_svg]:shrink-0";

  const inputBase =
    "w-full min-w-0 min-h-[44px] border-0 border-b border-white/40 bg-transparent px-0 py-[5px] text-[16px] text-white outline-none placeholder:text-white/50 focus:border-white [color-scheme:dark] max-[520px]:text-[17px]";
    
  const selectBase = `${inputBase} [&>option]:bg-white [&>option]:text-ink cursor-pointer`;

  return (
    <section
      className="relative z-[5] mx-auto -mt-[110px] w-[min(1180px,calc(100%-48px))] scroll-mt-5 max-[900px]:-mt-[60px] max-[900px]:w-[calc(100%-28px)] max-[520px]:-mt-[40px] max-[520px]:w-[calc(100%-22px)]"
      id="booking"
      aria-label="Book a ride"
    >
      <form
        className="grid grid-cols-4 gap-0 rounded-[12px] border border-white/20 bg-[rgba(34,38,44,0.85)] p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-[20px] max-[900px]:grid-cols-2 max-[900px]:gap-y-2 max-[900px]:px-4 max-[900px]:py-4 max-[520px]:grid-cols-1 max-[520px]:gap-0 max-[520px]:rounded-[16px] max-[520px]:px-5 max-[520px]:py-5"
        onSubmit={handleSubmit}
      >
        {/* Trip type tabs */}
        <div
          className="col-span-full mb-[20px] flex justify-self-start gap-1 rounded-[30px] border border-white/30 bg-white/5 p-1 max-[900px]:mb-4 max-[900px]:ml-0 max-[520px]:w-full"
          role="group"
          aria-label="Trip type"
        >
          {(["One way", "Return"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={[
                "flex-1 min-h-10 min-w-[115px] rounded-[25px] border-0 px-[18px] text-sm font-bold transition-all max-[520px]:text-[15px]",
                tripType === type
                  ? "bg-[#159cf0] text-white shadow-md"
                  : "bg-transparent text-white/70 hover:text-white",
              ].join(" ")}
              aria-pressed={tripType === type}
              onClick={() => {
                setTripType(type);
                setNotice("");
              }}
            >
              {type === "Return" ? "By the hour" : type}
            </button>
          ))}
        </div>

        {/* --- ALWAYS VISIBLE: Pickup, Drop-off, Date, Time --- */}
        <div className="col-span-full grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[900px]:gap-x-4 max-[520px]:grid-cols-1 max-[520px]:gap-2">
          <label className={fieldBase}>
            <span className={labelBase}>Pickup location</span>
            <input name="pickup" placeholder="Address, airport, hotel, ..." autoComplete="street-address" required className={inputBase} />
          </label>

          <label className={fieldBase}>
            <span className={labelBase}>Drop-off location</span>
            <input name="destination" placeholder="Address, airport, hotel, ..." required className={inputBase} />
          </label>

          <label className={fieldBase}>
            <span className={labelBase}>Date</span>
            <input name="date" type="date" min={new Date().toISOString().slice(0, 10)} required className={inputBase} />
          </label>

          <label className={fieldBase}>
            <span className={labelBase}>Pickup time</span>
            <input name="time" type="time" required className={inputBase} />
          </label>
        </div>

        {/* --- HIDDEN OPTIONS (shown only after clicking View options) --- */}
        {showOptions && (
          <div
            id="booking-extra-options"
            className="col-span-full mt-4 grid grid-cols-4 gap-5 border-t border-white/20 pt-4 max-[900px]:grid-cols-2 max-[900px]:gap-x-4 max-[520px]:grid-cols-1 max-[520px]:gap-2"
          >
            {tripType === "Return" && (
              <>
                <label className={fieldBase}>
                  <span className={labelBase}>Return date</span>
                  <input name="returnDate" type="date" min={new Date().toISOString().slice(0, 10)} required className={inputBase} />
                </label>
                <label className={fieldBase}>
                  <span className={labelBase}>Return time</span>
                  <input name="returnTime" type="time" required className={inputBase} />
                </label>
              </>
            )}

            <label className={fieldBase}>
              <span className={labelBase}>Vehicle</span>
              <select name="vehicle" defaultValue="" required className={selectBase}>
                <option value="" disabled>Select a vehicle</option>
                <option>Standard Sedan</option>
                <option>Premium Sedan</option>
                <option>Maxi Cab</option>
                <option>Accessible Vehicle</option>
              </select>
            </label>

            <label className={fieldBase}>
              <span className={labelBase}>Passengers</span>
              <select name="passengers" defaultValue="1" className={selectBase}>
                {Array.from({ length: 13 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "passenger" : "passengers"}
                  </option>
                ))}
              </select>
            </label>

            <label className={fieldBase}>
              <span className={labelBase}>Full name</span>
              <input name="name" autoComplete="name" placeholder="Your name" required className={inputBase} />
            </label>

            <label className={fieldBase}>
              <span className={labelBase}>Email address</span>
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required className={inputBase} />
            </label>

            <label className={fieldBase}>
              <span className={labelBase}>Phone number</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" required className={inputBase} />
            </label>

            <label className={fieldBase}>
              <span className={labelBase}>Service type</span>
              <select name="service" defaultValue="General Transfer" className={selectBase}>
                <option>General Transfer</option>
                <option>Airport Transfer</option>
                <option>Corporate Transfer</option>
                <option>Family Travel</option>
              </select>
            </label>

            <div className="col-span-full pt-1">
              <label htmlFor="specialInstructions" className="mb-2 block text-[13px] font-bold text-white">
                Special instructions (optional)
              </label>
              <textarea
                id="specialInstructions"
                value={specialInstructions}
                onChange={(event) => setSpecialInstructions(event.target.value)}
                maxLength={2000}
                rows={2}
                placeholder="Any additional requirements?"
                className="w-full rounded-xl border border-white/30 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#159cf0]"
              />
            </div>
          </div>
        )}

        {/* --- ACTIONS: View Options & Submit --- */}
        <div className="col-span-full mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-[520px]:mt-5">
          
          <button
            type="button"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-white/40 bg-transparent px-6 text-[15px] font-bold text-white transition-colors hover:bg-white/10 max-[520px]:order-2 max-[520px]:w-full"
            aria-expanded={showOptions}
            aria-controls="booking-extra-options"
            onClick={() => setShowOptions((v) => !v)}
          >
            {showOptions ? (
              <>
                <X size={18} /> Hide options
              </>
            ) : (
              <>
                <SlidersHorizontal size={18} /> View options
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] bg-[#159cf0] px-8 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 max-[520px]:order-1 max-[520px]:w-full"
          >
            {isSubmitting ? "Submitting..." : "Book Now"} <ArrowRight size={18} />
          </button>
        </div>

        {notice && (
          <p
            className="col-span-full mt-3 mb-0 rounded-lg bg-red-500/20 px-3.5 py-3 text-sm text-red-100 border border-red-500/50"
            role="status"
          >
            {notice}
          </p>
        )}
      </form>
    </section>
  );
}