import Link from "next/link";
import { ArrowRight, Clock3, HeartHandshake, ShieldCheck, CarFront, Check } from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import StickyBookingCard from "@/components/StickyBookingCard";
import Footer from "@/components/home/Footer";

const reasons = [
  { icon: ShieldCheck, title: "A comfort-first approach", text: "We design the experience around a smooth, considered journey from pickup to arrival." },
  { icon: Clock3, title: "Planned around your time", text: "Share your pickup time and journey details so your transport request reflects your schedule." },
  { icon: CarFront, title: "Options for different journeys", text: "From airport transfers to group travel and city-to-city trips, choose a service that suits your plans." },
  { icon: HeartHandshake, title: "Clear, helpful communication", text: "Have a question or a special request? Get in touch with the details so our team can guide you." },
];

const buttonBlue =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[28px] border border-site-blue bg-site-blue px-[19px] py-[13px] text-[15px] font-semibold !text-white no-underline transition-transform hover:-translate-y-px hover:bg-[#0068df]";
const buttonDark =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[28px] border border-[#1b1c1e] bg-[#1b1c1e] px-[19px] py-[13px] text-[15px] font-semibold !text-white no-underline transition-transform hover:-translate-y-px hover:bg-[#333]";

export default function WhyChooseUsPage() {
  return (
    <main className="min-h-screen bg-site-cream text-site-ink">
      <TransparentHeader />

      <section className="mx-auto grid max-w-[1340px] grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-[clamp(30px,6vw,80px)] px-[5%] pb-[70px] pt-12 max-[800px]:grid-cols-1 max-[800px]:gap-[25px] max-[800px]:px-[22px] max-[800px]:pb-12 max-[800px]:pt-8 max-[560px]:px-[18px] max-[560px]:pb-[42px] max-[560px]:pt-7">
        <div className="py-[15px]">
          <div className="mb-[26px] flex flex-wrap items-center gap-2 text-[13px] text-[#777] max-[560px]:mb-[21px] max-[560px]:text-xs [&_a:hover]:underline">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Why choose us</span>
          </div>
          <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
            THE Silver Cab Sydney DIFFERENCE
          </span>
          <h1 className="mb-[18px] mt-3.5 max-w-[620px] font-serif text-[clamp(43px,5.1vw,68px)] font-normal leading-[1.05] tracking-[-1.8px] max-[560px]:text-[clamp(39px,11vw,52px)] max-[560px]:tracking-[-1px]">
            Good journeys start with feeling taken care of.
          </h1>
          <p className="mb-6 mt-0 max-w-[560px] text-[17px] leading-[1.75] text-[#62615e]">
            We believe getting there should feel straightforward. Our focus is on
            comfort, thoughtful planning and helping you find the right ride for
            your journey.
          </p>
          <Link className={buttonBlue} href="/#booking">
            Plan your journey <ArrowRight size={18} />
          </Link>
        </div>

        <div className="aspect-[1/1.05] min-h-[360px] overflow-hidden rounded-lg bg-[#e6e0d7] max-[800px]:min-h-[280px] max-[800px]:max-h-[430px] max-[560px]:min-h-[230px]">
          <img
            className="block h-full w-full min-h-[360px] object-cover max-[800px]:min-h-[280px] max-[560px]:min-h-[230px]"
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=90"
            alt="Premium car ready for a journey"
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_300px] items-start gap-[clamp(28px,5vw,72px)] px-7 pb-[90px] max-[1050px]:grid-cols-[minmax(0,1fr)_270px] max-[1050px]:gap-[22px] max-[800px]:grid-cols-1 max-[800px]:pb-[65px] max-[560px]:px-[19px] max-[560px]:pb-[55px]">
        <section className="min-w-0">
          <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
            WHAT MATTERS TO US
          </span>
          <h2 className="mb-4 mt-[13px] font-serif text-[clamp(34px,4vw,48px)] font-normal leading-[1.12] tracking-[-0.9px] max-[560px]:text-[36px]">
            Thoughtful travel, at every step.
          </h2>
          <p className="max-w-[790px] text-lg leading-[1.8] text-[#55534f] max-[560px]:text-[17px]">
            Whether you are heading to the airport, travelling for work or
            planning a trip with family, we want the booking process to feel
            clear and your journey to feel comfortable.
          </p>

          <div className="mb-[45px] mt-[35px] grid grid-cols-2 gap-[18px] max-[560px]:grid-cols-1">
            {reasons.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className="rounded-lg border border-site-line bg-white/35 p-[22px]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-[#eeebe4]">
                    <Icon size={24} />
                  </span>
                  <small className="text-[#85827b]">0{index + 1}</small>
                </div>
                <h3 className="mb-[9px] mt-0 text-xl font-[550]">{title}</h3>
                <p className="m-0 text-[15px] leading-[1.7] text-[#5e5b56]">
                  {text}
                </p>
              </article>
            ))}
          </div>

          <section className="rounded-[9px] bg-[#f0ece4] p-[30px] max-[560px]:px-[21px] max-[560px]:py-[25px]">
            <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
              OUR PROMISE
            </span>
            <h2 className="mb-0 mt-3 font-serif text-[35px] font-normal leading-[1.15] max-[560px]:text-[32px]">
              Clear details. Comfortable travel.
            </h2>
            <ul className="mt-[25px] grid list-none gap-3.5 p-0 max-[560px]:[&_li]:text-base">
              {[
                "Simple booking enquiries",
                "Services for different travel needs",
                "A focus on passenger comfort",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-base leading-[1.55] text-[#373632]">
                  <Check size={19} className="mt-0.5 flex-shrink-0 text-[#13784b]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link className={`${buttonDark} mt-6`} href="/contact">
              Talk to our team <ArrowRight size={18} />
            </Link>
          </section>
        </section>

        <aside className="sticky top-[108px] max-[800px]:hidden">
          <StickyBookingCard />
        </aside>
      </div>

      <Footer />
    </main>
  );
}