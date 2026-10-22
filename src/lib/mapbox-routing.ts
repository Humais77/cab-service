
type Coordinates = {
  longitude: number;
  latitude: number;
};

export async function getDrivingRoute(
  pickup: Coordinates,
  destination: Coordinates,
) {
  const token = process.env.MAPBOX_SECRET_TOKEN;

  if (!token) {
    throw new Error("Mapbox server token is not configured.");
  }

  const coordinates = [
    `${pickup.longitude},${pickup.latitude}`,
    `${destination.longitude},${destination.latitude}`,
  ].join(";");

  const url = new URL(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}`,
  );

  url.searchParams.set("access_token", token);
  url.searchParams.set("overview", "full");
  url.searchParams.set("geometries", "geojson");

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Mapbox could not calculate the driving route.");
  }

  const result = await response.json();
  const route = result.routes?.[0];

  if (
    !route ||
    !Number.isFinite(route.distance) ||
    !Number.isFinite(route.duration)
  ) {
    throw new Error("No valid driving route was found.");
  }

  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geometry: route.geometry,
  };
}
