
export type Coordinates = {
  longitude: number;
  latitude: number;
};

export type DrivingRoute = {
  distanceMeters: number;
  durationSeconds: number;
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
};

const SYDNEY_BOUNDS = {
  minLat: -35,
  maxLat: -32,
  minLng: 150,
  maxLng: 152,
};

function isInServiceArea(point: Coordinates): boolean {
  return (
    Number.isFinite(point.longitude) &&
    Number.isFinite(point.latitude) &&
    point.latitude >= SYDNEY_BOUNDS.minLat &&
    point.latitude <= SYDNEY_BOUNDS.maxLat &&
    point.longitude >= SYDNEY_BOUNDS.minLng &&
    point.longitude <= SYDNEY_BOUNDS.maxLng
  );
}

function isCoordinate(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1]) &&
    value[0] >= -180 &&
    value[0] <= 180 &&
    value[1] >= -90 &&
    value[1] <= 90
  );
}

export async function getDrivingRoute(
  pickup: Coordinates,
  destination: Coordinates
): Promise<DrivingRoute> {
  if (!isInServiceArea(pickup) || !isInServiceArea(destination)) {
    throw new Error(
      "Pickup and destination must be within the configured service area."
    );
  }

  if (
    pickup.longitude === destination.longitude &&
    pickup.latitude === destination.latitude
  ) {
    throw new Error("Pickup and destination must be different locations.");
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY is not configured.");
  }

  const url = new URL("https://api.geoapify.com/v1/routing");

  url.searchParams.set(
    "waypoints",
    `${pickup.latitude},${pickup.longitude}|${destination.latitude},${destination.longitude}`
  );
  url.searchParams.set("mode", "drive");
  url.searchParams.set("units", "metric");
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as {
    message?: string;
    error?: string;
    features?: Array<{
      geometry?: {
        type?: string;
        coordinates?: unknown;
      };
      properties?: {
        distance?: unknown;
        time?: unknown;
      };
    }>;
  } | null;

  if (!response.ok) {
    console.error("Geoapify routing failed:", {
      status: response.status,
      message: result?.message ?? result?.error,
    });

    throw new Error(
      result?.message ??
        result?.error ??
        "The routing provider could not calculate this journey."
    );
  }

  const feature = result?.features?.[0];
  const properties = feature?.properties;
  const geometry = feature?.geometry;

  const distance = properties?.distance;
  const duration = properties?.time;

  if (
    typeof distance !== "number" ||
    !Number.isFinite(distance) ||
    distance <= 0 ||
    typeof duration !== "number" ||
    !Number.isFinite(duration) ||
    duration < 0
  ) {
    console.error("Geoapify returned an unexpected route response:", {
      geometryType: geometry?.type,
      distance,
      duration,
      hasFeature: Boolean(feature),
    });

    throw new Error(
      "The routing provider returned incomplete distance or duration data."
    );
  }

  let coordinates: [number, number][] = [];

  if (
    geometry?.type === "LineString" &&
    Array.isArray(geometry.coordinates)
  ) {
    coordinates = geometry.coordinates.filter(isCoordinate);
  } else if (
    geometry?.type === "MultiLineString" &&
    Array.isArray(geometry.coordinates)
  ) {
    // GeoJSON MultiLineString: an array of route segments.
    coordinates = geometry.coordinates.flatMap((segment) =>
      Array.isArray(segment)
        ? segment.filter(isCoordinate)
        : []
    );
  } else {
    console.error("Unsupported Geoapify geometry:", geometry?.type);

    throw new Error(
      "The routing provider returned an unsupported route geometry."
    );
  }

  if (coordinates.length < 2) {
    throw new Error("The routing provider returned invalid route coordinates.");
  }

  return {
    distanceMeters: distance,
    durationSeconds: duration,
    geometry: {
      type: "LineString",
      coordinates,
    },
  };
}
