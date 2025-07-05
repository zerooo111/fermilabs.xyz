import ProductScreenshot from "./ProductScreenshot";

export default function HeroSection() {
  return (
    <section className="container-2xl py-20">
      <div className="flex flex-col items-start">
        <h1 className="text-4xl lg:text-7xl leading-relaxed font-display text-center">
          Instant Finality. Capital Efficiency.
        </h1>
        <h6 className="text-2xl lg:text-3xl   italic text-center">
          Trade with NASDAQ speed with onchain security
        </h6>
        <div className="mt-16 flex gap-4">
          <button className="bg-rock text-dark-forest px-8 py-4  text-2xl font-medium">
            Launch App
          </button>

          <button className="bg-amber-200  text-dark-forest px-8 py-4 text-2xl font-medium">
            Explore
          </button>
        </div>
      </div>
      <div className="flex mt-16">
        <ProductScreenshot />
      </div>
    </section>
  );
}
