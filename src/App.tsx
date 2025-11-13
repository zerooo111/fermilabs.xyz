import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import LabsHeroSection from "@/components/LabsHeroSection";
import NoiseOverlay from "@/components/NoiseOverlay";
import ProjectsSection from "@/components/ProjectsSection";

function App() {
  return (
    <div className="w-screen flex flex-col items-center">
      <Header />
      <main className="flex flex-col w-full">
        <LabsHeroSection />
        <ProjectsSection />
      </main>
      <Footer />
      <NoiseOverlay />
    </div>
  );
}

export default App;
