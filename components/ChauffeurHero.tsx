import { ArrowRight } from "lucide-react";

export default function ChauffeurHero() {
  return (
    <section className="bl-hero" aria-labelledby="bl-hero-title">
      <div className="bl-hero-photo" aria-hidden="true" />
      <div className="bl-hero-shade" aria-hidden="true" />
      <div className="bl-hero-content">
        <p className="bl-eyebrow">COMFORTABLE, RELIABLE PRIVATE RIDES</p>
        <h1 id="bl-hero-title">Your chauffeur<br className="bl-desktop-break" /> awaits.</h1>
        <p className="bl-hero-subtitle">Travel on your schedule, with comfort at every turn.</p>
        <a className="bl-hero-cta" href="#booking">Plan your journey <ArrowRight size={19} /></a>
      </div>
      <a className="bl-hero-scroll" href="#booking">Book your ride ↓</a>
    </section>
  );
}
