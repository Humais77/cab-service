
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

function isInServiceArea(point: Coordinates) {
  return (
    Number.isFinite(point.longitude) &&
    Number.isFinite(point.latitude) &&
    point.latitude >= SYDNEY_BOUNDS.minLat &&
    point.latitude <= SYDNEY_BOUNDS.maxLat &&
    point.longitude >= SYDNEY_BOUNDS.minLng &&
    point.longitude <= SYDNEY_BOUNDS.maxLng
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

  const coordinates = [
    `${pickup.longitude},${pickup.latitude}`,
    `${destination.longitude},${destination.latitude}`,
  ].join(";");

  const url = new URL(
    `https://router.project-osrm.org/route/v1/driving/${coordinates}`
  );

  url.searchParams.set("overview", "full");
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("steps", "false");
  url.searchParams.set("alternatives", "false");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OSRM returned status ${response.status}.`);
  }

  const result = (await response.json()) as {
    code?: string;
    message?: string;
    routes?: Array<{
      distance?: number;
      duration?: number;
      geometry?: {
        type?: string;
        coordinates?: unknown;
      };
    }>;
  };

  const route = result.routes?.[0];

  if (
    result.code !== "Ok" ||
    !route ||
    typeof route.distance !== "number" ||
    !Number.isFinite(route.distance) ||
    route.distance <= 0 ||
    typeof route.duration !== "number" ||
    !Number.isFinite(route.duration) ||
    route.duration < 0 ||
    route.geometry?.type !== "LineString" ||
    !Array.isArray(route.geometry.coordinates)
  ) {
    throw new Error(
      result.message || "No driving route was found for these locations."
    );
  }

  const geometryCoordinates = route.geometry.coordinates.filter(
    (point): point is [number, number] =>
      Array.isArray(point) &&
      point.length >= 2 &&
      typeof point[0] === "number" &&
      typeof point[1] === "number" &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1]) &&
      point[0] >= -180 &&
      point[0] <= 180 &&
      point[1] >= -90 &&
      point[1] <= 90
  );

  if (geometryCoordinates.length < 2) {
    throw new Error("The route geometry returned by OSRM is invalid.");
  }

  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geometry: {
      type: "LineString",
      coordinates: geometryCoordinates,
    },
  };
}
