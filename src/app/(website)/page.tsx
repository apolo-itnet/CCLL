import HeroSection from "@/components/website/HeroSection";
import ServicesSection from "@/components/website/ServicesSection";
import DoctorsSection from "@/components/website/DoctorsSection";
import PackagesSection from "@/components/website/PackagesSection";
import NewsSection from "@/components/website/NewsSection";
import CorporateClients from "@/components/website/CorporateClients";
import TestimonialsSection from "@/components/website/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <DoctorsSection />
      <PackagesSection />
      <NewsSection />
      <CorporateClients />
      <TestimonialsSection />
    </>
  );
}
