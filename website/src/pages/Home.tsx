import { Hero } from "../components/Hero";
import { FeatureSkillDemo } from "../components/FeatureSkillDemo";
import { FeatureTodoGuardrail } from "../components/FeatureTodoGuardrail";
import { FeatureStressTest } from "../components/FeatureStressTest";
import { FeatureMultiAgent } from "../components/FeatureMultiAgent";
import { ROISection } from "../components/ROISection";
import { BottomCTA } from "../components/BottomCTA";

export function Home() {
  return (
    <>
      <Hero />
      <div id="features">
        <FeatureSkillDemo />
        <FeatureTodoGuardrail />
        <FeatureStressTest />
        <FeatureMultiAgent />
      </div>
      <ROISection />
      <BottomCTA />
    </>
  );
}
