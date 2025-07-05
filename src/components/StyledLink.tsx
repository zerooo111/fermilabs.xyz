import { Link, type LinkProps } from "@tanstack/react-router";
import { motion } from "motion/react";

interface StyledLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export default function StyledLink({
  children,
  className = "",
  ...props
}: StyledLinkProps) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      whileHover="hover"
      whileFocus="hover"
      initial="rest"
      animate="rest"
    >
      <Link {...props} className="group focus:outline-none">
        <motion.span
          variants={{
            rest: { color: "var(--color-rock)" },
            hover: { color: "var(--color-rock, #f8f7e7)", opacity: 0.85 },
          }}
          transition={{ duration: 0.2 }}
          className="transition-colors"
        >
          {children}
        </motion.span>
        <motion.span
          className="absolute -bottom-1 left-0 h-[2px] bg-rock/60"
          variants={{
            rest: { width: 0, opacity: 0.5 },
            hover: { width: "100%", opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
          style={{ display: "block" }}
        />
      </Link>
    </motion.div>
  );
}
