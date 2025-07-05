import {
  FediverseLogoIcon,
  GearSixIcon,
  HandArrowUpIcon,
  VaultIcon,
} from "@phosphor-icons/react";
import GlassCard, { GlassCardContent, GlassCardTitle } from "./GlassCard";
import UnicornScene from "./UnicornScene";

export default function FeaturesSection() {
  return (
    <section className="container-2xl py-20 flex flex-col ">
      <div className="flex">
        <GlassCard className="lg:w-1/2 ">
          <GlassCardTitle>Crypto's fairest orderbook</GlassCardTitle>
          <GlassCardContent>
            <p>
              For years, DEXes were limited by block-level constraints—no
              guarantees on when or how your trade would be included. That led
              to front-running, sandwich attacks, and MEV chaos.
            </p>
            <p>
              Fermi changes that. With a high-speed, fair-orderbook design,
              there's no mempool, no MEV games, and no one cutting the line.
              Only executed trades settle on Solana, delivering top-tier
              exchange performance with full on-chain trust.
            </p>
          </GlassCardContent>
        </GlassCard>
        <div className="w-1/2 flex items-center justify-center">
          <UnicornScene
            projectId="rU2x4bWOA1sTDCVnhmet?production=true"
            className="h-40 w-40"
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 flex items-center justify-center">
          <UnicornScene
            projectId="bB99NzQj1kIAtcr5OVvP?production=true"
            className="h-40 w-40"
          />
        </div>
        <GlassCard className="lg:w-1/2 shrink-0">
          <GlassCardTitle>Modular sequencing</GlassCardTitle>
          <GlassCardContent>
            <p>
              Fermi brings order to the chaos of DeFi by reinventing how
              transactions are sequenced.
            </p>
            <p>
              Our Continuum layer offers predictable, first-come-first-serve
              ordering—no mempool, no MEV, no front-running. Just instant
              confirmation and clean execution.
            </p>
            <p>
              It is easy for an layer-one DeFi app to integrate Continuum with
              minimal changes, using it to sequence user actions fairly and
              execute custom logic, while Continuum handles batch execution and
              onchain settlement.
            </p>
          </GlassCardContent>
        </GlassCard>
      </div>

      <div className="flex">
        <GlassCard className="lg:w-1/2">
          <GlassCardTitle>Fermi's liquidity layer</GlassCardTitle>
          <GlassCardContent>
            <p>
              Apps built on Fermi tap into a unified liquidity layer that boosts
              composability and capital efficiency.
            </p>
            <p>So far, three protocols are integrated:</p>
            <div className="flex flex-col gap-4 mt-6 font-display text-4xl">
              <div className="glass-card p-4 bg-dark-forest/50 flex items-center gap-4">
                <HandArrowUpIcon weight="duotone" size={32} />
                Lendings platform
              </div>
              <div className="glass-card p-4  bg-dark-forest/50 flex items-center gap-4">
                <VaultIcon size={32} />
                Market-making vault
              </div>
              <div className="glass-card p-4 bg-dark-forest/50 flex items-center gap-4">
                <FediverseLogoIcon size={32} />
                Decentralized exchange
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
        <div className="w-1/2 flex items-center justify-center">
          <UnicornScene
            projectId="63ON74BtloYSYdehHwTw?production=true"
            className="h-40 w-40"
          />
        </div>
      </div>
    </section>
  );
}
