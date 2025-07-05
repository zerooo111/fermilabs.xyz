import { motion } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Logo from "./Logo";
import StyledLink from "./StyledLink";

export function Footer() {
  return (
    <footer className="relative mt-16">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-forest/50 to-dark-forest" />

      <div className="relative py-16 md:py-24">
        <div className="container-2xl text-center">
          {/* Main CTA Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl mb-6 leading-tight text-rock">
              Ready to experience the fastest DEX?
            </h2>
            <p className="text-lg md:text-xl text-rock/80 mb-12 max-w-2xl mx-auto">
              Deploy liquidity, fire off your first trade, or dive into our SDK in minutes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <motion.a
                href="/beta"
                className="bg-rock text-dark-forest group px-8 py-4 text-lg md:text-xl font-medium flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Launch the Beta
                <ArrowRightIcon
                  weight="bold"
                  className="w-5 h-5 group-hover:scale-110 origin-center group-hover:-rotate-45 transition-all duration-200"
                />
              </motion.a>

              <motion.a
                href="https://discord.gg/fermilabs"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-200 group text-dark-forest px-8 py-4 text-lg md:text-xl font-medium flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Discord
                <ArrowRightIcon
                  weight="bold"
                  className="w-5 h-5 group-hover:scale-110 origin-center group-hover:-rotate-45 transition-all duration-200"
                />
              </motion.a>

              <motion.a
                href="/sdk"
                className="group text-rock ring-1 ring-rock/30 hover:ring-rock/50 bg-transparent hover:bg-rock/10 duration-300 text-lg md:text-xl px-8 py-4 font-medium flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Checkout the SDK
                <ArrowRightIcon
                  weight="bold"
                  className="w-5 h-5 group-hover:scale-110 origin-center group-hover:-rotate-45 transition-all duration-200"
                />
              </motion.a>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-8 md:gap-16 justify-between pt-16 border-t border-rock/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8 order-2 lg:order-1">
              <StyledLink href="/about">About</StyledLink>
              <StyledLink href="/research">Research</StyledLink>
              <StyledLink href="/publications">Publications</StyledLink>
              <StyledLink href="/careers">Careers</StyledLink>
              <StyledLink href="/contact">Contact</StyledLink>
            </nav>

            {/* Logo and Tagline */}
            <div className="flex flex-col lg:flex-row items-center gap-6 order-1 lg:order-2">
              <div className="text-center lg:text-right space-y-1">
                <p className="text-rock/70 text-sm">
                  Pushing quantum boundaries.
                </p>
                <p className="text-rock/70 text-sm">
                  Building tomorrow's computing.
                </p>
              </div>
              <Logo className="w-12 h-12" />
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="mt-12 text-center text-rock/50 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p>
              &copy; {new Date().getFullYear()} Fermilabs. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
