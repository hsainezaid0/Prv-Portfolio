"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { complete, runCommand, type CommandContext } from "@/lib/commands";
import { useI18n } from "@/i18n/I18nProvider";
import { useUI } from "@/lib/ui";
import { useRouter } from "next/navigation";

type Line = { id: number; kind: "input" | "output" | "error" | "system"; text: string };

const PROMPT = "zaid@cyb:~$";
const BOOT_COMMAND = "whoami";

let nextId = 0;
const line = (kind: Line["kind"], text: string): Line => ({ id: nextId++, kind, text });

export function Terminal() {
  const { t, lang, setLang } = useI18n();
  const { setTheme, openChat } = useUI();
  const router = useRouter();

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [booted, setBooted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const context = (hist: string[]): CommandContext => ({
    lang,
    navigate: (href) => router.push(href),
    setLang,
    setTheme,
    openChat,
    clear: () => setLines([]),
    history: hist,
  });

  const execute = (raw: string) => {
    const value = raw.trim();
    const echo = line("input", value);
    if (!value) {
      setLines((prev) => [...prev, echo]);
      return;
    }
    const nextHistory = [...history, value];
    setHistory(nextHistory);
    setHistoryIndex(null);
    const result = runCommand(value, context(nextHistory));
    if (value.split(/\s+/)[0] === "clear") return;
    setLines((prev) => [...prev, echo, ...(result ? [line(result.kind ?? "output", result.text)] : [])]);
  };

  // The terminal types its first command by itself the first time it scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || booted) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      setBooted(true);
      const welcome = line("system", lang === "fr" ? "Bienvenue. Tapez help pour commencer." : "Welcome. Type help to get started.");
      const out = runCommand(BOOT_COMMAND, context([]));
      setLines([welcome, line("input", BOOT_COMMAND), ...(out ? [line("output", out.text)] : [])]);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted, lang]);

  // The palette's "Open the terminal" action focuses the input.
  useEffect(() => {
    const focus = () => inputRef.current?.focus({ preventScroll: true });
    window.addEventListener("cyb:focus-terminal", focus);
    return () => window.removeEventListener("cyb:focus-terminal", focus);
  }, []);

  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(i);
      setInput(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const i = historyIndex + 1;
      if (i >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(i);
        setInput(history[i]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      setInput((v) => complete(v));
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      ref={rootRef}
      id="terminal"
      role="region"
      aria-label={t.terminal.label}
      className="overflow-hidden rounded-2xl border border-line-strong/60 bg-[var(--term-bg)] font-mono text-base leading-relaxed text-[var(--term-fg)] depth-shadow"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#6366f1]" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-2 text-xs text-[#a5b4fc]">zaid@cyb — bash</span>
      </div>

      <div
        ref={screenRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="h-96 cursor-text overflow-y-auto px-4 py-3 [scrollbar-width:thin]"
      >
        <div role="log" aria-live="polite">
          {lines.map((l) =>
            l.kind === "input" ? (
              <div key={l.id} className="mt-2">
                <span className="font-semibold text-[#a5b4fc]">{PROMPT}</span> {l.text}
              </div>
            ) : (
              <pre
                key={l.id}
                className={`whitespace-pre-wrap break-words font-mono ${
                  l.kind === "error" ? "text-[#fca5a5]" : l.kind === "system" ? "text-[#a5b4fc]/80" : ""
                }`}
              >
                {l.text}
              </pre>
            ),
          )}
        </div>
        <label className="mt-2 flex gap-2">
          <span className="shrink-0 font-semibold text-[#a5b4fc]" aria-hidden="true">
            {PROMPT}
          </span>
          <span className="sr-only">{t.terminal.inputLabel}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-[#f8faff] caret-[#a5b4fc] outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
        {t.terminal.suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              execute(s);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="rounded-full border border-white/15 px-3 py-1 text-sm text-[#e0e7ff] transition-colors hover:border-[#a5b4fc] hover:text-[#a5b4fc]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
