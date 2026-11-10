// The terminal's commands. Each command is a function that receives its arguments
// and a context (actions it may trigger) and returns the text to print.
// Keeping this separate from the Terminal component makes it easy to add commands.

import { links, person, projects, skillGroups, timeline, type Lang, type Localized } from "@/content/profile";
import type { Theme } from "./ui";

export type CommandOutput = { text: string; kind?: "output" | "error" } | null;

export type CommandContext = {
  lang: Lang;
  /** Opens a page (Next.js router). */
  navigate: (href: string) => void;
  setLang: (lang: Lang) => void;
  setTheme: (theme: Theme) => void;
  openChat: (question?: string) => void;
  clear: () => void;
  history: string[];
};

type Command = {
  description: Localized;
  usage?: string;
  run: (args: string[], ctx: CommandContext) => CommandOutput;
};

// Command name → page address.
const pages: Record<string, string> = {
  home: "/",
  about: "/about",
  journey: "/about#journey",
  skills: "/skills",
  services: "/skills#services",
  projects: "/projects",
  contact: "/contact",
};

const files: Record<string, (l: Lang) => string> = {
  "profile.ts": (l) =>
    [
      "const zaid = {",
      `  name: "${person.name}",`,
      `  school: "${person.school}",`,
      `  exchange: "${person.exchange}",`,
      `  interests: [${person.interests.map((i) => `"${i[l]}"`).join(", ")}],`,
      `  status: "${l === "fr" ? "Toujours en apprentissage..." : "Still learning..."}",`,
      "};",
    ].join("\n"),
  "goals.ts": (l) =>
    [
      "const goals = [",
      ...person.goals.map((g) => `  "${g[l]}",`),
      "];",
      `const mindset = "${person.mindset[l]}";`,
    ].join("\n"),
  "contact.txt": () => `email   ${links.email}\ngithub  ${links.github}\ncv      ${links.cv}`,
};

const say = (l: Lang, en: string, fr: string) => (l === "fr" ? fr : en);

const go = (page: string, ctx: CommandContext): CommandOutput => {
  const path = pages[page];
  if (!path) return { kind: "error", text: say(ctx.lang, `No page named "${page}". Try: ${Object.keys(pages).join(", ")}`, `Aucune page « ${page} ». Essayez : ${Object.keys(pages).join(", ")}`) };
  ctx.navigate(path);
  return { text: say(ctx.lang, `Opening ${page}…`, `Ouverture de ${page}…`) };
};

