import { ArrowRightIcon } from "@phosphor-icons/react";
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
          <button className="bg-rock text-dark-forest group px-8 py-4  text-2xl font-medium flex items-center gap-4">
            Launch App{" "}
            <ArrowRightIcon
              weight="bold"
              size={24}
              className="group-hover:scale-110 origin-center group-hover:-rotate-45 transition-all duration-200"
            />
          </button>

          <button className="bg-amber-200 group  text-dark-forest px-8 py-4 text-2xl font-medium flex items-center gap-4">
            Explore{" "}
            <ArrowRightIcon
              weight="bold"
              size={24}
              className="group-hover:scale-110 origin-center group-hover:rotate-45 transition-all duration-200"
            />
          </button>
        </div>
      </div>
      <div className="flex mt-16">
        <ProductScreenshot />
      </div>
    </section>
  );
}
