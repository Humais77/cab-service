import ServiceLandingPage from "@/components/ServiceLandingPage";
import type { ServiceLandingData } from "@/components/ServiceLandingPage";

const data: ServiceLandingData = {
  eyebrow: "LONG-DISTANCE TRAVEL",
  title: "City-to-city rides",
  intro: "Make the journey between cities feel simpler with private transport arranged around your preferred pickup time. Travel door to door without changing between trains, buses or flights.",
  image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=90",
  imageAlt: "Scenic road for a long-distance journey",
  benefits: [
    "Door-to-door travel between your chosen locations",
    "A pickup time planned around your schedule",
    "Space to relax, work or enjoy the scenery",
    "A useful option for business trips and personal travel",
  ],
  sections: [
    { title: "Go at your own pace", text: "Choose a pickup time that suits your plans and let the journey fit around your day." },
    { title: "Travel with fewer changes", text: "Enjoy a direct journey between your pickup and destination instead of coordinating several transport connections." },
    { title: "For work or a getaway", text: "Whether you are travelling for a meeting, visiting family or planning a weekend away, arrange a ride for your itinerary." },
  ],
};

export default function CityToCityPage() {
  return <ServiceLandingPage data={data} />;
}
