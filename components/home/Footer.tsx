import { Phone, MapPin, Clock3, ArrowRight } from "lucide-react";

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#home" className="inline-flex flex-shrink-0 items-center gap-3">
      <span className="grid h-[45px] w-[45px] place-items-center rounded-[3px] bg-accent font-serif text-[30px] font-bold italic leading-none text-navy max-[780px]:h-10 max-[780px]:w-10 max-[780px]:text-[26px]">
        S
      </span>
      <span className="flex flex-col leading-[1.4]">
        <strong className={`text-[20px] font-[750] tracking-[-0.7px] max-[1080px]:text-lg max-[780px]:text-[18px] ${light ? "text-white" : "text-ink"}`}>
          Silver Cap Sydney
        </strong>
        <small className={`mt-[3px] text-[8px] font-bold tracking-[1.5px] max-[780px]:text-[10px] ${light ? "text-[#a3adbd]" : "text-[#818795]"}`}>
          YOUR JOURNEY, OUR PRIORITY
        </small>
      </span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#080f1e] text-[#d5dbe5]">
      <div className="container-cab grid grid-cols-1 gap-[34px] py-12 lg:grid-cols-[1.3fr_0.75fr_0.9fr_1fr] lg:gap-[50px] lg:py-[65px] lg:pb-[55px]">
        <div>
          <Brand light />
          <p className="my-6 max-w-[280px] text-[13px] leading-[1.9] text-[#a5afbf] max-[480px]:text-[14px]">
            Thoughtful travel. Comfortable rides. Reliable service for
            wherever life takes you.
          </p>
          <a href="tel:+61000000000" className="inline-flex items-center gap-2.5 text-[13px] font-[650] text-accent-light max-[480px]:text-[14px]">
            <Phone size={17} /> Speak to our team
          </a>
        </div>

        <div className="flex flex-col items-start gap-3">
          <h3 className="mb-3 mt-1 text-[14px] font-bold text-white">Quick Links</h3>
          {[
            ["Home", "#home"],
            ["About Us", "#about"],
            ["Our Services", "#services"],
            ["Why Choose Us", "#why-us"],
            ["FAQs", "#faq"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="text-[13px] text-[#aab3c1] hover:text-accent-light max-[480px]:text-[14px]">
              {label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3">
          <h3 className="mb-3 mt-1 text-[14px] font-bold text-white">Our Services</h3>
          {["Airport Transfers", "General Transfers", "Corporate Travel", "Maxi Cab", "Accessible Transport"].map((label) => (
            <a key={label} href="#booking" className="text-[13px] text-[#aab3c1] hover:text-accent-light max-[480px]:text-[14px]">
              {label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3">
          <h3 className="mb-3 mt-1 text-[14px] font-bold text-white">Get In Touch</h3>
          <p className="m-0 flex items-start gap-2.5 text-[13px] text-[#aab3c1] max-[480px]:text-[14px]">
            <Phone size={16} className="shrink-0 text-accent" /> Add your business phone
          </p>
          <p className="m-0 flex items-start gap-2.5 text-[13px] text-[#aab3c1] max-[480px]:text-[14px]">
            <MapPin size={16} className="shrink-0 text-accent" /> Add your service location
          </p>
          <p className="m-0 flex items-start gap-2.5 text-[13px] text-[#aab3c1] max-[480px]:text-[14px]">
            <Clock3 size={16} className="shrink-0 text-accent" /> Add your operating hours
          </p>
          <a href="#booking" className="mt-2.5 inline-flex items-center gap-2 border-b border-accent/50 pb-1.5 text-[13px] font-[650] text-accent-light max-[480px]:text-[14px]">
            Request a booking <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="container-cab flex flex-col items-start justify-between gap-4 border-t border-white/10 py-5 sm:flex-row sm:flex-wrap sm:items-center">
        <p className="m-0 text-[11px] text-[#919cad] max-[480px]:text-[12px]">© 2026 Silver Cap Sydney. All rights reserved.</p>
        <div className="flex gap-[22px]">
          <a href="#contact" className="text-[11px] text-[#919cad] hover:text-accent-light max-[480px]:text-[12px]">Privacy Policy</a>
          <a href="#contact" className="text-[11px] text-[#919cad] hover:text-accent-light max-[480px]:text-[12px]">Terms &amp; Conditions</a>
        </div>
        <a href="#home" className="text-[11px] text-[#919cad] hover:text-accent-light max-[480px]:text-[12px]">Back to top ↑</a>
      </div>
    </footer>
  );
}