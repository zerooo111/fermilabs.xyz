export default function LabsHeroSection() {
	return (
		<section className="relative w-full border-b border-b-rock/20 overflow-hidden">
			<div className="container-2xl px-4 sm:px-6 md:px-8">
				<div className="flex flex-col justify-center relative pt-16 sm:pt-20 md:pt-32 lg:pt-40 pb-16 sm:pb-20 md:pb-28 lg:pb-32">
					<h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] leading-[0.9] font-display font-bold tracking-tight">
						<span className="block">FERMI</span>
						<span className="block">LABS</span>
					</h1>

					<p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-rock font-medium mt-8 sm:mt-10 md:mt-12 lg:mt-16 max-w-4xl leading-relaxed">
						Building the future of decentralized finance through innovative research
						and cutting-edge technology.
					</p>
				</div>
			</div>

			{/* Enhanced Gradients */}
			<div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/3 mix-blend-multiply h-200 blur-3xl opacity-50 w-120 bg-black/30 blur-5xl -skew-x-24 pointer-events-none" />
			<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-soft-light opacity-50 blur-3xl h-96 w-3/4 bg-radial from-amber-100 to-rock/25 to-70% blur-5xl" />
			<div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 mix-blend-soft-light opacity-30 blur-3xl h-64 w-64 bg-amber-200/40 rounded-full blur-5xl pointer-events-none" />
		</section>
	);
}

