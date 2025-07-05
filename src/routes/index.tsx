import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import { createFileRoute } from "@tanstack/react-router";

/** @ts-expect-error - This is a file route */
export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <main className="container-2xl">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
