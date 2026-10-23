import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Phone, ArrowLeft } from "lucide-react";

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

// Separate component that reads searchParams inside Suspense
async function BookingReference({ searchParams }: Props) {
  const { ref } = await searchParams;
  const reference = ref && /^CAB-[A-F0-9]{8}$/.test(ref) ? ref : null;

  if (!reference) return null;

  return (
    <div className="mb-6 rounded-xl bg-slate-100 p-4">
      <p className="text-sm text-slate-500">Your booking reference</p>
      <p className="mt-1 text-xl font-bold tracking-wide">{reference}</p>
      <p className="mt-2 text-sm text-slate-500">
        Keep this reference if you contact our support team.
      </p>
    </div>
  );
}

// Simple fallback that doesn't shift layout
function ReferenceSkeleton() {
  return (
    <div className="mb-6 rounded-xl bg-slate-100 p-4">
      <p className="text-sm text-slate-500">Your booking reference</p>
      <div className="mt-2 h-6 w-32 animate-pulse rounded bg-slate-300" />
      <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-300" />
    </div>
  );
}

export default function ThankYouPage({ searchParams }: Props) {
  const phone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "";

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-900">
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 size={36} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-700">
          Booking request received
        </p>

        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
          Thank you for choosing us!
        </h1>

        <p className="mb-6 leading-7 text-slate-600">
          Your request has been submitted successfully. Our team will
          contact you shortly to confirm your journey and arrange your cab.
        </p>

        {/* Dynamic reference streams in inside Suspense */}
        <Suspense fallback={<ReferenceSkeleton />}>
          <BookingReference searchParams={searchParams} />
        </Suspense>

        {phone && (
          <a
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            <Phone size={18} />
            Contact support: {phone}
          </a>
        )}

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 py-3 font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to homepage
        </Link>
      </section>
    </main>
  );
}