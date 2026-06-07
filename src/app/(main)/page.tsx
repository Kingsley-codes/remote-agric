import HeroSection from "@/components/hompage/HeroSection";
import HowItWorks from "@/components/hompage/HowItWorks";
import FeaturedOpportunities from "@/components/hompage/FeaturedOpportunities";
import SuccessStories from "@/components/hompage/SuccessStories";
import About from "@/components/hompage/AboutSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <About />
      <HowItWorks />
      <FeaturedOpportunities />
      <SuccessStories />
    </>
  );
}
