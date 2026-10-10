import { AuroraBackground } from "@/components/aurora-background";
import { LearnerGate } from "@/components/learner-gate";
import { LearnerDashboard } from "@/components/learner-dashboard";

export default function Home() {
  return (
    <LearnerGate>
      <main className="relative min-h-screen overflow-hidden bg-[#fffaf7] text-[#321c26] dark:bg-[#1b1118] dark:text-[#fff5f0]">
        <AuroraBackground />
        <LearnerDashboard />
      </main>
    </LearnerGate>
  );
}
