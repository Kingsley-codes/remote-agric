import CTASection from "@/components/aboutPage/CTASection";
import HeroSection from "@/components/aboutPage/HeroSection";
import MissionSection from "@/components/aboutPage/MissionSection";
import StorySection from "@/components/aboutPage/StorySection";
import ValuesSection from "@/components/aboutPage/ValuesSection";

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <MissionSection />
        <StorySection />
        <ValuesSection />
        <CTASection />  
      </main>
    </>
  );
}