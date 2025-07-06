import Logo from "./Logo";
import { LINKS } from "@/constants";

export default function Header() {
  return (
    <header className="sticky top-0 w-full left-0 bg-dark-forest/60 backdrop-blur-lg border-b border-rock/30 z-10 gap-2 h-14 flex items-center ">
      <nav className="flex flex-1 h-full justify-between gap-1 text-xl border-x border-rock/20 font-medium container-2xl px-4">
        <div className="flex items-center border-x border-rock/20 pl-2 pr-4 group hover:text-amber-200 gap-1">
          <Logo className="w-10 h-10 group-hover:rotate-360 duration-500" />
          <a className="text-3xl font-display tracking-wide" href="/">
            FermiLabs
          </a>
        </div>

        <div className="flex text-rock/80 items-center h-full border-x border-rock/20 divide-x divide-rock/20">
          <a
            href={LINKS.DOCS}
            className="px-8 h-full flex items-center hover:text-amber-100 hover:bg-white/5 justify-center duration-150 ease-out"
          >
            Docs
          </a>
          <a
            href={LINKS.WHITEPAPER}
            className="px-8 h-full flex items-center hover:text-amber-100 hover:bg-white/5 justify-center duration-150 ease-out"
          >
            Whitepaper
          </a>
          <a
            href={LINKS.APP}
            className="px-8 h-full flex items-center hover:text-amber-100 hover:bg-white/5 justify-center duration-150 ease-out"
          >
            Trade
          </a>
        </div>
      </nav>
    </header>
  );
}
