
export type FareResult = {
  amountCents: number;
  currency: "AUD";
  distanceKm: number;
};

function getPositiveIntegerEnv(name: string, fallback: number): number {
  const raw = process.env[name];

  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }

  const value = Number(raw);

  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer.`);
  }

  return value;
}

export function calculateFareCents(
  distanceMeters: number,
  tripType: "One way" | "Return",
): FareResult {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new Error("Invalid route distance.");
  }

  // All amounts are in AUD cents.
  const baseFareCents = getPositiveIntegerEnv(
    "BOOKING_BASE_FARE_AUD_CENTS",
    400,
  );

  const perKmCents = getPositiveIntegerEnv(
    "BOOKING_PER_KM_AUD_CENTS",
    350,
  );

  const minimumFareCents = getPositiveIntegerEnv(
    "BOOKING_MIN_FARE_AUD_CENTS",
    800,
  );

  const distanceKm = distanceMeters / 1000;
  const billableKm = distanceKm * (tripType === "Return" ? 2 : 1);

  const calculatedFare = Math.ceil(
    baseFareCents + billableKm * perKmCents,
  );

  const amountCents = Math.max(minimumFareCents, calculatedFare);

  if (!Number.isSafeInteger(amountCents)) {
    throw new Error("Calculated fare is outside the supported range.");
  }

  return {
    amountCents,
    currency: "AUD",
    distanceKm,
  };
}
