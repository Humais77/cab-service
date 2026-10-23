"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  CreditCard,
  Mail,
  Phone,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import type { RouteSelection } from "@/components/RoutePlanner";
import dynamic from "next/dynamic";
const EMPTY_ROUTE: RouteSelection = {
  pickup: null,
  destination: null,
  distanceMeters: null,
  durationSeconds: null,
};

type PaymentMethod = "STRIPE" | "PAY_DRIVER";

const TODAY_ISO = new Date().toLocaleDateString("en-CA");

function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
const RoutePlanner = dynamic(
  () => import("@/components/RoutePlanner"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-[74px] rounded-xl bg-slate-100" />
          <div className="h-[74px] rounded-xl bg-slate-100" />
        </div>

        <div className="h-10 rounded-xl bg-slate-100" />
      </div>
    ),
  }
);
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-green-600 focus:ring-4 focus:ring-green-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

export default function BookingBar() {
  const [tripType, setTripType] = useState<"One way" | "Return">("One way");
  const [routeSelection, setRouteSelection] =
    useState<RouteSelection>(EMPTY_ROUTE);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("PAY_DRIVER");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [estimate, setEstimate] = useState<{
    loading: boolean;
    cents: number | null;
    error: string | null;
  }>({
    loading: false,
    cents: null,
    error: null,
  });

  const handleRouteChange = useCallback((selection: RouteSelection) => {
    setRouteSelection(selection);
    setNotice("");
  }, []);

  // Update the estimate when the route, vehicle, or trip type changes.
  useEffect(() => {
    const { distanceMeters, durationSeconds } = routeSelection;

    if (
      distanceMeters == null ||
      durationSeconds == null ||
      !vehicle
    ) {
      setEstimate({
        loading: false,
        cents: null,
        error: null,
      });

      return;
    }

    let cancelled = false;

    setEstimate({
      loading: true,
      cents: null,
      error: null,
    });

    (async () => {
      try {
        const response = await fetch("/api/quotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            distanceMeters,
            durationSeconds,
            vehicleName: vehicle,
            tripType,
          }),
        });

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok || typeof result.fareCents !== "number") {
          setEstimate({
            loading: false,
            cents: null,
            error: result.error || "Could not calculate fare.",
          });

          return;
        }

        setEstimate({
          loading: false,
          cents: result.fareCents,
          error: null,
        });
      } catch {
        if (!cancelled) {
          setEstimate({
            loading: false,
            cents: null,
            error: "Could not calculate fare.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [routeSelection, vehicle, tripType]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setNotice("");

    if (!routeSelection.pickup || !routeSelection.destination) {
      setNotice(
        "Select both pickup and destination from the location suggestions."
      );
      return;
    }

    if (
      routeSelection.distanceMeters == null ||
      routeSelection.durationSeconds == null
    ) {
      setNotice(
        "Please wait until the driving route has been calculated."
      );
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
    const returnDate =
      tripType === "Return" ? String(data.get("returnDate") ?? "") : "";
    const returnTime =
      tripType === "Return" ? String(data.get("returnTime") ?? "") : "";

    // Reveal advanced fields when required information is missing.
    if (
      !customerName ||
      !customerPhone ||
      !vehicleName ||
      !journeyDate ||
      !journeyTime
    ) {
      setShowOptions(true);
      setNotice(
        "Please complete the required booking details in View options."
      );
      return;
    }

    if (customerName.length < 2) {
      setShowOptions(true);
      setNotice("Please enter your full name.");
      return;
    }

    if (customerPhone.length < 7) {
      setShowOptions(true);
      setNotice("Please enter a valid phone number.");
      return;
    }

    if (tripType === "Return" && (!returnDate || !returnTime)) {
      setNotice("Please provide the return date and time.");
      return;
    }

    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setShowOptions(true);
      setNotice("Please enter a valid email address.");
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
        headers: {
          "Content-Type": "application/json",
        },
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference: result.reference,
          }),
        });

        const checkout = await checkoutResponse.json();

        if (!checkoutResponse.ok || !checkout.url) {
          setNotice(
            `${checkout.error || "Could not start checkout."} Your booking reference is ${result.reference}.`
          );
          return;
        }

        window.location.assign(checkout.url);
        return;
      }

      window.location.assign(
        `/thank-you?ref=${encodeURIComponent(result.reference)}&payment=driver`
      );
    } catch (error) {
      console.error("Booking submission failed:", error);

      setNotice(
        "A connection error occurred. If your booking was saved, keep its reference and contact us before submitting again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="booking"
      className="w-full scroll-mt-24 px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="mx-auto max-w-6xl overflow-visible rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        {/* Header */}
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                AVAILABLE 24/7
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Book your ride
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Where to? Choose your route and travel time.
              </p>
            </div>

            {/* Trip type */}
            <div className="inline-flex w-fit rounded-xl bg-slate-100 p-1">
              {(["One way", "Return"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setTripType(type);
                    setNotice("");
                  }}
                  aria-pressed={tripType === type}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    tripType === type
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
          {/* Main booking fields: pickup, destination, date and time */}
          <RoutePlanner onChange={handleRouteChange} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="journey-date" className={labelClass}>
                <CalendarDays className="mr-2 inline h-4 w-4 text-green-700" />
                Journey date
              </label>

              <input
                id="journey-date"
                name="date"
                type="date"
                required
                min={TODAY_ISO}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="journey-time" className={labelClass}>
                <Clock3 className="mr-2 inline h-4 w-4 text-green-700" />
                Pickup time
              </label>

              <input
                id="journey-time"
                name="time"
                type="time"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Return details only appear for a return trip */}
          {tripType === "Return" && (
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
              <div>
                <label htmlFor="return-date" className={labelClass}>
                  <CalendarDays className="mr-2 inline h-4 w-4 text-slate-500" />
                  Return date
                </label>

                <input
                  id="return-date"
                  name="returnDate"
                  type="date"
                  required
                  min={TODAY_ISO}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="return-time" className={labelClass}>
                  <Clock3 className="mr-2 inline h-4 w-4 text-slate-500" />
                  Return time
                </label>

                <input
                  id="return-time"
                  name="returnTime"
                  type="time"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Advanced options toggle */}
          <button
            type="button"
            onClick={() => setShowOptions((current) => !current)}
            aria-expanded={showOptions}
            aria-controls="booking-options"
            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-left transition hover:border-green-300 hover:bg-green-50/60 focus:outline-none focus:ring-4 focus:ring-green-100"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition group-hover:text-green-700">
                <SlidersHorizontal className="h-4 w-4" />
              </span>

              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {showOptions ? "Hide options" : "View options"}
                </span>

                <span className="mt-0.5 block text-xs text-slate-500">
                  Vehicle, passenger details and payment
                </span>
              </span>
            </span>

            {showOptions ? (
              <ChevronUp className="h-5 w-5 shrink-0 text-slate-500" />
            ) : (
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
            )}
          </button>

          {/* Advanced fields */}
          {showOptions && (
            <div
              id="booking-options"
              className="space-y-6 rounded-xl border border-slate-200 p-4 sm:p-5"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Your ride details
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Tell us which vehicle you need and how to contact you.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="vehicle" className={labelClass}>
                    <CarFront className="mr-2 inline h-4 w-4 text-green-700" />
                    Vehicle
                  </label>

                  <select
                    id="vehicle"
                    name="vehicle"
                    required={showOptions}
                    value={vehicle}
                    onChange={(event) => setVehicle(event.target.value)}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select a vehicle
                    </option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Minibus">Minibus</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="passengers" className={labelClass}>
                    <Users className="mr-2 inline h-4 w-4 text-green-700" />
                    Passengers
                  </label>

                  <select
                    id="passengers"
                    name="passengers"
                    defaultValue="1"
                    required={showOptions}
                    className={inputClass}
                  >
                    {Array.from({ length: 13 }, (_, index) => index + 1).map(
                      (count) => (
                        <option key={count} value={count}>
                          {count} {count === 1 ? "passenger" : "passengers"}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="service" className={labelClass}>
                    Service type
                  </label>

                  <select
                    id="service"
                    name="service"
                    defaultValue="General Transfer"
                    className={inputClass}
                  >
                    <option value="General Transfer">General Transfer</option>
                    <option value="Airport Transfer">Airport Transfer</option>
                    <option value="Corporate Travel">Corporate Travel</option>
                    <option value="Event Transfer">Event Transfer</option>
                    <option value="On Demand">On Demand</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="customer-name" className={labelClass}>
                    <UserRound className="mr-2 inline h-4 w-4 text-green-700" />
                    Full name
                  </label>

                  <input
                    id="customer-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={showOptions}
                    minLength={2}
                    maxLength={100}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="customer-email" className={labelClass}>
                    <Mail className="mr-2 inline h-4 w-4 text-green-700" />
                    Email (optional)
                  </label>

                  <input
                    id="customer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="customer-phone" className={labelClass}>
                    <Phone className="mr-2 inline h-4 w-4 text-green-700" />
                    Phone number
                  </label>

                  <input
                    id="customer-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required={showOptions}
                    minLength={7}
                    maxLength={25}
                    placeholder="Your phone number"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="special-instructions"
                  className={labelClass}
                >
                  Special instructions (optional)
                </label>

                <textarea
                  id="special-instructions"
                  name="specialInstructions"
                  rows={3}
                  maxLength={2000}
                  value={specialInstructions}
                  onChange={(event) =>
                    setSpecialInstructions(event.target.value)
                  }
                  placeholder="Luggage details or other requests"
                  className={`${inputClass} resize-y`}
                />
              </div>

              <fieldset className="space-y-3">
                <legend className="mb-3 text-base font-bold text-slate-900">
                  Choose payment method
                </legend>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "PAY_DRIVER"
                      ? "border-green-600 bg-green-50/70"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAY_DRIVER"
                    checked={paymentMethod === "PAY_DRIVER"}
                    onChange={() => setPaymentMethod("PAY_DRIVER")}
                    className="mt-1 accent-green-600"
                  />

                  <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">
                      Pay in the cab
                    </span>

                    <span className="mt-1 block text-sm leading-5 text-slate-600">
                      Pay your driver by card or cash at the end of the trip.
                      Your booking stays unpaid until the driver confirms
                      receipt.
                    </span>
                  </span>

                  {paymentMethod === "PAY_DRIVER" && (
                    <Check className="h-5 w-5 shrink-0 text-green-700" />
                  )}
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "STRIPE"
                      ? "border-green-600 bg-green-50/70"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="STRIPE"
                    checked={paymentMethod === "STRIPE"}
                    onChange={() => setPaymentMethod("STRIPE")}
                    className="mt-1 accent-green-600"
                  />

                  <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">
                      Pay online securely
                    </span>

                    <span className="mt-1 block text-sm leading-5 text-slate-600">
                      Stripe Checkout. Available payment methods depend on
                      your device and Stripe account settings.
                    </span>
                  </span>

                  {paymentMethod === "STRIPE" && (
                    <Check className="h-5 w-5 shrink-0 text-green-700" />
                  )}
                </label>
              </fieldset>
            </div>
          )}

          {/* Fare estimate */}
          {(estimate.cents != null ||
            estimate.loading ||
            estimate.error) && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Estimated fare
                  </p>

                  {estimate.loading && (
                    <p className="mt-1 text-sm text-slate-600">
                      Calculating fare…
                    </p>
                  )}

                  {estimate.error && (
                    <p className="mt-1 text-sm text-red-600">
                      {estimate.error}
                    </p>
                  )}

                  {estimate.cents != null && !estimate.loading && (
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {formatAUD(estimate.cents)}
                    </p>
                  )}
                </div>

                <p className="max-w-[220px] text-xs leading-5 text-slate-500">
                  Final fare may vary with tolls, waiting time and extras.
                </p>
              </div>
            </div>
          )}

          {/* Feedback */}
          {notice && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {notice}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Processing booking..."
              : paymentMethod === "STRIPE"
                ? "Continue to secure payment"
                : "Book now — pay in the cab"}

            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="text-center text-xs leading-5 text-slate-500">
            Your fare is calculated using the selected driving route. Return
            bookings are charged as two trips over the same route. Tolls,
            waiting time and extras may be added.
          </p>
        </form>
      </div>
    </section>
  );
}