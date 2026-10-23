/**
 * Server-side AUD fare calculation. All amounts are integer cents.
 * Configure these values in .env before accepting real bookings.
 */
function readNonNegativeInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`${name} must be a non-negative integer (AUD cents).`);
  }
  return parsed;
}

export function calculateFareCents(distanceMeters: number, tripType: "One way" | "Return") {
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) {
    throw new Error("The route distance must be greater than zero.");
  }

  // Example defaults: A$5 base + A$2/km, minimum A$10. Change in .env.
  const baseFare = readNonNegativeInteger("BOOKING_BASE_FARE_AUD_CENTS", 500);
  const perKm = readNonNegativeInteger("BOOKING_PER_KM_AUD_CENTS", 200);
  const minimumFare = readNonNegativeInteger("BOOKING_MIN_FARE_AUD_CENTS", 1000);
  const tripMultiplier = tripType === "Return" ? 2 : 1;
  const billableKm = (distanceMeters / 1000) * tripMultiplier;
  const fare = baseFare + Math.ceil(billableKm * perKm);

  const total = Math.max(minimumFare, fare);
  if (!Number.isSafeInteger(total) || total <= 0) {
    throw new Error("Calculated fare is invalid.");
  }
  return total;
}
