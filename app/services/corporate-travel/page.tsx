import ServiceLandingPage from "@/components/ServiceLandingPage";
import type { ServiceLandingData } from "@/components/ServiceLandingPage";

const data: ServiceLandingData = {
  eyebrow: "BUSINESS TRAVEL",
  title: "Arrive ready for business.",
  intro: "Make business journeys easier to plan with private transport for meetings, conferences, airport transfers and client visits. Share the itinerary and passenger requirements when you enquire.",
  image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
  imageAlt: "Modern office building and workspace",
  benefits: [
    "Transport for meetings, conferences and client visits",
    "Plan journeys around your work schedule",
    "Options for individual travellers and groups",
    "A straightforward enquiry and booking process",
  ],
  sections: [
    { title: "Make the schedule work", text: "Plan rides around your meeting times and locations to keep the day's transport organised." },
    { title: "A professional arrival", text: "Choose a comfortable ride for client visits, events and important appointments." },
    { title: "Support for your itinerary", text: "Include passenger numbers, luggage and any special requirements with your booking request." },
  ],
};

export default function CorporateTravelPage() {
  return <ServiceLandingPage data={data} />;
}
