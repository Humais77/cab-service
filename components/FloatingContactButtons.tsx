"use client";

import { MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";

const PHONE_NUMBER = "+61400000000"; // Replace with your actual phone number

export default function FloatingContactButtons() {
  const [phoneHovered, setPhoneHovered] = useState(false);

  const whatsappMessage = encodeURIComponent(
    "Hello! I would like to enquire about your cab service."
  );

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">

      {/* Phone Button */}
      <div
        className="relative flex items-center justify-end"
        onMouseEnter={() => setPhoneHovered(true)}
        onMouseLeave={() => setPhoneHovered(false)}
      >
        {/* Phone Number — visible on hover */}
        <div
          className={`absolute right-[calc(100%+12px)] whitespace-nowrap rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-lg transition-all duration-300 ${
            phoneHovered
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-3 opacity-0"
          }`}
          aria-hidden={!phoneHovered}
        >
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex items-center gap-2"
            tabIndex={phoneHovered ? 0 : -1}
          >
            <Phone size={16} className="text-amber-600" />
            {PHONE_NUMBER}
          </a>

          {/* Tooltip arrow */}
          <span className="absolute right-[-5px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white" />
        </div>

        <a
          href={`tel:${PHONE_NUMBER}`}
          aria-label={`Call us at ${PHONE_NUMBER}`}
          onFocus={() => setPhoneHovered(true)}
          onBlur={() => setPhoneHovered(false)}
          onClick={() => setPhoneHovered(false)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-amber-600 hover:shadow-xl active:scale-95"
        >
          <Phone
            size={25}
            strokeWidth={2.2}
            className="transition-transform duration-300 group-hover:rotate-[-12deg]"
          />
        </a>
      </div>
    </div>
  );
}