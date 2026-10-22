import { NextResponse } from "next/server";


const SYDNEY_BOUNDS = {
  minLat: -35,
  maxLat: -32,
  minLng: 150,
  maxLng: 152,
};

type PhotonFeature = {
  geometry?: { coordinates?: unknown };
  properties?: {
    name?: unknown;
    street?: unknown;
    housenumber?: unknown;
    postcode?: unknown;
    city?: unknown;
    district?: unknown;
    state?: unknown;
    country?: unknown;
  };
};

function withinServiceArea(longitude: number, latitude: number) {
  return (
    latitude >= SYDNEY_BOUNDS.minLat &&
    latitude <= SYDNEY_BOUNDS.maxLat &&
    longitude >= SYDNEY_BOUNDS.minLng &&
    longitude <= SYDNEY_BOUNDS.maxLng
  );
}

function addressFromProperties(properties: NonNullable<PhotonFeature["properties"]>) {
  const streetLine = [properties.housenumber, properties.street]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(" ");

  const parts = [
    streetLine || properties.name,
    properties.district,
    properties.city,
    properties.state,
    properties.postcode,
    properties.country,
  ].filter((part): part is string => typeof part === "string" && part.trim().length > 0);

  return [...new Set(parts)].join(", ");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  if (query.length > 160) {
    return NextResponse.json(
      { error: "Search query is too long." },
      { status: 400 }
    );
  }

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lat", "-33.8688");
  url.searchParams.set("lon", "151.2093");
  url.searchParams.set("lang", "en");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Photon returned status:", response.status);
      return NextResponse.json(
        { error: "Location search is temporarily unavailable." },
        { status: 502 }
      );
    }

    const result = (await response.json()) as { features?: PhotonFeature[] };
    const suggestions = (result.features ?? [])
      .flatMap((feature) => {
        const coordinates = feature.geometry?.coordinates;
        const properties = feature.properties;

        if (
          !Array.isArray(coordinates) ||
          coordinates.length < 2 ||
          typeof coordinates[0] !== "number" ||
          typeof coordinates[1] !== "number" ||
          !properties
        ) {
          return [];
        }

        const longitude = coordinates[0];
        const latitude = coordinates[1];
        const address = addressFromProperties(properties);

        if (
          !address ||
          !Number.isFinite(longitude) ||
          !Number.isFinite(latitude) ||
          !withinServiceArea(longitude, latitude)
        ) {
          return [];
        }

        return [{ id: `${longitude},${latitude}:${address}`, address, longitude, latitude }];
      })
      .slice(0, 6);

    return NextResponse.json(
      { suggestions },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Photon location search error:", error);
    return NextResponse.json(
      { error: "Could not search locations. Please try again." },
      { status: 502 }
    );
  }
}
