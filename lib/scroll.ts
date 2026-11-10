"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

const HEADER_OFFSET = -88; // keep section titles clear of the sticky header

/** Returns a function that scrolls to a section by id ("top" for the top of the page). */
export function useScrollTo() {
  const lenis = useLenis(); // undefined when smooth scrolling is off

  return useCallback(
    (id: string) => {
      const target = id === "top" ? null : document.getElementById(id);
      if (lenis) {
        lenis.scrollTo(target ?? 0, { offset: target ? HEADER_OFFSET : 0 });
        return;
      }
      const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (target) target.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior });
    },
    [lenis],
  );
}
