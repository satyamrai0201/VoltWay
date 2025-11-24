import HeroSection from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onHowItWorksClick={() => console.log("How it works clicked")}
        onGetStartedClick={() => console.log("Get started clicked")}
      />
    </div>
  );
}
