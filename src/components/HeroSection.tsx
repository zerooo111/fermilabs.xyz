import { ArrowRightIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import ProductScreenshot from "./ProductScreenshot";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative w-full px-4 border-b border-b-rock/20"
    >
      <div className="flex flex-col items-center  relative pt-12 md:pt-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight md:leading-relaxed font-display text-center md:text-left">
          Instant Finality. Capital Efficient
        </h1>

        <h6 className="text-lg sm:text-xl md:text-2xl lg:text-3xl italic text-center md:text-left mt-4">
          Trade with NASDAQ speed with onchain security
        </h6>

        <div className="mt-8 md:mt-16 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
          <button
            type="button"
            className="hover:brightness-125 bg-rock text-dark-forest group px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl md:text-2xl font-medium flex items-center justify-center gap-3 sm:gap-4 relative overflow-hidden duration-150 ease-out"
          >
            Launch App{" "}
            <ArrowRightIcon
              weight="bold"
              size={20}
              className="group-hover:scale-110 origin-center
              group-hover:-rotate-45 transition-all duration-200 relative sm:w-6 sm:h-6"
            />
          </button>

          <button
            type="button"
            className="hover:brightness-120 bg-amber-200 group text-dark-forest px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl md:text-2xl font-medium flex items-center justify-center gap-3 sm:gap-4 relative overflow-hidden duration-150 ease-out"
          >
            Explore
            <ArrowRightIcon
              weight="bold"
              size={20}
              className="group-hover:scale-110 origin-center group-hover:rotate-45 transition-all duration-200 relative duration-150 ease-out sm:w-6 sm:h-6"
            />
          </button>
        </div>
      </div>

      <div className="flex mt-8 overflow-hidden">
        <ProductScreenshot />
      </div>
    </section>
  );
}
