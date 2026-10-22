"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CarFront,
  Users,
  Settings2,
  LogOut,
  RefreshCw,
  Search,
  Plus,
  Pencil,
  Trash2,
  Phone,
  MapPin,
  Clock,
  UserRound,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  ExternalLink,
  LoaderCircle,
} from "lucide-react";

type Status =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

type Booking = {
  id: number;
  reference: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  pickup: string;
  destination: string;
  tripType: string;
  journeyDate: string;
  journeyTime: string;
  returnDate?: string | null;
  returnTime?: string | null;
  vehicleName: string;
  passengerCount: number;
  serviceType: string;
  specialInstructions?: string | null;
  status: Status;
  assignedDriverId?: number | null;
  createdAt: string;
};

type Driver = {
  id: number;
  name: string;
  phone: string;
  active: boolean;
};

type Vehicle = {
  id: number;
  name: string;
  description?: string | null;
  capacity: number;
  active: boolean;
};

type ServiceType = {
  id: number;
  name: string;
  description?: string | null;
  active: boolean;
};

type Tab = "overview" | "bookings" | "drivers" | "vehicles" | "services";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "drivers", label: "Drivers", icon: Users },
  { id: "vehicles", label: "Vehicles", icon: CarFront },
  { id: "services", label: "Service types", icon: Settings2 },
];

const statuses: Status[] = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const statusClasses: Record<Status, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-blue-200",
  ASSIGNED: "bg-violet-50 text-violet-700 ring-violet-200",
  IN_PROGRESS: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  COMPLETED: "bg-green-50 text-green-700 ring-green-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

