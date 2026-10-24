
import { NextResponse } from "next/server";


const SYDNEY_BOUNDS = {
  minLat: -35,
  maxLat: -32,
  minLng: 150,
  maxLng: 152,
};

type PhotonValue = string | number | null | undefined;

type PhotonFeature = {
  geometry?: {
    coordinates?: unknown;
  };
  properties?: {
    name?: PhotonValue;
    street?: PhotonValue;
    housenumber?: PhotonValue;
    postcode?: PhotonValue;
    city?: PhotonValue;
    district?: PhotonValue;
    locality?: PhotonValue;
    county?: PhotonValue;
    state?: PhotonValue;
    country?: PhotonValue;
    osm_key?: PhotonValue;
    osm_value?: PhotonValue;
  };
};

function text(value: PhotonValue): string {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim();
}

function withinServiceArea(longitude: number, latitude: number) {
  return (
    latitude >= SYDNEY_BOUNDS.minLat &&
    latitude <= SYDNEY_BOUNDS.maxLat &&
    longitude >= SYDNEY_BOUNDS.minLng &&
    longitude <= SYDNEY_BOUNDS.maxLng
  );
}

function addressFromProperties(
  properties: NonNullable<PhotonFeature["properties"]>
) {
  const houseNumber = text(properties.housenumber);
  const street = text(properties.street);
  const name = text(properties.name);

  // Prefer a real house number + street supplied by Photon.
  const streetLine = [houseNumber, street].filter(Boolean).join(" ");

  // Avoid repeating the street when Photon uses it as the name too.
  const primary = streetLine || name;

  const locality =
    text(properties.locality) ||
    text(properties.district) ||
    text(properties.city) ||
    text(properties.county);

  const parts = [
    primary,
    locality,
    text(properties.city),
    text(properties.state),
    text(properties.postcode),
    text(properties.country),
  ].filter(Boolean);

  return [...new Set(parts)].join(", ");
}

function addressScore(
  feature: PhotonFeature,
  query: string,
  address: string
) {
  const properties = feature.properties ?? {};
  const normalizedQuery = query.toLowerCase();
  const normalizedAddress = address.toLowerCase();

  let score = 0;

  // Prefer results with a house number and street.
  if (text(properties.housenumber)) score += 8;
  if (text(properties.street)) score += 4;

  // Prefer results whose displayed address contains the search text.
  if (normalizedAddress.includes(normalizedQuery)) score += 5;

  // A numeric query may be a street number; prioritize numbered results.
  const numberMatch = normalizedQuery.match(/^\s*(\d+[a-z]?)\b/i);
  if (numberMatch && text(properties.housenumber).toLowerCase() === numberMatch[1].toLowerCase()) {
    score += 10;
  }

  return score;
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
  url.searchParams.set("limit", "20");
  url.searchParams.set("lat", "-33.8688");
  url.searchParams.set("lon", "151.2093");
  url.searchParams.set("lang", "en");

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
      // Avoid caching potentially sensitive search terms in shared caches.
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Photon returned status:", response.status);

      return NextResponse.json(
        { error: "Location search is temporarily unavailable." },
        { status: 502 }
      );
    }

    const result = (await response.json()) as {
      features?: PhotonFeature[];
    };

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
      const address = addressFromProperties(properties);

      if (
        !address ||
        !withinServiceArea(longitude, latitude)
      ) {
        return [];
      }

      return [
        {
          id: `${longitude},${latitude}:${address}`,
          address,
          longitude,
          latitude,
          score: addressScore(feature, query, address),
        },
      ];
    });

    // Remove duplicate labels at the same coordinates, then rank.
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
    console.error("Photon location search error:", error);

    return NextResponse.json(
      { error: "Could not search locations. Please try again." },
      { status: 502 }
    );
  }
}
