"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/I18nProvider";
import { useUI } from "@/lib/ui";
import { streamChat, type ChatMessage } from "@/lib/chat";
import { ChatIcon, CloseIcon, SendIcon } from "./Icons";

export function ChatWidget() {
  const { t, lang } = useI18n();
  const { chatOpen, openChat, closeChat, consumePendingQuestion, pendingQuestion } = useUI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"online" | "offline" | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setError(null);
    setInput("");
    const history: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      for await (const chunk of streamChat(history, lang, controller.signal, setMode)) {
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(t.chat.error);
        setMessages(history);
        console.error(err);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    if (chatOpen && pendingQuestion) {
      const q = consumePendingQuestion();
      if (q) void send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatOpen, pendingQuestion]);

  useEffect(() => {
    if (chatOpen) requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    else abortRef.current?.abort();
  }, [chatOpen]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, closeChat]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))]">
      <AnimatePresence mode="wait">
        {!chatOpen ? (
          <motion.button
            key="launcher"
            type="button"
            onClick={() => openChat()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ y: -3 }}
            className="flex h-12 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-on-primary shadow-[0_18px_40px_-12px_var(--glow)] hover:bg-primary-hover max-sm:w-12 max-sm:justify-center max-sm:px-0"
            aria-label={t.chat.open}
          >
            <ChatIcon />
            <span className="max-sm:hidden">{t.chat.open}</span>
          </motion.button>
        ) : (
          <motion.section
            key="panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{ transformPerspective: 1000, transformOrigin: "bottom right" }}
            className="flex h-[min(36rem,calc(100dvh-9rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
          >
            <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <h2 id="chat-title" className="flex items-center gap-2 font-semibold text-fg">
                  <span className={`size-2 rounded-full ${mode === "offline" ? "bg-line-strong" : "bg-accent-strong shadow-[0_0_10px_var(--glow)]"}`} aria-hidden="true" />
                  {t.chat.title}
                </h2>
                <p className="mt-0.5 text-sm text-muted">{t.chat.subtitle}</p>
              </div>
              <button type="button" onClick={closeChat} aria-label={t.chat.close} className="grid size-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-fg">
                <CloseIcon />
              </button>
            </header>

            <div ref={listRef} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" data-lenis-prevent>
              <p className="max-w-[88%] self-start whitespace-pre-wrap rounded-2xl rounded-bl-md bg-raised px-4 py-3 text-base leading-relaxed text-fg">
                {t.chat.greeting}
              </p>
              {messages.map((m, i) => (
                <p
                  key={i}
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-base leading-relaxed ${
                    m.role === "user" ? "self-end rounded-br-md bg-primary text-on-primary" : "self-start rounded-bl-md bg-raised text-fg"
                  }`}
                >
                  {m.content || <span className="inline-flex gap-1" aria-label="…"><Dot /><Dot d={0.15} /><Dot d={0.3} /></span>}
                </p>
              ))}
              {error && <p className="text-sm text-fg">{error}</p>}
              {messages.length === 0 && (
                <div className="flex flex-col items-start gap-2">
                  {t.chat.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border border-line-strong px-3 py-1.5 text-left text-sm text-fg hover:border-accent hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {mode === "offline" && <p className="border-t border-line px-4 py-2 text-sm text-muted">{t.chat.offline}</p>}

            <form onSubmit={onSubmit} className="flex gap-2 border-t border-line p-3">
              <label htmlFor="chat-input" className="sr-only">
                {t.chat.placeholder}
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chat.placeholder}
                maxLength={500}
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-full border border-line bg-bg px-4 text-fg placeholder:text-muted focus:border-accent-strong focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={t.chat.send}
                className="grid size-11 place-items-center rounded-full bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-45"
              >
                <SendIcon />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return (
    <motion.span
      className="size-1.5 rounded-full bg-muted"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity, delay: d }}
    />
  );
}
