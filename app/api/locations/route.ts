
import { NextResponse } from "next/server";


const SYDNEY_BOUNDS = {
  minLat: -35,
  maxLat: -32,
  minLng: 150,
  maxLng: 152,
};

type GeoapifyFeature = {
  geometry?: {
    coordinates?: unknown;
  };
  properties?: {
    formatted?: unknown;
    name?: unknown;
    housenumber?: unknown;
    street?: unknown;
    suburb?: unknown;
    district?: unknown;
    city?: unknown;
    county?: unknown;
    state?: unknown;
    postcode?: unknown;
    country?: unknown;
    place_id?: unknown;
  };
};

function toText(value: unknown): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value).trim()
    : "";
}

function withinServiceArea(lon: number, lat: number): boolean {
  return (
    lat >= SYDNEY_BOUNDS.minLat &&
    lat <= SYDNEY_BOUNDS.maxLat &&
    lon >= SYDNEY_BOUNDS.minLng &&
    lon <= SYDNEY_BOUNDS.maxLng
  );
}

function getAddress(properties: NonNullable<GeoapifyFeature["properties"]>) {
  // Geoapify's formatted result usually has the most complete address.
  const formatted = toText(properties.formatted);
  if (formatted) return formatted;

  const streetLine = [
    toText(properties.housenumber),
    toText(properties.street),
  ]
    .filter(Boolean)
    .join(" ");

  return [
    streetLine || toText(properties.name),
    toText(properties.suburb) || toText(properties.district),
    toText(properties.city) || toText(properties.county),
    toText(properties.state),
    toText(properties.postcode),
    toText(properties.country),
  ]
    .filter(Boolean)
    .filter((part, index, parts) =>
      parts.findIndex(
        (candidate) => candidate.toLowerCase() === part.toLowerCase()
      ) === index
    )
    .join(", ");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  if (query.length > 160) {
    return NextResponse.json(
      { error: "Search query is too long." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    console.error("GEOAPIFY_API_KEY is not configured.");
    return NextResponse.json(
      { error: "Location search is not configured." },
      { status: 500 }
    );
  }

  const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");

  url.searchParams.set("text", query);
  url.searchParams.set("format", "geojson");
  url.searchParams.set("limit", "20");
  url.searchParams.set("lang", "en");
  url.searchParams.set("filter", "rect:150,-35,152,-32");
  url.searchParams.set("bias", "proximity:151.2093,-33.8688");
  url.searchParams.set("apiKey", apiKey);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Geoapify search status:", response.status);

      return NextResponse.json(
        { error: "Location search is temporarily unavailable." },
        { status: 502 }
      );
    }

    const result = (await response.json()) as {
      features?: GeoapifyFeature[];
    };

    const queryLower = query.toLowerCase();

    const candidates = (result.features ?? []).flatMap((feature) => {
      const coordinates = feature.geometry?.coordinates;
      const properties = feature.properties;

      if (
        !Array.isArray(coordinates) ||
        coordinates.length < 2 ||
        typeof coordinates[0] !== "number" ||
        typeof coordinates[1] !== "number" ||
        !Number.isFinite(coordinates[0]) ||
        !Number.isFinite(coordinates[1]) ||
        !properties
      ) {
        return [];
      }

      const longitude = coordinates[0];
      const latitude = coordinates[1];
      const address = getAddress(properties);

      if (!address || !withinServiceArea(longitude, latitude)) {
        return [];
      }

      const name = toText(properties.name);
      const houseNumber = toText(properties.housenumber);
      const street = toText(properties.street);

      let score = 0;

      if (address.toLowerCase().includes(queryLower)) score += 5;
      if (name.toLowerCase().includes(queryLower)) score += 10;
      if (street && address.toLowerCase().includes(street.toLowerCase())) {
        score += 2;
      }

      const leadingNumber = query.match(/^\s*(\d+[a-z]?)\b/i);

      if (
        leadingNumber &&
        houseNumber.toLowerCase() === leadingNumber[1].toLowerCase()
      ) {
        score += 10;
      }

      return [{
        id: `${toText(properties.place_id) || `${longitude},${latitude}`}:${address}`,
        address,
        longitude,
        latitude,
        score,
      }];
    });

    // Deduplicate identical coordinates and prefer the most relevant result.
    const unique = new Map<string, (typeof candidates)[number]>();

    for (const candidate of candidates) {
      const key = `${candidate.longitude.toFixed(6)},${candidate.latitude.toFixed(6)}`;
      const existing = unique.get(key);

      if (!existing || candidate.score > existing.score) {
        unique.set(key, candidate);
      }
    }

    const suggestions = [...unique.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ score: _score, ...suggestion }) => suggestion);

    return NextResponse.json(
      { suggestions },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Geoapify autocomplete error:", error);

    return NextResponse.json(
      { error: "Could not search locations. Please try again." },
      { status: 502 }
    );
  }
}
