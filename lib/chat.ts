// Client side of the AI assistant. The browser calls our own Next.js route
// (/api/chat), which holds the Groq key on the server. If the server has no key
// (or is unreachable), the assistant answers offline from the site's content.

import { offlineAnswer } from "@/content/knowledge";
import type { Lang } from "@/content/profile";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function* typeOut(text: string, signal?: AbortSignal) {
  for (const word of text.split(/(\s+)/)) {
    if (signal?.aborted) return;
    yield word;
    await wait(16);
  }
}

/** Streams the reply piece by piece. Use with `for await (const chunk of streamChat(...))`. */
export async function* streamChat(
  messages: ChatMessage[],
  lang: Lang,
  signal?: AbortSignal,
  onMode?: (mode: "online" | "offline") => void,
): AsyncGenerator<string> {
  const question = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";

  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages.slice(-10), lang }),
      signal,
    });
  } catch {
    if (signal?.aborted) return;
    // Network problem: still give a useful answer from the site's content.
    onMode?.("offline");
    yield* typeOut(offlineAnswer(question, lang), signal);
    return;
  }

  // 503 = no API key on the server, 502 = Groq unavailable: answer offline instead of failing.
  if (response.status === 503 || response.status === 502) {
    onMode?.("offline");
    yield* typeOut(offlineAnswer(question, lang), signal);
    return;
  }
  if (!response.ok || !response.body) throw new Error(`Chat request failed: ${response.status}`);
  onMode?.("online");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
        const piece = json.choices?.[0]?.delta?.content;
        if (piece) yield piece;
      } catch {
        // ignore a malformed line
      }
    }
  }
}
