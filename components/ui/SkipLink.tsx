"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="fixed left-3 top-3 z-[100] -translate-y-[200%] rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary transition-transform focus:translate-y-0"
    >
      {t.meta.skip}
    </a>
  );
}
