
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  MapPin,
  Navigation,
  Loader2,
} from "lucide-react";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
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

type MapPickTarget = "pickup" | "destination" | null;

type RoutePlannerProps = {
  onChange: (selection: RouteSelection) => void;
  children?: ReactNode;
};

type MapClickPickerProps = {
  enabled: boolean;
  onSelect: (lat: number, lon: number) => void;
};

function MapClickPicker({ enabled, onSelect }: MapClickPickerProps) {
  useMapEvents({
    click(event) {
      if (enabled) {
        onSelect(event.latlng.lat, event.latlng.lng);
      }
    },
  });

  return null;
}

const DEFAULT_CENTER: [number, number] = [-33.8688, 151.2093];

const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border:3px solid white;border-radius:50%;background:#2563eb;box-shadow:0 1px 5px #555;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const destinationIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border:3px solid white;border-radius:50%;background:#dc2626;box-shadow:0 1px 5px #555;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitRoute({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 15);
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
      <label className="mb-1.5 block text-xs font-semibold text-slate-800 sm:text-sm">
        {label}
      </label>

      <div className="relative">
        <MapPin
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
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
          className="min-h-[48px] w-full min-w-0 rounded-lg border border-slate-300 bg-white py-3 pl-9 pr-2 text-xs text-slate-900 outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 sm:text-sm"
        />
      </div>

      {loading && (
        <p className="mt-1 text-xs text-slate-600">Searching locations...</p>
      )}

      {error && (
        <p role="alert" className="mt-1 text-xs text-red-700">
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
                className="w-full border-b border-slate-100 px-3 py-3 text-left text-xs text-slate-800 last:border-0 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none sm:text-sm"
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
          <p className="mt-1 text-xs text-slate-600">
            No matching locations found in the configured service area.
          </p>
        )}
    </div>
  );
}

export default function RoutePlanner({
  onChange,
  children,
}: RoutePlannerProps) {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);

  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  const [showMap, setShowMap] = useState(false);
  const [mapPickTarget, setMapPickTarget] = useState<MapPickTarget>(null);

  const [isResolvingClick, setIsResolvingClick] = useState(false);
  const [mapPickError, setMapPickError] = useState("");

  function startMapSelection(target: Exclude<MapPickTarget, null>) {
    setMapPickTarget(target);
    setMapPickError("");
    setShowMap(true);
  }

  async function selectMapLocation(lat: number, lon: number) {
    if (!mapPickTarget || isResolvingClick) return;

    const selectedTarget = mapPickTarget;

    setIsResolvingClick(true);
    setMapPickError("");

    try {
      const response = await fetch(
        `/api/reverse-geocode?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not resolve this location.");
      }

      const location: Location = {
        address: data.address,
        latitude: lat,
        longitude: lon,
      };

      if (selectedTarget === "pickup") {
        setPickup(location);
      } else {
        setDestination(location);
      }

      setMapPickTarget(null);
      setMapPickError("");
    } catch (error) {
      console.error("Map location selection error:", error);

      setMapPickError(
        error instanceof Error
          ? error.message
          : "Could not select this location. Please try again."
      );
    } finally {
      setIsResolvingClick(false);
    }
  }

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

    if (pickup) points.push([pickup.latitude, pickup.longitude]);
    if (destination) points.push([destination.latitude, destination.longitude]);

    return points;
  }, [pickup, destination]);

  const hasBothLocations = Boolean(pickup && destination);

  return (
    <div className="space-y-3">
      {/* Pickup and drop-off fields */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <LocationField
          label="Pickup location"
          placeholder="Enter pickup location"
          value={pickup}
          onSelect={(location) => {
            setPickup(location);
            setRoute(null);
            setRouteError("");
          }}
        />

        <LocationField
          label="Drop-off location"
          placeholder="Enter destination"
          value={destination}
          onSelect={(location) => {
            setDestination(location);
            setRoute(null);
            setRouteError("");
          }}
        />
      </div>

      {/* BookingBar inserts journey date and time here */}
      {children}

      {/* Compact map controls - now below date and time */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Choose pickup location on map"
            aria-label="Choose pickup location on map"
            aria-pressed={mapPickTarget === "pickup"}
            onClick={() => startMapSelection("pickup")}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${mapPickTarget === "pickup"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-blue-700 hover:border-blue-400 hover:bg-blue-50"
              }`}
          >
            <MapPin className="h-5 w-5" />
          </button>

          <button
            type="button"
            title="Choose drop-off location on map"
            aria-label="Choose drop-off location on map"
            aria-pressed={mapPickTarget === "destination"}
            onClick={() => startMapSelection("destination")}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${mapPickTarget === "destination"
                ? "border-red-600 bg-red-600 text-white"
                : "border-slate-200 bg-white text-red-600 hover:border-red-400 hover:bg-red-50"
              }`}
          >
            <Navigation className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowMap((current) => !current);
            setMapPickError("");
          }}
          aria-label={showMap ? "Hide map" : "Open map"}
          title={showMap ? "Hide map" : "Open map"}
          aria-expanded={showMap}
          className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${showMap
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
            }`}
        >
          <MapIcon className="h-4 w-4" />
          <span className="hidden sm:inline">
            {showMap ? "Hide map" : "Open map"}
          </span>
          {showMap ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {mapPickTarget && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
          <span>
            Tap the map to choose your{" "}
            {mapPickTarget === "pickup" ? "pickup" : "drop-off"} location.
          </span>
          <button
            type="button"
            onClick={() => setMapPickTarget(null)}
            className="shrink-0 font-semibold underline"
          >
            Cancel
          </button>
        </div>
      )}

      {isResolvingClick && (
        <p className="flex items-center gap-2 text-xs text-blue-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          Finding selected address...
        </p>
      )}

      {mapPickError && (
        <p role="alert" className="text-xs text-red-700">
          {mapPickError}
        </p>
      )}

      {/* Compact route status */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
       
        <span aria-live="polite">
          {routeLoading
            ? "Calculating driving route..."
            : route
              ? `${(route.distanceMeters / 1000).toFixed(2)} km · ${formatDuration(route.durationSeconds)}`
              : hasBothLocations
                ? "Preparing driving route..."
                : "Enter your pickup and drop-off locations to see the driving distance and estimated time."}
        </span>
      </div>

      {/* Map stays hidden until requested */}
      {showMap && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={11}
            scrollWheelZoom
            className="h-[240px] w-full rounded-lg sm:h-[340px]"
            style={{ height: "280px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickPicker
              enabled={mapPickTarget !== null && !isResolvingClick}
              onSelect={selectMapLocation}
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
                  color: "#2563eb",
                  weight: 5,
                  opacity: 0.85,
                }}
              />
            )}

            <FitRoute
              points={
                routePositions.length > 0 ? routePositions : markerPositions
              }
            />
          </MapContainer>

          <p className="px-2 py-1.5 text-[10px] text-slate-500">
            Map data © OpenStreetMap contributors.
          </p>
        </div>
      )}

      {routeError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {routeError}
        </p>
      )}

      {route && (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
              Distance
            </p>
            <p className="mt-0.5 text-base font-bold text-slate-900">
              {(route.distanceMeters / 1000).toFixed(2)} km
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Estimated time
            </p>
            <p className="mt-0.5 text-base font-bold text-slate-900">
              {formatDuration(route.durationSeconds)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
