"use client";

import { FormEvent, useCallback, useState } from "react";
import { ArrowRight, CalendarDays, CarFront, Clock3, CreditCard, Banknote, Mail, Phone, UserRound, Users } from "lucide-react";
import RoutePlanner, { type RouteSelection } from "@/components/RoutePlanner";

const EMPTY_ROUTE: RouteSelection = { pickup: null, destination: null, distanceMeters: null, durationSeconds: null };

type PaymentMethod = "STRIPE" | "PAY_DRIVER";

export default function BookingBar() {
  const [tripType, setTripType] = useState<"One way" | "Return">("One way");
  const [routeSelection, setRouteSelection] = useState<RouteSelection>(EMPTY_ROUTE);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("STRIPE");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRouteChange = useCallback((selection: RouteSelection) => {
    setRouteSelection(selection);
    setNotice("");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setNotice("");

    if (!routeSelection.pickup || !routeSelection.destination) {
      setNotice("Select both pickup and destination from the location suggestions.");
      return;
    }
    if (routeSelection.distanceMeters == null || routeSelection.durationSeconds == null) {
      setNotice("Please wait until the driving route has been calculated.");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const customerName = String(data.get("name") ?? "").trim();
    const customerEmail = String(data.get("email") ?? "").trim();
    const customerPhone = String(data.get("phone") ?? "").trim();
    const vehicleName = String(data.get("vehicle") ?? "");
    const passengerCount = Number(data.get("passengers") ?? 1);
    const journeyDate = String(data.get("date") ?? "");
    const journeyTime = String(data.get("time") ?? "");
    const returnDate = tripType === "Return" ? String(data.get("returnDate") ?? "") : "";
    const returnTime = tripType === "Return" ? String(data.get("returnTime") ?? "") : "";

    if (!customerName || !customerPhone || !vehicleName || !journeyDate || !journeyTime) {
      setNotice("Please complete all required booking details.");
      return;
    }
    if (tripType === "Return" && (!returnDate || !returnTime)) {
      setNotice("Please provide the return date and time.");
      return;
    }

    const payload = {
      customerName,
      customerEmail,
      customerPhone,
      pickup: routeSelection.pickup.address,
      destination: routeSelection.destination.address,
      pickupLat: routeSelection.pickup.latitude,
      pickupLng: routeSelection.pickup.longitude,
      destinationLat: routeSelection.destination.latitude,
      destinationLng: routeSelection.destination.longitude,
      distanceMeters: routeSelection.distanceMeters,
      durationSeconds: routeSelection.durationSeconds,
      tripType,
      journeyDate,
      journeyTime,
      returnDate,
      returnTime,
      vehicleName,
      passengerCount,
      serviceType: String(data.get("service") ?? "General Transfer"),
      specialInstructions: specialInstructions.trim(),
      paymentMethod,
    };

    setIsSubmitting(true);
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

      if (paymentMethod === "STRIPE") {
        const checkoutResponse = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: result.reference }),
        });
        const checkout = await checkoutResponse.json();
        if (!checkoutResponse.ok || !checkout.url) {
          setNotice(`${checkout.error || "Could not start checkout."} Your booking reference is ${result.reference}.`);
          return;
        }
        window.location.assign(checkout.url);
        return;
      }

      window.location.assign(`/thank-you?ref=${encodeURIComponent(result.reference)}&payment=driver`);
    } catch (error) {
      console.error("Booking submission failed:", error);
      setNotice("A connection error occurred. If your booking was saved, keep its reference and contact us before submitting again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="booking" className="w-full scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Book Your Ride</h2>
          <p className="mt-1 text-sm text-slate-500">Choose your route, journey details, and payment method.</p>
          <div className="mt-4 inline-flex rounded-xl bg-gray-100 p-1">
            {(["One way", "Return"] as const).map((type) => (
              <button key={type} type="button" onClick={() => setTripType(type)} aria-pressed={tripType === type}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${tripType === type ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
          <RoutePlanner onChange={handleRouteChange} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="journey-date" className="mb-2 block text-sm font-semibold text-slate-700"><CalendarDays className="mr-2 inline h-4 w-4" />Journey date</label>
              <input id="journey-date" name="date" type="date" required min={new Date().toLocaleDateString("en-CA")} className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
            </div>
            <div>
              <label htmlFor="journey-time" className="mb-2 block text-sm font-semibold text-slate-700"><Clock3 className="mr-2 inline h-4 w-4" />Pickup time</label>
              <input id="journey-time" name="time" type="time" required className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
            </div>
            {tripType === "Return" && <>
              <div>
                <label htmlFor="return-date" className="mb-2 block text-sm font-semibold text-slate-700">Return date</label>
                <input id="return-date" name="returnDate" type="date" required min={new Date().toLocaleDateString("en-CA")} className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
              </div>
              <div>
                <label htmlFor="return-time" className="mb-2 block text-sm font-semibold text-slate-700">Return time</label>
                <input id="return-time" name="returnTime" type="time" required className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
              </div>
            </>}
            <div>
              <label htmlFor="vehicle" className="mb-2 block text-sm font-semibold text-slate-700"><CarFront className="mr-2 inline h-4 w-4" />Vehicle</label>
              <select id="vehicle" name="vehicle" required defaultValue="" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm">
                <option value="" disabled>Select a vehicle</option><option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="Luxury">Luxury</option><option value="Minivan">Minivan</option><option value="Minibus">Minibus</option>
              </select>
            </div>
            <div>
              <label htmlFor="passengers" className="mb-2 block text-sm font-semibold text-slate-700"><Users className="mr-2 inline h-4 w-4" />Passengers</label>
              <select id="passengers" name="passengers" defaultValue="1" required className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm">
                {Array.from({ length: 13 }, (_, i) => i + 1).map((count) => <option key={count} value={count}>{count} {count === 1 ? "passenger" : "passengers"}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="service" className="mb-2 block text-sm font-semibold text-slate-700">Service type</label>
              <select id="service" name="service" defaultValue="General Transfer" required className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm">
                <option value="General Transfer">General Transfer</option><option value="Airport Transfer">Airport Transfer</option><option value="Corporate Travel">Corporate Travel</option><option value="Event Transfer">Event Transfer</option><option value="Private Chauffeur">Private Chauffeur</option>
              </select>
            </div>
            <div>
              <label htmlFor="customer-name" className="mb-2 block text-sm font-semibold text-slate-700"><UserRound className="mr-2 inline h-4 w-4" />Full name</label>
              <input id="customer-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name" className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
            </div>
            <div>
              <label htmlFor="customer-email" className="mb-2 block text-sm font-semibold text-slate-700"><Mail className="mr-2 inline h-4 w-4" />Email (optional)</label>
              <input id="customer-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
            </div>
            <div>
              <label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold text-slate-700"><Phone className="mr-2 inline h-4 w-4" />Phone number</label>
              <input id="customer-phone" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={25} placeholder="Your phone number" className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
            </div>
          </div>

          <div>
            <label htmlFor="special-instructions" className="mb-2 block text-sm font-semibold text-slate-700">Special instructions (optional)</label>
            <textarea id="special-instructions" rows={3} maxLength={2000} value={specialInstructions} onChange={(event) => setSpecialInstructions(event.target.value)} placeholder="Luggage details or other requests" className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm" />
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-3 text-base font-bold text-slate-900">Choose payment method</legend>
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${paymentMethod === "STRIPE" ? "border-green-600 bg-green-50" : "border-gray-200"}`}>
              <input type="radio" name="paymentMethod" value="STRIPE" checked={paymentMethod === "STRIPE"} onChange={() => setPaymentMethod("STRIPE")} className="mt-1" />
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0" />
              <span><span className="block font-semibold text-slate-900">Pay online securely</span><span className="mt-1 block text-sm text-slate-600">Stripe Checkout — eligible cards, Apple Pay and Google Pay. Methods depend on your device and Stripe account settings.</span></span>
            </label>
            <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${paymentMethod === "PAY_DRIVER" ? "border-green-600 bg-green-50" : "border-gray-200"}`}>
              <input type="radio" name="paymentMethod" value="PAY_DRIVER" checked={paymentMethod === "PAY_DRIVER"} onChange={() => setPaymentMethod("PAY_DRIVER")} className="mt-1" />
              <Banknote className="mt-0.5 h-5 w-5 shrink-0" />
              <span><span className="block font-semibold text-slate-900">Pay the driver directly</span><span className="mt-1 block text-sm text-slate-600">Pay offline to the driver. Your booking will remain unpaid until the admin confirms receipt.</span></span>
            </label>
          </fieldset>

          {notice && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{notice}</div>}

          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Processing booking..." : paymentMethod === "STRIPE" ? "Continue to secure payment" : "Book now — pay driver"}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="text-xs leading-5 text-slate-500">The fare is calculated on the server using the selected driving route. Return bookings are charged as two trips over the same route. Final fares should reflect your published pricing policy.</p>
        </form>
      </div>
    </section>
  );
}
