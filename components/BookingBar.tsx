
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

const RoutePlanner = dynamic(
  () => import("@/components/RoutePlanner"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse grid grid-cols-2 gap-3">
        <div className="h-12 rounded-lg bg-slate-100" />
        <div className="h-12 rounded-lg bg-slate-100" />
      </div>
    ),
  }
);

const inputClass =
  "w-full min-w-0 min-h-[48px] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 disabled:bg-slate-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-800 sm:text-sm";

export default function BookingBar() {
  const [tripType, setTripType] =
    useState<"One way" | "Return">("One way");

  const [routeSelection, setRouteSelection] =
    useState<RouteSelection>(EMPTY_ROUTE);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("PAY_DRIVER");

  const [specialInstructions, setSpecialInstructions] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [vehicleOptions, setVehicleOptions] =
    useState<BookingVehicle[]>([]);

  const [serviceOptions, setServiceOptions] =
    useState<BookingService[]>([]);

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

  const handleRouteChange = useCallback(
    (selection: RouteSelection) => {
      setRouteSelection(selection);
      setNotice("");
    },
    []
  );

  const selectedVehicle = vehicleOptions.find(
    (item) => item.name === vehicle
  );

  const isParcelDelivery =
    selectedVehicle?.name.trim().toLowerCase() ===
    "parcel delivery";

  const maxPassengers = selectedVehicle?.capacity ?? 0;

  // Fare estimation
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

  // Load vehicles and services
  useEffect(() => {
    let cancelled = false;

    async function loadBookingOptions() {
      try {
        const response = await fetch(
          "/api/booking-options",
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
            "Unable to load vehicles and services."
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
              : "Unable to load booking options."
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

  // Passenger count validation
  useEffect(() => {
    if (!selectedVehicle) {
      setPassengerCount("1");
      return;
    }

    if (
      selectedVehicle.name.trim().toLowerCase() ===
      "parcel delivery"
    ) {
      setPassengerCount("0");
      return;
    }

    setPassengerCount((current) => {
      const count = Number(current);

      if (count < 1 || count > selectedVehicle.capacity) {
        return "1";
      }

      return current;
    });
  }, [selectedVehicle]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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
    const passengers = Number(passengerCount);
    const journeyDate = String(data.get("date") ?? "");
    const journeyTime = String(data.get("time") ?? "");

    const returnDate =
      tripType === "Return"
        ? String(data.get("returnDate") ?? "")
        : "";

    const returnTime =
      tripType === "Return"
        ? String(data.get("returnTime") ?? "")
        : "";

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

    if (
      customerEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      setShowOptions(true);
      setNotice("Please enter a valid email address.");
      return;
    }

    if (!selectedVehicle) {
      setShowOptions(true);
      setNotice("Please select a valid vehicle.");
      return;
    }

    if (isParcelDelivery) {
      if (passengers !== 0) {
        setShowOptions(true);
        setNotice("Parcel Delivery does not allow passengers.");
        return;
      }
    } else if (
      passengers < 1 ||
      passengers > selectedVehicle.capacity
    ) {
      setShowOptions(true);
      setNotice("Please select a valid passenger count.");
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
      serviceType: String(
        data.get("service") || "General Transfer"
      ),
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
        setNotice(
          result.error || "Unable to submit your booking."
        );
        return;
      }

      if (paymentMethod === "STRIPE") {
        const checkoutResponse = await fetch(
          "/api/payments/checkout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reference: result.reference,
            }),
          }
        );

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
        `/thank-you?ref=${encodeURIComponent(
          result.reference
        )}&payment=driver`
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
      className="w-full scroll-mt-6"
    >
      <div className="overflow-visible rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:rounded-3xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-3 p-3 sm:space-y-4 sm:p-5 lg:p-6"
        >
          {/* Trip type */}
          <div className="flex justify-center">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
              {(["One way", "Return"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setTripType(type);
                    setNotice("");
                  }}
                  aria-pressed={tripType === type}
                  className={`min-w-28 rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                    tripType === type
                      ? "bg-[#1674e8] text-white shadow-sm"
                      : "text-slate-700 hover:bg-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Route fields, date/time fields and map controls */}
          <RoutePlanner onChange={handleRouteChange}>
            {/* Journey date and pickup time */}
            <div className="grid grid-cols-2 gap-2 pt-1 sm:gap-4">
              <div className="min-w-0">
                <label htmlFor="journey-date" className={labelClass}>
                  <CalendarDays className="mr-1 inline h-4 w-4 text-blue-600" />
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

              <div className="min-w-0">
                <label htmlFor="journey-time" className={labelClass}>
                  <Clock3 className="mr-1 inline h-4 w-4 text-blue-600" />
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
          </RoutePlanner>

          {/* View options button */}
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => setShowOptions((current) => !current)}
              aria-expanded={showOptions}
              aria-controls="booking-options"
              className="inline-flex min-h-12 min-w-48 items-center justify-center gap-2 rounded-xl bg-[#1674e8] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/15 transition hover:bg-[#0863d2] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              {showOptions ? "Hide options" : "View options"}
              {showOptions ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Advanced options */}
          {showOptions && (
            <div
              id="booking-options"
              className="space-y-5 border-t border-slate-200 pt-5"
            >
              {/* Return journey details */}
              {tripType === "Return" && (
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="return-date" className={labelClass}>
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

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Additional booking details
                </h3>
              </div>

              {/* Vehicle, passenger and service */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="vehicle" className={labelClass}>
                    <CarFront className="mr-1 inline h-4 w-4 text-blue-600" />
                    Vehicle
                  </label>
                  <select
                    id="vehicle"
                    name="vehicle"
                    required
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
                        {item.name} —{" "}
                        {item.name.trim().toLowerCase() === "parcel delivery"
                          ? "Fits in a car"
                          : `Up to ${item.capacity} passengers`}
                      </option>
                    ))}
                  </select>
                </div>

                {!isParcelDelivery && (
                  <div>
                    <label htmlFor="passengers" className={labelClass}>
                      <Users className="mr-1 inline h-4 w-4 text-blue-600" />
                      Passengers
                    </label>
                    <select
                      id="passengers"
                      name="passengers"
                      value={passengerCount}
                      onChange={(event) => setPassengerCount(event.target.value)}
                      required
                      disabled={!selectedVehicle}
                      className={inputClass}
                    >
                      {Array.from(
                        { length: maxPassengers },
                        (_, index) => index + 1
                      ).map((count) => (
                        <option key={count} value={count}>
                          {count} {count === 1 ? "passenger" : "passengers"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
                      {optionsLoading ? "Loading services..." : "Select a service"}
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
                    <UserRound className="mr-1 inline h-4 w-4 text-blue-600" />
                    Full name
                  </label>
                  <input
                    id="customer-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="customer-email" className={labelClass}>
                    <Mail className="mr-1 inline h-4 w-4 text-blue-600" />
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
                    <Phone className="mr-1 inline h-4 w-4 text-blue-600" />
                    Phone number
                  </label>
                  <input
                    id="customer-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    minLength={7}
                    maxLength={25}
                    placeholder="Your phone number"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Special instructions */}
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

              {/* Payment */}
              <fieldset className="space-y-3">
                <legend className="text-base font-bold text-slate-900">
                  Choose payment method
                </legend>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "PAY_DRIVER"
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-white"
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
                    <span className="mt-1 block text-sm text-slate-700">
                      Pay your driver by card or cash at the end of the trip.
                    </span>
                  </span>
                  {paymentMethod === "PAY_DRIVER" && (
                    <Check className="h-5 w-5 text-blue-700" />
                  )}
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === "STRIPE"
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-white"
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
                    <span className="mt-1 block text-sm text-slate-700">
                      Secure payment through Stripe Checkout.
                    </span>
                  </span>
                  {paymentMethod === "STRIPE" && (
                    <Check className="h-5 w-5 text-blue-700" />
                  )}
                </label>
              </fieldset>

              {/* Fare estimate */}
              {(estimate.cents != null || estimate.loading || estimate.error) && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
                    Estimated fare
                  </p>
                  {estimate.loading && (
                    <p className="mt-1 text-sm text-slate-700">
                      Calculating fare...
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
              )}
            </div>
          )}

          {/* Notices */}
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

          {/* Submit only after options are opened */}
          {showOptions && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1674e8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#0863d2] focus:outline-none focus:ring-4 focus:ring-blue-400/30 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 sm:text-base"
            >
              {isSubmitting
                ? "Processing booking..."
                : paymentMethod === "STRIPE"
                  ? "Continue to secure payment"
                  : "Book now — pay in the cab"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
