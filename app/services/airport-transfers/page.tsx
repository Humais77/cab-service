import ServiceLandingPage from "@/components/ServiceLandingPage";
import type { ServiceLandingData } from "@/components/ServiceLandingPage";

const data: ServiceLandingData = {
  eyebrow: "AIRPORT TRANSFERS",
  title: "Smooth landings, every time.",
  intro: "Start or finish your trip with a comfortable airport transfer. Arrange your pickup and destination in advance, with your journey details in one place.",
  image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=90",
  imageAlt: "Passenger aircraft in the sky",
  benefits: [
    "Plan your pickup and drop-off ahead of time",
    "A comfortable ride to or from the airport",
    "Suitable for holidays, family trips and business travel",
    "Share your trip requirements when booking",
  ],
  sections: [
    { title: "Plan ahead", text: "Enter your flight-day pickup details in the booking form so your journey can be arranged around your itinerary." },
    { title: "Travel comfortably", text: "Choose a vehicle that suits your passengers and luggage requirements." },
    { title: "A simpler arrival", text: "Reduce last-minute transport decisions by arranging your airport ride before travel day." },
  ],
};

export default function AirportTransfersPage() {
  return <ServiceLandingPage data={data} />;
}