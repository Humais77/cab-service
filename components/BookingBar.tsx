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
  CreditCard,
  Mail,
  Phone,
  SlidersHorizontal,
  UserRound,
  Users,
  Clock3,
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

type BookingVehicle = {
  id: number;
  name: string;
  capacity: number;
};

type BookingService = {
  id: number;
  name: string;
};

const TODAY_ISO = new Date().toLocaleDateString("en-CA");

function formatAUD(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

const RoutePlanner = dynamic(() => import("@/components/RoutePlanner"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-[74px] rounded-xl bg-slate-100" />
        <div className="h-[74px] rounded-xl bg-slate-100" />
      </div>
      <div className="h-10 rounded-xl bg-slate-100" />
    </div>
  ),
});

const inputClass =
  "w-full min-h-[48px] rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-slate-100";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

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
  const [vehicleOptions, setVehicleOptions] = useState<BookingVehicle[]>([]);
  const [serviceOptions, setServiceOptions] = useState<BookingService[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [passengerCount, setPassengerCount] = useState("1");

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

  const selectedVehicle = vehicleOptions.find(
    (item) => item.name === vehicle,
  );

  const maxPassengers = selectedVehicle?.capacity ?? 0;

  // Update the estimate when the route, vehicle, or trip type changes.
  useEffect(() => {
    const { distanceMeters, durationSeconds } = routeSelection;

    if (distanceMeters == null || durationSeconds == null || !vehicle) {
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

  // Load available vehicles and services.
  useEffect(() => {
    let cancelled = false;

    async function loadBookingOptions() {
      try {
        const response = await fetch("/api/booking-options", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load vehicles and services.",
          );
        }

        if (!cancelled) {
          setVehicleOptions(result.vehicles ?? []);
          setServiceOptions(result.services ?? []);
          setOptionsError("");
        }
      } catch (error) {
        if (!cancelled) {
          setOptionsError(
            error instanceof Error
              ? error.message
              : "Unable to load booking options.",
          );
        }
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    }

    void loadBookingOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedVehicle) return;

    setPassengerCount((current) =>
      Number(current) > selectedVehicle.capacity
        ? String(selectedVehicle.capacity)
        : current,
    );
  }, [selectedVehicle]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setNotice("");

    if (!routeSelection.pickup || !routeSelection.destination) {
      setNotice(
        "Select both pickup and destination from the location suggestions.",
      );
      return;
    }

    if (
      routeSelection.distanceMeters == null ||
      routeSelection.durationSeconds == null
    ) {
      setNotice("Please wait until the driving route has been calculated.");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);

    const customerName = String(data.get("name") ?? "").trim();
    const customerEmail = String(data.get("email") ?? "").trim();
    const customerPhone = String(data.get("phone") ?? "").trim();
    const vehicleName = String(data.get("vehicle") ?? "");
    const passengers = Number(passengerCount);
    const journeyDate = String(data.get("date") ?? "");
    const journeyTime = String(data.get("time") ?? "");
    const returnDate =
      tripType === "Return" ? String(data.get("returnDate") ?? "") : "";
    const returnTime =
      tripType === "Return" ? String(data.get("returnTime") ?? "") : "";

    if (
      !customerName ||
      !customerPhone ||
      !vehicleName ||
      !journeyDate ||
      !journeyTime
    ) {
      setShowOptions(true);
      setNotice(
        "Please complete the required booking details in View options.",
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

    if (
      customerEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      setShowOptions(true);
      setNotice("Please enter a valid email address.");
      return;
    }

    if (
      !selectedVehicle ||
      !selectedVehicle.capacity ||
      passengers < 1 ||
      passengers > selectedVehicle.capacity
    ) {
      setShowOptions(true);
      setNotice("Please select a valid vehicle and passenger count.");
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
      passengerCount: passengers,
      serviceType: String(data.get("service") || "General Transfer"),
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
            `${checkout.error || "Could not start checkout."} Your booking reference is ${result.reference}.`,
          );
          return;
        }

        window.location.assign(checkout.url);
        return;
      }

      window.location.assign(
        `/thank-you?ref=${encodeURIComponent(result.reference)}&payment=driver`,
      );
    } catch (error) {
      console.error("Booking submission failed:", error);

      setNotice(
        "A connection error occurred. If your booking was saved, keep its reference and contact us before submitting again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="booking"
      className="relative z-20 -mt-24 w-full scroll-mt-24 px-4 pb-12 sm:-mt-28 sm:px-6 sm:pb-16 lg:-mt-32 lg:px-8"
    >
      <div className="mx-auto max-w-[1320px] overflow-visible rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:rounded-3xl">
        {/* Header */}
        <div className="border-b border-slate-200 px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-green-800 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                AVAILABLE 24/7
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Book your ride
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Where to? Choose your route and travel time.
              </p>
            </div>

            {/* Trip type */}
            <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 p-1">
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
                      ? "bg-[#1674e8] text-white shadow-md"
                      : "text-slate-700 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-5 sm:space-y-7 sm:p-8 lg:p-9"
        >
          {/* Main booking fields */}
          <RoutePlanner onChange={handleRouteChange} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="journey-date" className={labelClass}>
                <CalendarDays className="mr-2 inline h-4 w-4 text-blue-600" />
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
                <Clock3 className="mr-2 inline h-4 w-4 text-blue-600" />
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

          {/* Return details */}
          {tripType === "Return" && (
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <div>
                <label htmlFor="return-date" className={labelClass}>
                  <CalendarDays className="mr-2 inline h-4 w-4 text-slate-600" />
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
                  <Clock3 className="mr-2 inline h-4 w-4 text-slate-600" />
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
            className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-500/15"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 transition group-hover:bg-blue-100">
                <SlidersHorizontal className="h-4 w-4" />
              </span>

              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {showOptions ? "Hide options" : "View options"}
                </span>

                <span className="mt-0.5 block text-xs text-slate-600">
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
              className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:space-y-7 sm:p-6"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Your ride details
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                  Tell us which vehicle you need and how to contact you.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="vehicle" className={labelClass}>
                    <CarFront className="mr-2 inline h-4 w-4 text-blue-600" />
                    Vehicle
                  </label>

                  <select
                    id="vehicle"
                    name="vehicle"
                    required={showOptions}
                    value={vehicle}
                    onChange={(event) => setVehicle(event.target.value)}
                    disabled={optionsLoading || vehicleOptions.length === 0}
                    className={inputClass}
                  >
                    <option value="">
                      {optionsLoading
                        ? "Loading vehicles..."
                        : vehicleOptions.length
                          ? "Select a vehicle"
                          : "No vehicles available"}
                    </option>

                    {vehicleOptions.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name} — up to {item.capacity} passengers
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="passengers" className={labelClass}>
                    <Users className="mr-2 inline h-4 w-4 text-blue-600" />
                    Passengers
                  </label>

                  <select
                    id="passengers"
                    name="passengers"
                    value={passengerCount}
                    onChange={(event) => setPassengerCount(event.target.value)}
                    required={showOptions}
                    disabled={!selectedVehicle}
                    className={inputClass}
                  >
                    {Array.from(
                      { length: maxPassengers },
                      (_, index) => index + 1,
                    ).map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? "passenger" : "passengers"}
                      </option>
                    ))}
                  </select>

                  {selectedVehicle && (
                    <p className="mt-1 text-xs text-slate-600">
                      Maximum capacity: {selectedVehicle.capacity} passengers
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="service" className={labelClass}>
                    Service type
                  </label>

                  <select
                    id="service"
                    name="service"
                    defaultValue=""
                    className={inputClass}
                    disabled={optionsLoading || serviceOptions.length === 0}
                  >
                    <option value="" disabled>
                      {optionsLoading
                        ? "Loading services..."
                        : serviceOptions.length
                          ? "Select a service"
                          : "No services available"}
                    </option>

                    {serviceOptions.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="customer-name" className={labelClass}>
                    <UserRound className="mr-2 inline h-4 w-4 text-blue-600" />
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
                    <Mail className="mr-2 inline h-4 w-4 text-blue-600" />
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
                    <Phone className="mr-2 inline h-4 w-4 text-blue-600" />
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
                <label htmlFor="special-instructions" className={labelClass}>
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
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAY_DRIVER"
                    checked={paymentMethod === "PAY_DRIVER"}
                    onChange={() => setPaymentMethod("PAY_DRIVER")}
                    className="mt-1 accent-blue-600"
                  />

                  <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">
                      Pay in the cab
                    </span>

                    <span className="mt-1 block text-sm leading-5 text-slate-700">
                      Pay your driver by card or cash at the end of the trip.
                      Your booking stays unpaid until the driver confirms
                      receipt.
                    </span>
                  </span>

                  {paymentMethod === "PAY_DRIVER" && (
                    <Check className="h-5 w-5 shrink-0 text-blue-700" />
                  )}
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "STRIPE"
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="STRIPE"
                    checked={paymentMethod === "STRIPE"}
                    onChange={() => setPaymentMethod("STRIPE")}
                    className="mt-1 accent-blue-600"
                  />

                  <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">
                      Pay online securely
                    </span>

                    <span className="mt-1 block text-sm leading-5 text-slate-700">
                      Stripe Checkout. Available payment methods depend on
                      your device and Stripe account settings.
                    </span>
                  </span>

                  {paymentMethod === "STRIPE" && (
                    <Check className="h-5 w-5 shrink-0 text-blue-700" />
                  )}
                </label>
              </fieldset>
            </div>
          )}

          {/* Fare estimate */}
          {(estimate.cents != null ||
            estimate.loading ||
            estimate.error) && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
                    Estimated fare
                  </p>

                  {estimate.loading && (
                    <p className="mt-1 text-sm text-slate-700">
                      Calculating fare…
                    </p>
                  )}

                  {estimate.error && (
                    <p className="mt-1 text-sm text-red-700">
                      {estimate.error}
                    </p>
                  )}

                  {estimate.cents != null && !estimate.loading && (
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {formatAUD(estimate.cents)}
                    </p>
                  )}
                </div>

                <p className="max-w-[220px] text-xs leading-5 text-slate-600">
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

          {optionsError && (
            <p role="alert" className="text-sm text-red-700">
              {optionsError} Please refresh the page and try again.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#1674e8] px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition duration-200 hover:bg-[#0863d2] focus:outline-none focus:ring-4 focus:ring-blue-400/30 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-16 sm:text-base"
          >
            {isSubmitting
              ? "Processing booking..."
              : paymentMethod === "STRIPE"
                ? "Continue to secure payment"
                : "Book now — pay in the cab"}

            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="text-center text-xs leading-5 text-slate-600">
            Your fare is calculated using the selected driving route. Return
            bookings are charged as two trips over the same route. Tolls,
            waiting time and extras may be added.
          </p>
        </form>
      </div>
    </section>
  );
}