export const commands: Record<string, Command> = {
  help: {
    description: { en: "List the available commands", fr: "Lister les commandes disponibles" },
    run: (_a, ctx) => {
      const width = Math.max(...Object.entries(commands).map(([n, c]) => (c.usage ?? n).length));
      return {
        text: Object.entries(commands)
          .map(([name, c]) => `${(c.usage ?? name).padEnd(width + 2)}${c.description[ctx.lang]}`)
          .join("\n"),
      };
    },
  },
  whoami: {
    description: { en: "Who is Zaid?", fr: "Qui est Zaid ?" },
    run: (_a, ctx) => ({ text: `${person.name}, ${person.role[ctx.lang].toLowerCase()}, ${person.location}\n${person.intro[ctx.lang]}\n${person.lookingFor[ctx.lang]}` }),
  },
  ls: {
    description: { en: "List files", fr: "Lister les fichiers" },
    run: () => ({ text: [...Object.keys(files), "projects/", "skills/", "education/"].join("   ") }),
  },
  cat: {
    description: { en: "Show a file", fr: "Afficher un fichier" },
    usage: "cat <file>",
    run: (args, ctx) => {
      const name = args[0];
      if (!name) return { kind: "error", text: say(ctx.lang, "Usage: cat <file>. Try cat profile.ts", "Usage : cat <fichier>. Essayez cat profile.ts") };
      const file = files[name];
      if (!file) return { kind: "error", text: say(ctx.lang, `cat: ${name}: no such file`, `cat: ${name} : fichier introuvable`) };
      return { text: file(ctx.lang) };
    },
  },
  projects: {
    description: { en: "List my projects", fr: "Lister mes projets" },
    run: (_a, ctx) => ({
      text: projects.map((p) => `${p.id.padEnd(13)}${p.title[ctx.lang]}`).join("\n") + say(ctx.lang, "\n\nType open projects to see details.", "\n\nTapez open projects pour les détails."),
    }),
  },
  skills: {
    description: { en: "List my skills", fr: "Lister mes compétences" },
    run: (_a, ctx) => ({
      text: skillGroups.map((g) => `${g.title[ctx.lang]}\n  ${g.skills.map((s) => s.name).join(", ")}`).join("\n"),
    }),
  },
  education: {
    description: { en: "My studies", fr: "Mon parcours" },
    run: (_a, ctx) => ({ text: timeline.map((e) => `${e.year.padEnd(9)}${e.title[ctx.lang]}`).join("\n") }),
  },
  contact: {
    description: { en: "How to reach me", fr: "Me contacter" },
    run: () => ({ text: files["contact.txt"]("en") }),
  },
  open: {
    description: { en: "Open a page (about, skills, projects, contact…)", fr: "Ouvrir une page (about, skills, projects, contact…)" },
    usage: "open <page>",
    run: (args, ctx) => {
      if (args[0] === "github" || args[0] === "cv") {
        window.open(args[0] === "github" ? links.github : links.cv, "_blank", "noopener");
        return { text: say(ctx.lang, `Opening ${args[0]} in a new tab…`, `Ouverture de ${args[0]} dans un nouvel onglet…`) };
      }
      return go(args[0] ?? "", ctx);
    },
  },
  ask: {
    description: { en: "Ask the AI assistant a question", fr: "Poser une question à l'assistant IA" },
    usage: "ask <question>",
    run: (args, ctx) => {
      const question = args.join(" ").trim();
      ctx.openChat(question || undefined);
      return { text: say(ctx.lang, "Opening the assistant…", "Ouverture de l'assistant…") };
    },
  },
  lang: {
    description: { en: "Change language", fr: "Changer de langue" },
    usage: "lang <en|fr>",
    run: (args, ctx) => {
      const next = args[0];
      if (next !== "en" && next !== "fr") return { kind: "error", text: say(ctx.lang, "Usage: lang en  or  lang fr", "Usage : lang en  ou  lang fr") };
      ctx.setLang(next);
      return { text: next === "fr" ? "Langue : français" : "Language: English" };
    },
  },
  theme: {
    description: { en: "Change light / dark mode", fr: "Changer le mode clair / sombre" },
    usage: "theme <dark|light>",
    run: (args, ctx) => {
      const next = args[0];
      if (next !== "dark" && next !== "light") return { kind: "error", text: say(ctx.lang, "Usage: theme dark  or  theme light", "Usage : theme dark  ou  theme light") };
      ctx.setTheme(next);
      return { text: `theme → ${next}` };
    },
  },
  history: {
    description: { en: "Show the commands you typed", fr: "Afficher les commandes tapées" },
    run: (_a, ctx) => ({ text: ctx.history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join("\n") || "—" }),
  },
  clear: {
    description: { en: "Clear the screen (or Ctrl+L)", fr: "Effacer l'écran (ou Ctrl+L)" },
    run: (_a, ctx) => {
      ctx.clear();
      return null;
    },
  },
  sudo: {
    description: { en: "Try it", fr: "Essayez" },
    run: (_a, ctx) => ({ kind: "error", text: say(ctx.lang, "Nice try. This incident will be reported.", "Bien essayé. Cet incident sera signalé.") }),
  },
};

/** Parses and runs one line typed in the terminal. */
export function runCommand(input: string, ctx: CommandContext): CommandOutput {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return null;
  const command = commands[name.toLowerCase()];
  if (!command) {
    return {
      kind: "error",
      text: say(ctx.lang, `command not found: ${name}. Type help to see what's available.`, `commande introuvable : ${name}. Tapez help pour voir la liste.`),
    };
  }
  return command.run(args, ctx);
}

/** Tab completion: completes the command name, or the argument for open / cat / lang / theme. */
export function complete(input: string): string {
  const parts = input.split(" ");
  if (parts.length === 1) {
    const matches = Object.keys(commands).filter((c) => c.startsWith(parts[0].toLowerCase()));
    return matches.length === 1 ? `${matches[0]} ` : input;
  }
  const options: Record<string, string[]> = {
    open: [...Object.keys(pages), "github", "cv"],
    cat: Object.keys(files),
    lang: ["en", "fr"],
    theme: ["dark", "light"],
  };
  const pool = options[parts[0]];
  if (!pool || parts.length !== 2) return input;
  const matches = pool.filter((o) => o.startsWith(parts[1]));
  return matches.length === 1 ? `${parts[0]} ${matches[0]}` : input;
}
