// POST /api/chat: the backend of the AI assistant.
// It runs on the server, so the Groq API key (GROQ_API_KEY) never reaches the browser.
// Flow: browser → this route (adds the system prompt + key) → Groq → streamed answer → browser.

import { buildSystemPrompt } from "@/content/knowledge";

type IncomingMessage = { role: "user" | "assistant"; content: string };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_MESSAGES = 10;
const MAX_CHARS = 1000;

// Light protection against abuse: at most 20 questions per minute per visitor.
// (Kept in memory: good enough for a portfolio; resets when the server restarts.)
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 20;
}

/** Keeps only well-formed, reasonably short messages. Never trust what the browser sends. */
function sanitize(input: unknown): IncomingMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const clean: IncomingMessage[] = [];
  for (const m of input.slice(-MAX_MESSAGES)) {
    if (typeof m !== "object" || m === null) return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) clean.push({ role, content: text });
  }
  return clean.length && clean[clean.length - 1].role === "user" ? clean : null;
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  // 503 tells the browser to use the offline assistant instead.
  if (!apiKey) return Response.json({ error: "Assistant not configured" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return Response.json({ error: "Too many questions, try again in a minute" }, { status: 429 });

  let body: { messages?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const messages = sanitize(body.messages);
  if (!messages) return Response.json({ error: "Invalid messages" }, { status: 400 });
  const lang = body.lang === "fr" ? "fr" : "en";

  const groq = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages: [{ role: "system", content: buildSystemPrompt(lang) }, ...messages],
      temperature: 0.4,
      max_tokens: 450,
      stream: true,
    }),
  });

  if (!groq.ok || !groq.body) {
    console.error("Groq error", groq.status, await groq.text().catch(() => ""));
    return Response.json({ error: "The AI service is unavailable" }, { status: 502 });
  }

  // Pass Groq's stream of Server-Sent Events straight through to the browser.
  return new Response(groq.body, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
  });
}
