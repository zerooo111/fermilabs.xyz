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
      <div className="flex flex-col items-start relative pt-24">
        <h1 className="text-4xl lg:text-7xl leading-relaxed font-display text-center">
          Instant Finality. Capital Efficient
        </h1>

        <h6 className="text-2xl  lg:text-3xl italic text-center">
          Trade with NASDAQ speed with onchain security
        </h6>

        <div className="mt-16 flex gap-6">
          <button
            type="button"
            className="hover:brightness-125 bg-rock text-dark-forest group px-8 py-4 text-2xl font-medium flex items-center gap-4 relative overflow-hidden duration-150 ease-out"
          >
            Launch App{" "}
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
            Explore
            <ArrowRightIcon
              weight="bold"
              size={24}
              className="group-hover:scale-110 origin-center group-hover:rotate-45 transition-all duration-200 relative duration-150 ease-out"
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
