import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

const buttonBlue =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[28px] border border-site-blue bg-site-blue px-[19px] py-[13px] text-[15px] font-semibold !text-white no-underline transition-transform hover:-translate-y-px hover:bg-[#0068df]";

export default function StickyBookingCard() {
  return (
    <>
      <aside
        className="rounded-xl border border-[#e8e2d8] bg-[#fffdfa] px-[22px] py-[25px] shadow-[0_8px_28px_rgba(33,27,17,0.06)] max-[1050px]:px-[17px] max-[1050px]:py-[21px]"
        aria-label="Quick booking"
      >
        <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
          YOUR JOURNEY STARTS HERE
        </span>
        <h2 className="mb-2.5 mt-[11px] font-serif text-[29px] font-normal leading-[1.16] tracking-[-0.5px]">
          Where would you like to go?
        </h2>
        <p className="m-0 text-[15px] leading-[1.65] text-[#64615c]">
          Enter your journey details in our booking form to continue.
        </p>
        <div className="mb-[18px] mt-[22px] grid border-t border-site-line">
          <span className="flex items-center gap-2.5 border-b border-site-line py-[14px] text-sm text-[#333]">
            <MapPin size={18} className="flex-shrink-0 text-[#6b6a66]" /> Pickup &amp; destination
          </span>
          <span className="flex items-center gap-2.5 border-b border-site-line py-[14px] text-sm text-[#333]">
            <CalendarDays size={18} className="flex-shrink-0 text-[#6b6a66]" /> Date &amp; pickup time
          </span>
        </div>
        <Link className={`${buttonBlue} w-full`} href="/#booking">
          Plan your journey <ArrowRight size={18} />
        </Link>
        <small className="mt-[15px] block text-xs leading-[1.6] text-[#6c6964]">
          Need help? Visit our{" "}
          <Link href="/contact" className="text-[#006cf0]">
            contact page
          </Link>
          .
        </small>
      </aside>

      <Link
        className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-4 right-4 z-[90] hidden min-h-14 items-center justify-center gap-2.5 rounded-[30px] bg-site-blue px-5 py-[13px] text-[17px] font-[650] !text-white no-underline shadow-[0_7px_24px_rgba(0,0,0,0.22)] max-[800px]:flex"
        href="/#booking"
      >
        Book your ride <ArrowRight size={19} />
      </Link>
    </>
  );
}