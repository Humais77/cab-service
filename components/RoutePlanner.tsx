"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  MapPin,
  Navigation,
} from "lucide-react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L, { type LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

export type Location = {
  address: string;
  longitude: number;
  latitude: number;
};

export type RouteSelection = {
  pickup: Location | null;
  destination: Location | null;
  distanceMeters: number | null;
  durationSeconds: number | null;
};

type Suggestion = Location & {
  id: string;
};

type RouteGeometry = {
  type: "LineString";
  coordinates: [number, number][];
};

type RouteResponse = {
  distanceMeters: number;
  durationSeconds: number;
  geometry: RouteGeometry;
};

type RoutePlannerProps = {
  onChange: (selection: RouteSelection) => void;
};

const DEFAULT_CENTER: [number, number] = [-33.8688, 151.2093];

const pickupIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:18px;
      height:18px;
      border:3px solid white;
      border-radius:50%;
      background:#3b82f6;
      box-shadow:0 1px 5px #555;
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const destinationIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:18px;
      height:18px;
      border:3px solid white;
      border-radius:50%;
      background:#dc2626;
      box-shadow:0 1px 5px #555;
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitRoute({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 13);
    } else if (points.length > 1) {
      const bounds: LatLngBoundsExpression = points;

      map.fitBounds(bounds, {
        padding: [32, 32],
        maxZoom: 14,
      });
    }
  }, [map, points]);

  return null;
}

function formatDuration(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;

  return `${hours} hr ${remainingMinutes} min`;
}

