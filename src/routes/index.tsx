import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

/** @ts-expect-error - This is a file route */
export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  useEffect(() => {
    console.log(window.UnicornStudio);
  }, []);
  return (
    <main className="container-2xl">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
