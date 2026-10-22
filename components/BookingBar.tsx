"use client";

import dynamic from "next/dynamic";
import { FormEvent, useCallback, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  ChevronDown,
  Clock3,
  Mail,
  Phone,
  SlidersHorizontal,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { RouteSelection } from "@/components/RoutePlanner";

const RoutePlanner = dynamic(
  () => import("@/components/RoutePlanner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-40 items-center justify-center rounded-xl border border-gray-200 text-sm text-slate-500">
        Loading map…
      </div>
    ),
  }
);

const EMPTY_ROUTE: RouteSelection = {
  pickup: null,
  destination: null,
  distanceMeters: null,
  durationSeconds: null,
};

export default function BookingBar() {
  const [tripType, setTripType] = useState<"One way" | "Return">("One way");
  const [notice, setNotice] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [routeSelection, setRouteSelection] =
    useState<RouteSelection>(EMPTY_ROUTE);

  const handleRouteChange = useCallback((selection: RouteSelection) => {
    setRouteSelection(selection);
    setNotice("");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!routeSelection.pickup || !routeSelection.destination) {
      setNotice("Please select both pickup and destination from the location suggestions.");
      return;
    }

    if (
      routeSelection.distanceMeters === null ||
      routeSelection.durationSeconds === null
    ) {
      setNotice("Your route is still being calculated. Please wait a moment and try again.");
      return;
    }

    const customerName = String(data.get("name") ?? "").trim();
    const customerEmail = String(data.get("email") ?? "").trim();
    const customerPhone = String(data.get("phone") ?? "").trim();
    const vehicleName = String(data.get("vehicle") ?? "").trim();
    const passengerCount = Number(data.get("passengers") ?? 1);
    const serviceType = String(data.get("service") ?? "General Transfer").trim();

    if (!customerName || !customerPhone || !vehicleName) {
      setShowOptions(true);
      setNotice("Please complete your name, phone number, and vehicle selection before booking.");
      return;
    }

    if (
      customerName.length < 2 ||
      customerPhone.length < 7 ||
      !Number.isInteger(passengerCount) ||
      passengerCount < 1 ||
      passengerCount > 13
    ) {
      setShowOptions(true);
      setNotice("Please check your contact details and passenger count.");
      return;
    }

    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setShowOptions(true);
      setNotice("Please enter a valid email address.");
      return;
    }

    const journeyDate = String(data.get("date") ?? "");
    const journeyTime = String(data.get("time") ?? "");
    const returnDate = tripType === "Return" ? String(data.get("returnDate") ?? "") : "";
    const returnTime = tripType === "Return" ? String(data.get("returnTime") ?? "") : "";

    if (!journeyDate || !journeyTime) {
      setNotice("Please select your journey date and pickup time.");
      return;
    }

    if (tripType === "Return" && (!returnDate || !returnTime)) {
      setShowOptions(true);
      setNotice("Please select your return date and return time.");
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
      // Server recalculates these; do not use them as trusted values.
      distanceMeters: routeSelection.distanceMeters,
      durationSeconds: routeSelection.durationSeconds,
      tripType,
      journeyDate,
      journeyTime,
      returnDate,
      returnTime,
      vehicleName,
      passengerCount,
      serviceType,
      specialInstructions: specialInstructions.trim(),
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
        setNotice(result.error || "Unable to submit your booking. Please try again.");
        return;
      }

      if (!result.reference) {
        setNotice("Your booking was submitted, but no reference was returned. Please contact us before submitting again.");
        return;
      }

      window.location.assign(`/thank-you?ref=${encodeURIComponent(result.reference)}`);
    } catch (error) {
      console.error("Booking submission failed:", error);
      setNotice("A connection error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="booking" className="w-full scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Book Your Ride</h2>
            <p className="mt-1 text-sm text-slate-500">Choose your locations and journey details.</p>
          </div>

          <div className="inline-flex w-fit rounded-xl bg-gray-100 p-1">
            {(["One way", "Return"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setTripType(type);
                  setNotice("");
                }}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  tripType === type ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
                aria-pressed={tripType === type}
              >
                {type === "Return" ? "By the hour" : "One way"}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
          <RoutePlanner onChange={handleRouteChange} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="journey-date" className="mb-2 block text-sm font-semibold text-slate-700">
                <CalendarDays className="mr-2 inline-block h-4 w-4" />
                Journey date
              </label>
              <input
                id="journey-date"
                name="date"
                type="date"
                required
                min={new Date().toLocaleDateString("en-CA")}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label htmlFor="journey-time" className="mb-2 block text-sm font-semibold text-slate-700">
                <Clock3 className="mr-2 inline-block h-4 w-4" />
                Pickup time
              </label>
              <input
                id="journey-time"
                name="time"
                type="time"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setShowOptions((current) => !current)}
                aria-expanded={showOptions}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-green-600 hover:text-green-700"
              >
                {showOptions ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
                {showOptions ? "Hide options" : "View options"}
                {!showOptions && <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Book Now"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {showOptions && (
            <div className="space-y-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
              <div>
                <h3 className="font-bold text-slate-900">Booking and passenger details</h3>
                <p className="mt-1 text-sm text-slate-500">Complete these details to submit your booking.</p>
              </div>

              {tripType === "Return" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="return-date" className="mb-2 block text-sm font-semibold text-slate-700">Return date</label>
                    <input
                      id="return-date"
                      name="returnDate"
                      type="date"
                      required
                      min={new Date().toLocaleDateString("en-CA")}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="return-time" className="mb-2 block text-sm font-semibold text-slate-700">Return time</label>
                    <input
                      id="return-time"
                      name="returnTime"
                      type="time"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="vehicle" className="mb-2 block text-sm font-semibold text-slate-700">
                    <CarFront className="mr-2 inline-block h-4 w-4" /> Vehicle
                  </label>
                  <select id="vehicle" name="vehicle" required defaultValue="" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                    <option value="" disabled>Select a vehicle</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Minibus">Minibus</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="passengers" className="mb-2 block text-sm font-semibold text-slate-700">
                    <Users className="mr-2 inline-block h-4 w-4" /> Passengers
                  </label>
                  <select id="passengers" name="passengers" defaultValue="1" required className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                    {Array.from({ length: 13 }, (_, index) => index + 1).map((count) => (
                      <option key={count} value={count}>{count} {count === 1 ? "passenger" : "passengers"}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="service" className="mb-2 block text-sm font-semibold text-slate-700">Service type</label>
                  <select id="service" name="service" defaultValue="General Transfer" required className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                    <option value="General Transfer">General Transfer</option>
                    <option value="Airport Transfer">Airport Transfer</option>
                    <option value="Corporate Travel">Corporate Travel</option>
                    <option value="Event Transfer">Event Transfer</option>
                    <option value="Private Chauffeur">Private Chauffeur</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="customer-name" className="mb-2 block text-sm font-semibold text-slate-700">
                    <UserRound className="mr-2 inline-block h-4 w-4" /> Full name
                  </label>
                  <input id="customer-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                </div>

                <div>
                  <label htmlFor="customer-email" className="mb-2 block text-sm font-semibold text-slate-700">
                    <Mail className="mr-2 inline-block h-4 w-4" /> Email address (optional)
                  </label>
                  <input id="customer-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                </div>

                <div>
                  <label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold text-slate-700">
                    <Phone className="mr-2 inline-block h-4 w-4" /> Phone number
                  </label>
                  <input id="customer-phone" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={25} placeholder="Your phone number" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                </div>
              </div>

              <div>
                <label htmlFor="special-instructions" className="mb-2 block text-sm font-semibold text-slate-700">Special instructions (optional)</label>
                <textarea
                  id="special-instructions"
                  name="specialInstructions"
                  rows={3}
                  maxLength={2000}
                  value={specialInstructions}
                  onChange={(event) => setSpecialInstructions(event.target.value)}
                  placeholder="Luggage details, child seats, accessibility needs, or other requests"
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          )}

          {notice && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {notice}
            </div>
          )}

          <p className="text-xs leading-5 text-slate-500">
            Route distance and duration are estimates calculated from road data. Actual travel time may vary with traffic and road conditions.
          </p>
        </form>
      </div>
    </section>
  );
}
