import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import LabsHeroSection from "@/components/LabsHeroSection";
import NoiseOverlay from "@/components/NoiseOverlay";
import ProjectsSection from "@/components/ProjectsSection";

function App() {
	return (
		<div className="w-screen flex flex-col items-center">
			<Header />
			<main className="md:border-x border-rock/20 flex flex-col gap-20 md:gap-40 w-full">
				<LabsHeroSection />
				<ProjectsSection />
			</main>
			<Footer />
			<NoiseOverlay />
		</div>
	);
}

export default App;
