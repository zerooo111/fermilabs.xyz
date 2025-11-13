import Shuffle from "./Shuffle";
import Dither from "./Dither";

export default function LabsHeroSection() {
  return (
    <section className="relative z-[0] w-full border-b border-b-rock/20 overflow-hidden">
      <div className="absolute inset-0 w-full h-full opacity-50 brightness-80 z-0">
        <Dither
          waveColor={[0.706, 0.863, 0.471]}
          darkColor={[0.031, 0.078, 0.047]}
          midColor={[0.094, 0.314, 0.22]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      <div className="container-2xl px-4 sm:px-6 md:px-8 relative z-10">
        <div className="flex flex-col justify-center relative pt-16 sm:pt-20 md:pt-32 lg:pt-26 pb-16 sm:pb-20 md:pb-28 lg:pb-32">
          <div className="text-6xl md:text-[120px]   select-none   font-display font-bold ">
            <Shuffle
              text="Fermi"
              tag="h1"
              className="block"
              style={{
                fontFamily: "var(--font-display)",
                textTransform: "none",
                fontSize: "inherit",
                lineHeight: "inherit",
                fontWeight: "inherit",
                letterSpacing: "inherit",
              }}
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
            />
            <Shuffle
              text="Labs"
              tag="h1"
              className="block"
              style={{
                fontFamily: "var(--font-display)",
                textTransform: "none",
                fontSize: "inherit",
                lineHeight: "inherit",
                fontWeight: "inherit",
                letterSpacing: "inherit",
              }}
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
            />
          </div>

          <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-amber-200 font-medium max-w-4xl leading">
            Building the future of decentralized finance through innovative
            research and cutting-edge technology.
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
