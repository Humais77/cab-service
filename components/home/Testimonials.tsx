import { Star, ArrowRight } from "lucide-react";
import { SectionHeading } from "./AboutSection";

const reviews = [
  { name: "Alex Morgan", location: "Airport Transfer", quote: "A comfortable ride, a courteous driver and a smooth journey from pickup to destination." },
  { name: "Sarah Williams", location: "Family Travel", quote: "Booking was straightforward, and the spacious vehicle made travelling with family easier." },
  { name: "Daniel Brooks", location: "Corporate Travel", quote: "Professional service and a comfortable travel experience. Exactly what business travel needs." },
];

export default function Testimonials() {
  return (
    <section className="bg-[#faf7f1] py-[57px] md:py-[95px]">
      <div className="container-cab grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-[75px]">
        <div className="lg:sticky lg:top-[120px]">
          <SectionHeading
            eyebrow="THE EXPERIENCE MATTERS"
            title="Every Ride Should Leave You Smiling."
            text="A great journey is about more than getting from A to B. It's about how you feel along the way."
          />
          <a href="#booking" className="group mt-6 inline-flex items-center gap-2.5 border-b border-accent pb-1.5 text-[13px] font-[750] text-navy max-[480px]:text-[15px]">
            Start your journey <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-[17px] sm:grid-cols-2 max-[480px]:grid-cols-1">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="flex min-h-[230px] flex-col border border-line bg-white p-[23px] max-[480px]:p-[22px]"
            >
              <div className="flex gap-[3px] text-[#b58b4d]" aria-label="5 out of 5 stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="mb-6 mt-[19px] flex-1 font-serif text-[15px] leading-[1.85] text-[#616b7a] max-[480px]:text-[16px]">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="flex items-center gap-[11px]">
                <span className="grid h-[37px] w-[37px] place-items-center rounded-full bg-[#f1e6d4] font-serif text-[17px] text-navy">
                  {review.name.charAt(0)}
                </span>
                <div className="flex flex-col">
                  <strong className="text-[13px] text-navy max-[480px]:text-[14px]">{review.name}</strong>
                  <small className="text-[11px] text-[#9097a3] max-[480px]:text-[12px]">{review.location}</small>
                </div>
              </div>
            </article>
          ))}
          <p className="col-span-full m-0 text-[11px] leading-[1.7] text-[#858c97] max-[480px]:col-span-1 max-[480px]:text-[12px]">
            Illustrative sample reviews for the design demo. Replace with
            genuine, authorized customer testimonials before launch.
          </p>
        </div>
      </div>
    </section>
  );
}