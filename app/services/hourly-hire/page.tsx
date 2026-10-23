import ServiceLandingPage from "@/components/ServiceLandingPage";
import type { ServiceLandingData } from "@/components/ServiceLandingPage";

const data: ServiceLandingData = {
  eyebrow: "ON-DEMAND CAB BOOKINGS",
  title: "Need a cab now?",
  intro:
    "Book a cab for immediate pickup anywhere in Sydney. Our dispatch will assign the nearest available driver — no waiting on hold.",
  image:
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=90",
  imageAlt: "Comfortable vehicle interior",
  benefits: [
    "Fast pickup — nearest available driver assigned",
    "Fixed price quoted before you confirm",
    "Available across Sydney, 24 hours a day",
    "Pay by card in the cab or online at booking",
  ],
  sections: [
    {
      title: "Book in under a minute",
      text: "Enter your pickup and destination, choose your vehicle, and confirm — dispatch handles the rest.",
    },
    {
      title: "Track your driver",
      text: "Receive your driver's details and live ETA once the booking is confirmed.",
    },
    {
      title: "Fixed fares, no surprises",
      text: "The fare you see at checkout is the fare you pay — no surge pricing on pre-booked trips.",
    },
  ],
};

export default function OnDemandPage() {
  return <ServiceLandingPage data={data} />;
}