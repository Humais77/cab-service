import ServiceLandingPage from "@/components/ServiceLandingPage";
import type { ServiceLandingData } from "@/components/ServiceLandingPage";

const data: ServiceLandingData = {
  eyebrow: "FLEXIBLE CHAUFFEUR HIRE",
  title: "Your day, your schedule.",
  intro: "When your day involves several destinations, hourly or full-day hire can make the journey easier to coordinate. Share your itinerary and tell us what kind of day you are planning.",
  image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=90",
  imageAlt: "Comfortable vehicle interior",
  benefits: [
    "Useful for appointments and multiple destinations",
    "A flexible option for shopping, events and sightseeing",
    "Plan transport around your schedule",
    "Tell us your expected duration when enquiring",
  ],
  sections: [
    { title: "One day, several stops", text: "Arrange your transport for a day that takes you to meetings, appointments or different places around town." },
    { title: "Keep plans together", text: "Share your expected stops and timing in advance so your transport request is clear." },
    { title: "Personal or professional", text: "Hourly hire can suit a business itinerary, a special event or a day spent exploring." },
  ],
};

export default function HourlyHirePage() {
  return <ServiceLandingPage data={data} />;
}
