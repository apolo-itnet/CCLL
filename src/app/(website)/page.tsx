import HeroSection from "@/components/website/HeroSection";
import ServicesSection from "@/components/website/ServicesSection";
import DoctorsSection from "@/components/website/DoctorsSection";
import PackagesSection from "@/components/website/PackagesSection";
import NewsSection from "@/components/website/NewsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <DoctorsSection />
      <PackagesSection />
      <NewsSection />
    </>
  );
}