function LocationField({
  label,
  placeholder,
  value,
  onSelect,
}: {
  label: string;
  placeholder: string;
  value: Location | null;
  onSelect: (location: Location | null) => void;
}) {
  const [query, setQuery] = useState(value?.address ?? "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuery(value?.address ?? "");
  }, [value?.address]);

  useEffect(() => {
    const cleaned = query.trim();

    if (cleaned.length < 3 || cleaned === value?.address) {
      setSuggestions([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/locations?q=${encodeURIComponent(cleaned)}`,
          { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Location search failed.");
        }

        setSuggestions(
          Array.isArray(result.suggestions) ? result.suggestions : []
        );
      } catch (searchError) {
        if (controller.signal.aborted) return;

        console.error("Location autocomplete error:", searchError);

        setSuggestions([]);
        setError("Could not search locations. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, value?.address]);

  return (
    <div className="relative min-w-0">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <MapPin
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />

        <input
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;

            setQuery(nextQuery);
            setSuggestions([]);
            setError("");

            if (value && nextQuery !== value.address) {
              onSelect(null);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={label}
          aria-autocomplete="list"
          className="w-full rounded-lg border border-white/15 bg-[#252b35] py-3.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-400 hover:border-white/30 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
        />
      </div>

      {loading && (
        <p className="mt-1.5 text-xs text-slate-500">
          Searching locations…
        </p>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}

      {!loading && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect({
                    address: suggestion.address,
                    longitude: suggestion.longitude,
                    latitude: suggestion.latitude,
                  });

                  setQuery(suggestion.address);
                  setSuggestions([]);
                  setError("");
                }}
                className="w-full border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 last:border-0 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
              >
                {suggestion.address}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading &&
        query.trim().length >= 3 &&
        !error &&
        suggestions.length === 0 &&
        query.trim() !== value?.address && (
          <p className="mt-1.5 text-xs text-slate-500">
            No matching locations found in the configured service area.
          </p>
        )}
    </div>
  );
}

export default function RoutePlanner({ onChange }: RoutePlannerProps) {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!pickup || !destination) {
      setRoute(null);
      setRouteError("");
      setRouteLoading(false);

      onChange({
        pickup,
        destination,
        distanceMeters: null,
        durationSeconds: null,
      });

      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setRouteLoading(true);
      setRouteError("");
      setRoute(null);

      try {
        const response = await fetch("/api/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pickup: {
              longitude: pickup.longitude,
              latitude: pickup.latitude,
            },
            destination: {
              longitude: destination.longitude,
              latitude: destination.latitude,
            },
          }),
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Route calculation failed.");
        }

        const calculatedRoute = result as RouteResponse;

        setRoute(calculatedRoute);

        onChange({
          pickup,
          destination,
          distanceMeters: calculatedRoute.distanceMeters,
          durationSeconds: calculatedRoute.durationSeconds,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Driving route request failed:", error);

        setRouteError(
          error instanceof Error
            ? error.message
            : "Could not calculate the driving route."
        );

        onChange({
          pickup,
          destination,
          distanceMeters: null,
          durationSeconds: null,
        });
      } finally {
        if (!controller.signal.aborted) {
          setRouteLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [pickup, destination, onChange]);

  const routePositions = useMemo<[number, number][]>(() => {
    return (route?.geometry.coordinates ?? []).map(
      ([longitude, latitude]) => [latitude, longitude]
    );
  }, [route]);

  const markerPositions = useMemo<[number, number][]>(() => {
    const points: [number, number][] = [];

    if (pickup) {
      points.push([pickup.latitude, pickup.longitude]);
    }

    if (destination) {
      points.push([destination.latitude, destination.longitude]);
    }

    return points;
  }, [pickup, destination]);

  const hasBothLocations = Boolean(pickup && destination);

  return (
    <div className="space-y-4">
      {/* Main route fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <LocationField
          label="Pickup location"
          placeholder="Where should we pick you up?"
          value={pickup}
          onSelect={(location) => {
            setPickup(location);
            setRoute(null);
            setRouteError("");
          }}
        />

        <LocationField
          label="Destination"
          placeholder="Where are you going?"
          value={destination}
          onSelect={(location) => {
            setDestination(location);
            setRoute(null);
            setRouteError("");
          }}
        />
      </div>

      {/* Map toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-blue-300">
            <Navigation className="h-3.5 w-3.5" />
          </span>

          <span>
            {routeLoading
              ? "Calculating your driving route…"
              : route
                ? "Your driving route is ready."
                : hasBothLocations
                  ? "Preparing your driving route…"
                  : "Enter both locations to calculate your route."}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowMap((current) => !current)}
          aria-expanded={showMap}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#252b35] px-3.5 py-2.5 text-sm font-medium text-slate-200 shadow-sm transition hover:border-blue-400/50 hover:bg-[#303846] hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20"
        >
          <MapIcon className="h-4 w-4" />

          {showMap ? "Hide map" : "Open map"}

          {showMap ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Map is mounted only when the user opens it */}
      {showMap && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={11}
            scrollWheelZoom
            className="h-[280px] w-full rounded-lg sm:h-[360px]"
            style={{ height: "360px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pickup && (
              <Marker
                position={[pickup.latitude, pickup.longitude]}
                icon={pickupIcon}
              >
                <Popup>Pickup: {pickup.address}</Popup>
              </Marker>
            )}

            {destination && (
              <Marker
                position={[destination.latitude, destination.longitude]}
                icon={destinationIcon}
              >
                <Popup>Destination: {destination.address}</Popup>
              </Marker>
            )}

            {routePositions.length > 1 && (
              <Polyline
                positions={routePositions}
                pathOptions={{
                  color: "#3b82f6",
                  weight: 5,
                  opacity: 0.85,
                }}
              />
            )}

            <FitRoute
              points={
                routePositions.length > 0
                  ? routePositions
                  : markerPositions
              }
            />
          </MapContainer>

          <p className="px-3 py-2 text-xs leading-5 text-slate-500">
            Map data © OpenStreetMap contributors. Travel times are estimates
            and do not include live traffic.
          </p>
        </div>
      )}

      {routeError && (
        <p
          role="alert"
          className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {routeError}
        </p>
      )}

      {/* Route summary */}
      {route && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 p-3.5 sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">
              Driving distance
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              {(route.distanceMeters / 1000).toFixed(2)} km
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">
              Estimated time
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              {formatDuration(route.durationSeconds)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}