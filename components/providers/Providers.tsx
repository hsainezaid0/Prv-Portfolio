"use client";

// Everything that needs the browser (language, theme, UI state, smooth scrolling,
// animation settings) is provided here, once, around the whole page.

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { I18nProvider } from "@/i18n/I18nProvider";
import { UIProvider } from "@/lib/ui";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <UIProvider>
        {/* reducedMotion="user": Motion turns off movement for visitors who ask their OS for less motion. */}
        <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 140, damping: 22 }}>
          <SmoothScroll>{children}</SmoothScroll>
        </MotionConfig>
      </UIProvider>
    </I18nProvider>
  );
}
