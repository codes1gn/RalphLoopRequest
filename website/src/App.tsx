import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FeatureSkillDemo } from "./components/FeatureSkillDemo";
import { FeatureTodoGuardrail } from "./components/FeatureTodoGuardrail";
import { FeatureStressTest } from "./components/FeatureStressTest";
import { FeatureMultiAgent } from "./components/FeatureMultiAgent";
import { ROISection } from "./components/ROISection";
import { BottomCTA } from "./components/BottomCTA";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <div id="features">
          <FeatureSkillDemo />
          <FeatureTodoGuardrail />
          <FeatureStressTest />
          <FeatureMultiAgent />
        </div>
        <ROISection />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
