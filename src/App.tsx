import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import NoiseOverlay from "@/components/NoiseOverlay";
import { ArrowRightIcon } from "@phosphor-icons/react";

function App() {
  useEffect(() => {
    console.log((window as Window & { UnicornStudio?: unknown }).UnicornStudio);
  }, []);

  return (
    <div className="w-screen flex flex-col items-center">
      <Header />
      <main className="border-x border-rock/20 flex-col gap-40 container-2xl justify-center items-center">
        <HeroSection />
        <FeaturesSection />
        <div className="flex flex-col items-center justify-between py-20">
          <h2 className="font-display text-7xl mb-6 leading-tight text-rock">
            Ready to experience the fastest DEX?
          </h2>
          <p className="text-2xl text-rock/80  mx-auto">
            Deploy liquidity, fire off your first trade, or dive into our SDK in
            minutes.
          </p>

          <div className="mt-16 flex gap-6">
            <button
              type="button"
              className="hover:brightness-125 bg-rock text-dark-forest group px-8 py-4 text-2xl font-medium flex items-center gap-4 relative overflow-hidden duration-150 ease-out"
            >
              Launch App
              <ArrowRightIcon
                weight="bold"
                size={24}
                className="group-hover:scale-110 origin-center
                group-hover:-rotate-45 transition-all duration-200 relative"
              />
            </button>

            <button
              type="button"
              className="hover:brightness-120 bg-amber-200 group text-dark-forest px-8 py-4 text-2xl font-medium flex items-center gap-4 relative overflow-hidden duration-150 ease-out"
            >
              Join Discord
              <ArrowRightIcon
                weight="bold"
                size={24}
                className="group-hover:scale-110 origin-center
                group-hover:-rotate-45 transition-all duration-200 relative"
              />
            </button>

            <button
              type="button"
              className="hover:brightness-120 border-2 border-rock/30 hover:border-rock/50 group text-rock/80 hover:text-rock px-8 py-4 text-2xl font-medium flex items-center gap-4 relative overflow-hidden duration-150 ease-out"
            >
              Check out SDK
              <ArrowRightIcon
                weight="bold"
                size={24}
                className="group-hover:scale-110 origin-center
                group-hover:-rotate-45 transition-all duration-200 relative"
              />
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <NoiseOverlay />
    </div>
  );
}

export default App;