async function readJson(response: Response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "The request failed.");
  }

  return result;
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError("");

    try {
      const [bookingResponse, driverResponse, vehicleResponse, serviceResponse] =
        await Promise.all([
          fetch("/api/admin/bookings", { cache: "no-store" }),
          fetch("/api/admin/resources/drivers", { cache: "no-store" }),
          fetch("/api/admin/resources/vehicles", { cache: "no-store" }),
          fetch("/api/admin/resources/services", { cache: "no-store" }),
        ]);

      // A protected API returning 401 means the admin must log in.
      if (
        [bookingResponse, driverResponse, vehicleResponse, serviceResponse].some(
          (response) => response.status === 401,
        )
      ) {
        window.location.replace("/admin/login");
        return;
      }

      const [bookingData, driverData, vehicleData, serviceData] =
        await Promise.all([
          readJson(bookingResponse),
          readJson(driverResponse),
          readJson(vehicleResponse),
          readJson(serviceResponse),
        ]);

      setBookings(bookingData.bookings ?? []);
      setDrivers(driverData.items ?? []);
      setVehicles(vehicleData.items ?? []);
      setServices(serviceData.items ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const counts = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "PENDING").length,
      active: bookings.filter(
        (b) =>
          b.status === "CONFIRMED" ||
          b.status === "ASSIGNED" ||
          b.status === "IN_PROGRESS",
      ).length,
      completed: bookings.filter((b) => b.status === "COMPLETED").length,
    }),
    [bookings],
  );

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;

      const matchesSearch =
        !query ||
        [
          booking.reference,
          booking.customerName,
          booking.customerPhone,
          booking.pickup,
          booking.destination,
          booking.vehicleName,
        ].some((value) => value?.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  async function logout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      window.location.replace("/admin/login");
    }
  }

  async function updateBooking(
    booking: Booking,
    changes: { status?: Status; assignedDriverId?: number | null },
  ) {
    setBusyId(booking.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      await readJson(response);
      setNotice(`Booking ${booking.reference} updated.`);
      await loadData(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteBooking(booking: Booking) {
    if (!window.confirm(`Delete booking ${booking.reference}? This cannot be undone.`)) {
      return;
    }

    setBusyId(booking.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "DELETE",
      });

      await readJson(response);
      setBookings((current) => current.filter((b) => b.id !== booking.id));
      setNotice(`Booking ${booking.reference} deleted.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function saveResource(
    resource: "drivers" | "vehicles" | "services",
    item?: Driver | Vehicle | ServiceType,
  ) {
    const isEditing = Boolean(item);
    const name = window.prompt(
      "Name:",
      item?.name ?? "",
    );
    if (name === null) return;

    const payload: Record<string, unknown> = { name: name.trim() };

    if (resource === "drivers") {
      const current = item as Driver | undefined;
      const phone = window.prompt("Driver phone (international format recommended):", current?.phone ?? "");
      if (phone === null) return;
      payload.phone = phone.trim();

      const active = window.confirm(
        "Should this driver be active? Choose Cancel to save as inactive.",
      );
      payload.active = active;
    }

    if (resource === "vehicles") {
      const current = item as Vehicle | undefined;
      const capacityInput = window.prompt(
        "Passenger capacity:",
        String(current?.capacity ?? 4),
      );
      if (capacityInput === null) return;

      const capacity = Number(capacityInput);
      if (!Number.isInteger(capacity) || capacity < 1 || capacity > 13) {
        setError("Vehicle capacity must be a whole number between 1 and 13.");
        return;
      }

      payload.capacity = capacity;
      const description = window.prompt(
        "Vehicle description (optional):",
        current?.description ?? "",
      );
      if (description === null) return;
      payload.description = description.trim() || null;
      payload.active = window.confirm("Should this vehicle be active?");
    }

    if (resource === "services") {
      const current = item as ServiceType | undefined;
      const description = window.prompt(
        "Service description (optional):",
        current?.description ?? "",
      );
      if (description === null) return;
      payload.description = description.trim() || null;
      payload.active = window.confirm("Should this service be active?");
    }

    if (!payload.name) {
      setError("Name is required.");
      return;
    }

    setError("");
    setNotice("");

    try {
      const url = isEditing
        ? `/api/admin/resources/${resource}/${item!.id}`
        : `/api/admin/resources/${resource}`;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await readJson(response);
      setNotice(`${resource.slice(0, -1)} ${isEditing ? "updated" : "created"} successfully.`);
      await loadData(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save item.");
    }
  }

  async function deleteResource(
    resource: "drivers" | "vehicles" | "services",
    item: Driver | Vehicle | ServiceType,
  ) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/resources/${resource}/${item.id}`,
        { method: "DELETE" },
      );

      await readJson(response);
      setNotice(`${item.name} deleted.`);
      await loadData(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete item. It may be in use by a booking.",
      );
    }
  }

  function openDriverWhatsApp(booking: Booking) {
    if (!booking.assignedDriverId) {
      setError("Assign a driver before preparing a WhatsApp message.");
      return;
    }

    const driver = drivers.find((d) => d.id === booking.assignedDriverId);

    if (!driver) {
      setError("The assigned driver could not be found.");
      return;
    }

    const phone = driver.phone.replace(/\D/g, "");
    if (!phone) {
      setError("Add a valid international phone number for this driver.");
      return;
    }

    const message = [
      `New cab assignment: ${booking.reference}`,
      `Customer: ${booking.customerName}`,
      `Customer phone: ${booking.customerPhone}`,
      `Pickup: ${booking.pickup}`,
      `Destination: ${booking.destination}`,
      `Date: ${formatDate(booking.journeyDate)}`,
      `Time: ${booking.journeyTime}`,
      `Vehicle: ${booking.vehicleName}`,
      `Passengers: ${booking.passengerCount}`,
      booking.specialInstructions
        ? `Instructions: ${booking.specialInstructions}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function renderBookings(limit?: number) {
    const rows = limit
      ? filteredBookings.slice(0, limit)
      : filteredBookings;

    if (!rows.length) {
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <CalendarDays className="mx-auto mb-3 text-slate-400" size={32} />
          <p className="font-semibold text-slate-800">No bookings found</p>
          <p className="mt-1 text-sm text-slate-500">
            New customer requests will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {rows.map((booking) => (
          <article
            key={booking.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {booking.reference}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                      statusClasses[booking.status] ??
                      "bg-slate-100 text-slate-700 ring-slate-200"
                    }`}
                  >
                    {booking.status.replaceAll("_", " ")}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {booking.customerName}
                </h3>

                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <Phone size={14} />
                  <a
                    className="hover:text-blue-700"
                    href={`tel:${booking.customerPhone}`}
                  >
                    {booking.customerPhone}
                  </a>
                  {booking.customerEmail && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span>{booking.customerEmail}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="text-sm text-slate-500">
                Submitted {formatDateTime(booking.createdAt)}
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <MapPin size={14} /> Pickup
                </p>
                <p className="break-words text-sm font-medium text-slate-800">
                  {booking.pickup}
                </p>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <MapPin size={14} /> Destination
                </p>
                <p className="break-words text-sm font-medium text-slate-800">
                  {booking.destination}
                </p>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <CalendarDays size={14} /> Journey
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {formatDate(booking.journeyDate)} · {booking.journeyTime}
                </p>
                {booking.tripType === "Return" && (
                  <p className="mt-1 text-xs text-slate-600">
                    Return: {formatDate(booking.returnDate)} · {booking.returnTime || "—"}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <CarFront size={14} /> Vehicle and passengers
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {booking.vehicleName} · {booking.passengerCount} passenger(s)
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {booking.serviceType}
                </p>
              </div>
            </div>

            {booking.specialInstructions && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                  Special instructions
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-amber-950">
                  {booking.specialInstructions}
                </p>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Booking status
                </span>
                <select
                  value={booking.status}
                  disabled={busyId === booking.id}
                  onChange={(event) =>
                    void updateBooking(booking, {
                      status: event.target.value as Status,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Assign driver
                </span>
                <select
                  value={booking.assignedDriverId ?? ""}
                  disabled={busyId === booking.id}
                  onChange={(event) =>
                    void updateBooking(booking, {
                      assignedDriverId: event.target.value
                        ? Number(event.target.value)
                        : null,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                >
                  <option value="">Unassigned</option>
                  {drivers
                    .filter((driver) => driver.active)
                    .map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} — {driver.phone}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => openDriverWhatsApp(booking)}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              >
                <ExternalLink size={16} />
                Send to driver on WhatsApp
              </button>

              <a
                href={`tel:${booking.customerPhone}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Phone size={16} />
                Call customer
              </a>

              <button
                type="button"
                onClick={() => void deleteBooking(booking)}
                className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  }

  function renderResources(
    resource: "drivers" | "vehicles" | "services",
    items: (Driver | Vehicle | ServiceType)[],
  ) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-900">
              {resource === "drivers"
                ? "Driver management"
                : resource === "vehicles"
                  ? "Vehicle management"
                  : "Service type management"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {items.length} item(s)
            </p>
          </div>

          <button
            type="button"
            onClick={() => void saveResource(resource)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={17} /> Add new
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No items yet. Select Add new to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const driver = item as Driver;
              const vehicle = item as Vehicle;
              const service = item as ServiceType;

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{item.name}</p>

                    {resource === "drivers" && (
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} /> {driver.phone}
                      </p>
                    )}

                    {resource === "vehicles" && (
                      <>
                        <p className="mt-1 text-sm text-slate-600">
                          Capacity: {vehicle.capacity} passenger(s)
                        </p>
                        {vehicle.description && (
                          <p className="mt-1 text-sm text-slate-500">
                            {vehicle.description}
                          </p>
                        )}
                      </>
                    )}

                    {resource === "services" && service.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {service.description}
                      </p>
                    )}

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.active
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => void saveResource(resource, item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={15} /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void deleteResource(resource, item)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const activeTab = tabs.find((item) => item.id === tab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <CarFront size={22} />
          </div>
          <div>
            <p className="font-bold">Silver Cap Sydney</p>
            <p className="text-xs text-slate-500">Administration</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                tab === id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {label}
              {id === "bookings" && counts.pending > 0 && (
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                  {counts.pending}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {mobileMenu && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden">
          <div className="flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <span className="font-bold">Silver Cap Sydney Admin</span>
              <button type="button" onClick={() => setMobileMenu(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="space-y-1 p-3">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTab(id);
                    setMobileMenu(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
                    tab === id ? "bg-slate-900 text-white" : "hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} /> {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => void logout()}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600"
              >
                <LogOut size={18} /> Sign out
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenu(true)}
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-bold">
                {activeTab?.label ?? "Dashboard"}
              </h1>
              <p className="hidden text-sm text-slate-500 sm:block">
                Manage your Silver Cap Sydney operations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              void loadData(false);
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-60 sm:px-4"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <XCircle className="mt-0.5 shrink-0" size={18} />
              <div className="flex-1">{error}</div>
              <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
                <X size={17} />
              </button>
            </div>
          )}

          {notice && (
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
              <div className="flex-1">{notice}</div>
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice">
                <X size={17} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500">
              <LoaderCircle className="animate-spin" size={22} />
              Loading admin data...
            </div>
          ) : (
            <>
              {tab === "overview" && (
                <>
                  <div className="rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
                    <p className="text-sm font-medium text-slate-300">
                      Silver Cap Sydney Operations
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                      Welcome to your admin panel
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                      Review incoming requests, confirm journeys, and coordinate
                      drivers from one place.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTab("bookings")}
                      className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                    >
                      Manage bookings
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "Total bookings", value: counts.total, icon: CalendarDays, style: "bg-blue-50 text-blue-700" },
                      { label: "Pending requests", value: counts.pending, icon: Clock, style: "bg-amber-50 text-amber-700" },
                      { label: "Active journeys", value: counts.active, icon: CarFront, style: "bg-violet-50 text-violet-700" },
                      { label: "Completed journeys", value: counts.completed, icon: CheckCircle2, style: "bg-green-50 text-green-700" },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                            <span className={`rounded-xl p-2.5 ${stat.style}`}>
                              <Icon size={19} />
                            </span>
                          </div>
                          <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold">Recent bookings</h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Latest customer requests
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTab("bookings")}
                        className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                      >
                        View all
                      </button>
                    </div>
                    {renderBookings(5)}
                  </section>
                </>
              )}

              {tab === "bookings" && (
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold">All bookings</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review each request, update its status, and assign drivers.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search reference, customer, phone, location..."
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-600"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600"
                    >
                      <option value="ALL">All statuses</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-sm text-slate-500">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                  </p>
                  {renderBookings()}
                </section>
              )}

              {tab === "drivers" && renderResources("drivers", drivers)}
              {tab === "vehicles" && renderResources("vehicles", vehicles)}
              {tab === "services" && renderResources("services", services)}
            </>
          )}

          <footer className="border-t border-slate-200 pt-5 text-xs text-slate-500">
            Silver Cap Sydney Admin Panel · Keep customer and driver information confidential.
          </footer>
        </main>
      </div>
    </div>
  );
}
