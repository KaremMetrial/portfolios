"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between items; 0 with reduced motion. */
  interval?: number;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Container that staggers its <StaggerItem> children into view (FR-FE-73).
 * Both parts are reduced-motion aware and never hide content statically.
 */
export function Stagger({
  children,
  className,
  interval = 0.08,
}: StaggerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reduce ? 0 : interval },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
