import type { Metadata } from "next";
import HeroSection from "@/sections/Home/HeroSection";
import StatsSection from "@/sections/Home/StatsSection";
import CategoriesSection from "@/sections/Home/CategoriesSection";
import FeaturedTools from "@/sections/Home/Featuredtools";
import HowItWorks from "@/sections/Home/Howitworks";
import CTASection from "@/sections/Home/CtaSection";

export const metadata: Metadata = {
  title: "AINavix — Discover & Compare AI Tools",
};

export default function HomePage() {
  return (
    <div className="page-enter">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedTools />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
