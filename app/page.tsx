"use client";

import TransparentHeader from "@/components/TransparentHeader";
import Hero from "@/components/Hero";
import BookingBar from "@/components/BookingBar";
import ServicesShowcase from "@/components/ServicesShowcase";

import AboutSection from "@/components/home/AboutSection";
import FeatureStrip from "@/components/home/FeatureStrip";
import ServicesGrid from "@/components/home/ServicesGrid";
import SpecialServices from "@/components/home/SpecialServices";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";

import FloatingContactButtons from "@/components/FloatingContactButtons";

export default function Home() {
  return (
    <main id="home">
      <TransparentHeader />
      <Hero />
      <BookingBar />
      <ServicesShowcase />

      <AboutSection />
      <FeatureStrip />
      <ServicesGrid />
      <SpecialServices />
      <WhyUs />
      <Testimonials />
      <FAQSection />
      <CTA />
      <Footer />

      {/* Sticky WhatsApp and Phone Buttons */}
      <FloatingContactButtons />
    </main>
  );
}