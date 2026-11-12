
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const latParam = request.nextUrl.searchParams.get("lat");
  const lonParam = request.nextUrl.searchParams.get("lon");

  if (latParam === null || lonParam === null) {
    return NextResponse.json(
      { error: "Latitude and longitude are required." },
      { status: 400 }
    );
  }

  const lat = Number(latParam);
  const lon = Number(lonParam);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return NextResponse.json(
      { error: "Invalid coordinates." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.error("GEOAPIFY_API_KEY is missing.");

    return NextResponse.json(
      { error: "Geocoding service is not configured." },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: "json",
    apiKey,
  });

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const providerError = await response.text();

      console.error("Geoapify reverse geocoding failed:", {
        status: response.status,
        response: providerError,
      });

      return NextResponse.json(
        { error: "Could not find an address for this location." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const result = data.results?.[0];

    if (!result?.formatted) {
      return NextResponse.json(
        { error: "No address was found at this location." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      address: result.formatted,
      latitude: lat,
      longitude: lon,
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);

    return NextResponse.json(
      { error: "Reverse geocoding failed. Please try again." },
      { status: 500 }
    );
  }
}
