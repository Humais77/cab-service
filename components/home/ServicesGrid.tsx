import { Plane, CarFront, BriefcaseBusiness, Users, ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionHeading } from "./AboutSection";

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    text: "Enjoy stress-free airport pickups and drop-offs with professional drivers and on-time service.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: CarFront,
    title: "General Transfers",
    text: "Comfortable, convenient rides for daily travel, family outings and special occasions.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate Transfers",
    text: "Professional transportation for business meetings, events and executive travel.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
  },
  {
    icon: Users,
    title: "Maxi Silver Cap Sydney",
    text: "Extra room for groups, luggage, family trips and comfortable journeys together.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=85",
  },
];

export default function ServicesGrid() {
  return (
    <section className="bg-[#f8f9fb] py-[57px] md:py-[95px]" id="services">
      <div className="container-cab">
        <div className="mb-[38px] flex flex-col items-start justify-between gap-4 max-[780px]:items-start lg:flex-row lg:items-end">
          <div className="max-w-[570px]">
            <SectionHeading
              eyebrow="WHAT WE OFFER"
              title="Services for Every Journey"
              text="From everyday travel to special trips, find a ride that suits your plans."
            />
          </div>
          <a href="#booking" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[2px] border border-transparent bg-navy px-[19px] py-[13px] text-sm font-[750] text-white transition-transform hover:-translate-y-0.5 hover:bg-[#293954] max-[480px]:min-h-[52px] max-[480px]:px-[22px] max-[480px]:text-[15px] shrink-0 mb-1.5">
            Book a Cab <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group overflow-hidden rounded-none border border-[#e8eaf0] bg-white transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[5px] hover:shadow-[0_15px_35px_rgba(18,29,50,0.09)]"
              >
                <div className="relative h-[225px] overflow-hidden bg-[#e4e7ed] md:h-[230px] lg:h-[195px] max-[480px]:h-[225px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-[450ms] group-hover:scale-[1.055]"
                  />
                  <span className="absolute left-3 top-3 bg-[#0c1527]/80 px-[9px] py-[5px] text-[11px] tracking-[1px] text-white">
                    0{index + 1}
                  </span>
                </div>
                <div className="relative px-[19px] pt-[23px] pb-5">
                  <span className="relative -mt-[44px] mb-[17px] box-content grid h-[42px] w-[42px] place-items-center border-4 border-white bg-accent text-navy">
                    <Icon size={21} />
                  </span>
                  <h3 className="mb-2.5 mt-0 font-serif text-[20px] font-normal leading-[1.4] text-navy max-[480px]:text-[22px]">
                    {service.title}
                  </h3>
                  <p className="m-0 min-h-[80px] text-[13px] leading-[1.8] text-muted max-[1080px]:min-h-0 max-[480px]:text-[15px]">
                    {service.text}
                  </p>
                  <a href="#booking" className="mt-[18px] inline-flex items-center gap-2 text-[12px] font-[750] text-[#8b6a3c] max-[480px]:text-[14px]">
                    Book this service <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}