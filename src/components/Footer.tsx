import { LINKS } from "@/constants";
import {
  DiscordLogoIcon,
  GithubLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Copyright from "./Copyright";
import Logo from "./Logo";

export function Footer() {
  return (
    <footer className="w-full relative border-t border-rock/30">
      <div className="container-2xl h-16 border-x border-x-rock/20 flex items-start justify-between px-4">
        <div className="h-full">
          <div className="inline-flex text-rock/80 text-xl font-medium items-center h-full border-x border-rock/20 divide-x divide-rock/20">
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
          {/* <Copyright /> */}
        </div>

        <div className="flex text-rock/80 text-xl items-center h-full border-x border-rock/20 divide-x divide-rock/20">
          <a
            href={LINKS.TWITTER}
            title="X / Twitter"
            className="px-6 gap-2 group hover:scale-100 h-full flex items-center hover:text-amber-100 hover:bg-white/5 justify-center duration-150 ease-out"
          >
            <XLogoIcon className="size-8" />
          </a>
          <a
            href={LINKS.DISCORD}
            title="Discord"
            className="px-6 h-full flex hover:scale-100 items-center hover:text-amber-100 hover:bg-white/5 justify-center duration-150 ease-out"
          >
            <DiscordLogoIcon className="size-8" />
          </a>
          <a
            href={LINKS.GITHUB}
            title="Discord"
            className="px-6 h-full flex hover:scale-100 items-center hover:text-amber-100 hover:bg-white/5 justify-center duration-150 ease-out"
          >
            <GithubLogoIcon className="size-8" />
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between border-t py-4 border-t-rock/20 container-2xl border-x border-x-rock/20 px-4">
        <div className="flex items-center  border-rock/20 pr-4 group hover:text-amber-200 gap-1">
          <Logo className="w-10 h-10 group-hover:rotate-360 duration-500" />
          <a className="text-3xl font-display tracking-wide" href="/">
            FermiLabs
          </a>
        </div>
        <Copyright />
      </div>
    </footer>
  );
}
