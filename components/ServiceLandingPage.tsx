import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import TransparentHeader from "@/components/TransparentHeader";
import StickyBookingCard from "@/components/StickyBookingCard";
import Footer from "./home/Footer";

export type ServiceLandingData = {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  benefits: string[];
  sections: { title: string; text: string }[];
};

const buttonBlue =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[28px] border border-site-blue bg-site-blue px-[19px] py-[13px] text-[15px] font-semibold !text-white no-underline transition-transform hover:-translate-y-px hover:bg-[#0068df]";
const buttonDark =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[28px] border border-[#1b1c1e] bg-[#1b1c1e] px-[19px] py-[13px] text-[15px] font-semibold !text-white no-underline transition-transform hover:-translate-y-px hover:bg-[#333]";

export default function ServiceLandingPage({ data }: { data: ServiceLandingData }) {
  return (
    <main className="min-h-screen bg-site-cream text-site-ink">
      <TransparentHeader />

      <section className="mx-auto grid max-w-[1340px] grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-[clamp(30px,6vw,80px)] px-[5%] pb-[70px] pt-12 max-[800px]:grid-cols-1 max-[800px]:gap-[25px] max-[800px]:px-[22px] max-[800px]:pb-12 max-[800px]:pt-8 max-[560px]:px-[18px] max-[560px]:pb-[42px] max-[560px]:pt-7">
        <div className="py-[15px]">
          <div className="mb-[26px] flex flex-wrap items-center gap-2 text-[13px] text-[#777] max-[560px]:mb-[21px] max-[560px]:text-xs [&_a:hover]:underline">
            <Link href="/">Home</Link>
            <ChevronRight size={14} />
            <Link href="/services">Our services</Link>
            <ChevronRight size={14} />
            <span>{data.title}</span>
          </div>
          <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
            {data.eyebrow}
          </span>
          <h1 className="mb-[18px] mt-3.5 max-w-[620px] font-serif text-[clamp(43px,5.1vw,68px)] font-normal leading-[1.05] tracking-[-1.8px] max-[560px]:text-[clamp(39px,11vw,52px)] max-[560px]:tracking-[-1px]">
            {data.title}
          </h1>
          <p className="mb-6 mt-0 max-w-[560px] text-[17px] leading-[1.75] text-[#62615e] max-[560px]:text-[17px]">
            {data.intro}
          </p>
          <Link className={buttonBlue} href="/#booking">
            Plan your journey <ArrowRight size={18} />
          </Link>
        </div>

        <div className="aspect-[1.12/1] min-h-[360px] overflow-hidden rounded-lg bg-[#e6e0d7] max-[800px]:min-h-[280px] max-[800px]:max-h-[430px] max-[560px]:min-h-[230px]">
          <img
            src={data.image}
            alt={data.imageAlt}
            className="block h-full w-full min-h-[360px] object-cover max-[800px]:min-h-[280px] max-[560px]:min-h-[230px]"
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_300px] items-start gap-[clamp(28px,5vw,72px)] px-7 pb-[90px] max-[1050px]:grid-cols-[minmax(0,1fr)_270px] max-[1050px]:gap-[22px] max-[800px]:grid-cols-1 max-[800px]:pb-[65px] max-[560px]:px-[19px] max-[560px]:pb-[55px]">
        <article className="min-w-0">
          <section className="pb-[42px] pt-2.5">
            <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
              TRAVEL, MADE MORE COMFORTABLE
            </span>
            <h2 className="mb-4 mt-[13px] font-serif text-[clamp(34px,4vw,48px)] font-normal leading-[1.12] tracking-[-0.9px] max-[560px]:text-[36px]">
              A smoother way to get there.
            </h2>
            <p className="max-w-[760px] text-[17px] leading-[1.8] text-[#55534f] max-[560px]:text-[17px]">
              {data.intro}
            </p>
            <ul className="mt-[25px] grid list-none gap-3.5 p-0">
              {data.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2.5 text-base leading-[1.55] text-[#373632]"
                >
                  <Check size={19} className="mt-0.5 flex-shrink-0 text-[#13784b]" />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <div className="grid grid-cols-2 gap-7 border-t border-site-line py-[35px] pb-[45px] max-[560px]:grid-cols-1 max-[560px]:gap-[25px]">
            {data.sections.map((section, index) => (
              <section key={section.title} className="px-2 pb-2 pt-0">
                <span className="mb-5 inline-flex text-[13px] text-[#8b8982]">
                  0{index + 1}
                </span>
                <h3 className="mb-2.5 mt-0 text-[22px] font-[550] leading-[1.3] max-[560px]:text-[23px]">
                  {section.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.75] text-[#5d5b56] max-[560px]:text-base">
                  {section.text}
                </p>
              </section>
            ))}
          </div>

          <section className="rounded-[9px] bg-[#f0ece4] px-[30px] py-[35px] max-[560px]:px-[21px] max-[560px]:py-[25px]">
            <span className="inline-block text-xs font-[650] uppercase leading-[1.5] tracking-[1.5px] text-site-muted">
              READY WHEN YOU ARE
            </span>
            <h2 className="mb-3 mt-3 font-serif text-[clamp(30px,3vw,40px)] font-normal leading-[1.15]">
              Make your next journey a little easier.
            </h2>
            <p className="text-base leading-[1.7] text-[#5e5b55]">
              Tell us where you need to go and prepare your booking request.
            </p>
            <Link className={`${buttonDark} mt-[7px]`} href="/#booking">
              Book a ride <ArrowRight size={18} />
            </Link>
          </section>
        </article>
   <div className="hidden max-[800px]:block">
          <StickyBookingCard />
        </div>
        <div className="sticky top-[108px] max-[800px]:hidden">
          <StickyBookingCard />
        </div>
      </div>

      <Footer />
    </main>
  );
}