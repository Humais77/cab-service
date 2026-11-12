
export type FareResult = {
  amountCents: number;
  currency: "AUD";
  distanceKm: number;
  durationMinutes: number;
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
  durationSeconds: number,
  tripType: "One way" | "Return",
): FareResult {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new Error("Invalid route distance.");
  }

  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
    throw new Error("Invalid journey duration.");
  }

  const baseFareCents = getPositiveIntegerEnv(
    "BOOKING_BASE_FARE_AUD_CENTS",
    400,
  );

  const perKmCents = getPositiveIntegerEnv(
    "BOOKING_PER_KM_AUD_CENTS",
    350,
  );

  const perMinuteCents = getPositiveIntegerEnv(
    "BOOKING_PER_MINUTE_AUD_CENTS",
    50,
  );

  const minimumFareCents = getPositiveIntegerEnv(
    "BOOKING_MIN_FARE_AUD_CENTS",
    800,
  );

  const distanceKm = distanceMeters / 1000;
  const durationMinutes = durationSeconds / 60;

  const multiplier = tripType === "Return" ? 2 : 1;

  const billableKm = distanceKm * multiplier;
  const billableMinutes = durationMinutes * multiplier;

  const calculatedFare = Math.ceil(
    baseFareCents +
      billableKm * perKmCents +
      billableMinutes * perMinuteCents,
  );

  const amountCents = Math.max(minimumFareCents, calculatedFare);

  if (!Number.isSafeInteger(amountCents)) {
    throw new Error("Calculated fare is outside the supported range.");
  }

  return {
    amountCents,
    currency: "AUD",
    distanceKm,
    durationMinutes,
  };
}
