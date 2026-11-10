// All the facts about Zaid live here, in both languages.
// Pages, the terminal and the AI assistant all read from this one file,
// so a change here shows up everywhere.

export type Lang = "en" | "fr";

/** A piece of text written in both languages. */
export type Localized = Record<Lang, string>;

export const links = {
  github: "https://github.com/hsainezaid0",
  repo: "https://github.com/hsainezaid0/My-Portfolio",
  cv: "https://hsainezaid0.github.io/CV---RESUME/",
  email: "hsainezaid@gmail.com",
  site: "https://zaidhsaine.com",
} as const;

export const person = {
  name: "Zaid Hsaine",
  location: "Paris, FR",
  role: { en: "Computer science student", fr: "Étudiant en informatique" },
  school: "EMSI",
  exchange: "EPITECH Paris",
  tagline: { en: "Code. Explore. Keep evolving.", fr: "Coder. Explorer. Progresser." },
  intro: {
    en: "Computer science student at EMSI, on exchange at EPITECH Paris. I work on software development and cybersecurity, one project at a time.",
    fr: "Étudiant en informatique à l'EMSI, en échange à EPITECH Paris. Je travaille le développement logiciel et la cybersécurité, un projet à la fois.",
  },
  lookingFor: {
    en: "Looking for a cybersecurity work-study position (alternance) starting in 2027.",
    fr: "À la recherche d'une alternance en cybersécurité à partir de 2027.",
  },
  interests: [
    { en: "Cybersecurity", fr: "Cybersécurité" },
    { en: "Software development", fr: "Développement logiciel" },
  ],
  goals: [
    { en: "Build useful software", fr: "Créer des logiciels utiles" },
    { en: "Understand security", fr: "Comprendre la sécurité" },
    { en: "Learn through practice", fr: "Apprendre par la pratique" },
    { en: "Keep improving", fr: "Toujours progresser" },
  ],
  mindset: { en: "Try. Debug. Repeat.", fr: "Essayer. Déboguer. Recommencer." },
};

// ---------------------------------------------------------------------------

export type ProjectCategory = "security" | "web" | "embedded" | "apps";

export type Project = {
  id: string;
  category: ProjectCategory;
  title: Localized;
  summary: Localized;
  stack: string[];
  status: "done" | "in-progress";
  details: { label: Localized; text: Localized }[];
  /** Picture shown on the card (put your own screenshots or photos in public/projects/). */
  image: string;
  imageAlt: Localized;
  repo?: string;
  featured?: boolean;
};

const label = {
  context: { en: "Context", fr: "Contexte" },
  objective: { en: "Objective", fr: "Objectif" },
  focus: { en: "What I worked on", fr: "Ce que j'ai travaillé" },
  skills: { en: "Skills involved", fr: "Compétences" },
  reflection: { en: "Reflection", fr: "Bilan" },
};

export const projects: Project[] = [
  {
    id: "snort",
    image: "/projects/snort.svg",
    imageAlt: { en: "Illustration: a network map with one host flagged by a Snort alert", fr: "Illustration : une carte réseau avec un hôte signalé par une alerte Snort" },
    category: "security",
    featured: true,
    status: "done",
    title: { en: "Snort network intrusion detection", fr: "Détection d'intrusion réseau avec Snort" },
    summary: {
      en: "Network intrusion detection with Snort, custom rules and traffic analysis in a security lab.",
      fr: "Détection d'intrusion réseau avec Snort, règles personnalisées et analyse de trafic en laboratoire.",
    },
    stack: ["Snort", "Linux", "Nmap", "hping3", "TCP/IP"],
    details: [
      {
        label: label.context,
        text: {
          en: "A cybersecurity training project using Snort for network monitoring.",
          fr: "Un projet de formation en cybersécurité utilisant Snort pour surveiller le réseau.",
        },
      },
      {
        label: label.objective,
        text: {
          en: "Detect suspicious traffic and generate security alerts.",
          fr: "Détecter le trafic suspect et générer des alertes de sécurité.",
        },
      },
      {
        label: label.focus,
        text: {
          en: "Configuring Snort, writing custom rules and testing them in the lab with Nmap and hping3.",
          fr: "Configuration de Snort, écriture de règles personnalisées et tests en laboratoire avec Nmap et hping3.",
        },
      },
      {
        label: label.skills,
        text: {
          en: "Linux, TCP/IP, detection rules and alert analysis.",
          fr: "Linux, TCP/IP, règles de détection et analyse d'alertes.",
        },
      },
    ],
  },
  {
    id: "portfolio",
    image: "/projects/portfolio.svg",
    imageAlt: { en: "Illustration: a browser window showing a 3D portfolio", fr: "Illustration : une fenêtre de navigateur affichant un portfolio 3D" },
    category: "web",
    featured: true,
    status: "in-progress",
    repo: links.repo,
    title: { en: "This portfolio", fr: "Ce portfolio" },
    summary: {
      en: "Rebuilt from static HTML into a Next.js app with a 3D scene, a working terminal, a command palette, an AI assistant and two languages.",
      fr: "Reconstruit à partir de HTML statique en application Next.js avec une scène 3D, un vrai terminal, une palette de commandes, un assistant IA et deux langues.",
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Motion", "Groq"],
    details: [
      {
        label: label.context,
        text: {
          en: "The first version was HTML, CSS and JavaScript, built while learning web development at EPITECH.",
          fr: "La première version était en HTML, CSS et JavaScript, réalisée pendant mon apprentissage du web à EPITECH.",
        },
      },
      {
        label: label.objective,
        text: {
          en: "Introduce myself, document my projects and learn a modern front-end stack by using it.",
          fr: "Me présenter, documenter mes projets et apprendre une stack front-end moderne en l'utilisant.",
        },
      },
      {
        label: label.skills,
        text: {
          en: "Server and client components, typed data, 3D with React Three Fiber, animation, accessibility and an API route.",
          fr: "Composants serveur et client, données typées, 3D avec React Three Fiber, animation, accessibilité et route d'API.",
        },
      },
      {
        label: label.reflection,
        text: {
          en: "Keeping every fact in one typed file means the pages, the terminal and the assistant never disagree.",
          fr: "Garder toutes les infos dans un seul fichier typé évite que les pages, le terminal et l'assistant se contredisent.",
        },
      },
    ],
  },
  {
    id: "parking",
    image: "/projects/parking.svg",
    imageAlt: { en: "Illustration: a smart parking lot seen from above, with sensors, a barrier and a free-space display", fr: "Illustration : un parking intelligent vu du dessus, avec capteurs, barrière et affichage des places libres" },
    category: "embedded",
    featured: true,
    status: "done",
    title: { en: "Smart parking system", fr: "Parking intelligent" },
    summary: {
      en: "An Arduino system that detects cars, counts free spaces and opens the entrance barrier on its own.",
      fr: "Un système Arduino qui détecte les voitures, compte les places libres et ouvre la barrière automatiquement.",
    },
    stack: ["Arduino Uno", "C/C++", "Ultrasonic sensors", "Servo motor", "LCD I2C"],
    details: [
      {
        label: label.context,
        text: {
          en: "An embedded systems project to automate a small parking lot.",
          fr: "Un projet de systèmes embarqués pour automatiser un petit parking.",
        },
      },
      {
        label: label.objective,
        text: {
          en: "Detect vehicles, manage availability and control an automatic barrier.",
          fr: "Détecter les véhicules, gérer la disponibilité et piloter une barrière automatique.",
        },
      },
      {
        label: label.focus,
        text: {
          en: "Arduino programming, ultrasonic sensors, barrier control with a servo and live free-space count on an LCD.",
          fr: "Programmation Arduino, capteurs à ultrasons, barrière pilotée par servomoteur et affichage des places libres sur écran LCD.",
        },
      },
      {
        label: label.skills,
        text: {
          en: "C/C++, sensor integration, electronic circuits and embedded automation.",
          fr: "C/C++, intégration de capteurs, circuits électroniques et automatisation embarquée.",
        },
      },
    ],
  },
  {
    id: "hackathon",
    image: "/projects/hackathon.svg",
    imageAlt: { en: "Illustration: a phone showing an everyday-life app", fr: "Illustration : un téléphone affichant une appli du quotidien" },
    category: "apps",
    status: "done",
    title: { en: "EMSI hackathon: an everyday app", fr: "Hackathon EMSI : une appli du quotidien" },
    summary: {
      en: "A hackathon app built around a real daily need, from the idea to the main features.",
      fr: "Une application de hackathon construite autour d'un vrai besoin quotidien, de l'idée aux fonctionnalités clés.",
    },
    stack: ["Hackathon", "App development", "Teamwork"],
    details: [
      {
        label: label.context,
        text: {
          en: "A hackathon at EMSI focused on applications for everyday use.",
          fr: "Un hackathon à l'EMSI sur des applications pour la vie quotidienne.",
        },
      },
      {
        label: label.objective,
        text: {
          en: "Solve a daily need with a practical application.",
          fr: "Répondre à un besoin quotidien avec une application pratique.",
        },
      },
      {
        label: label.focus,
        text: {
          en: "Finding a useful idea, defining the main features and building around what users need.",
          fr: "Trouver une idée utile, définir les fonctionnalités principales et construire autour des besoins des utilisateurs.",
        },
      },
    ],
  },
  {
    id: "discord-bot",
    image: "/projects/discord-bot.svg",
    imageAlt: { en: "Illustration: a chat window where a bot answers a command", fr: "Illustration : une fenêtre de discussion où un bot répond à une commande" },
    category: "apps",
    status: "done",
    title: { en: "Discord bot", fr: "Bot Discord" },
    summary: {
      en: "A bot that makes server life easier with commands and automatic replies.",
      fr: "Un bot qui simplifie la vie d'un serveur avec des commandes et des réponses automatiques.",
    },
    stack: ["Discord", "Bots", "Automation"],
    details: [
      {
        label: label.objective,
        text: {
          en: "Make everyday server interactions easier through useful commands and automated responses.",
          fr: "Faciliter les échanges sur un serveur grâce à des commandes utiles et des réponses automatiques.",
        },
      },
      {
        label: label.focus,
        text: {
          en: "Command handling, event-driven interactions and integration with a Discord server.",
          fr: "Gestion des commandes, interactions événementielles et intégration à un serveur Discord.",
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------

export type Skill = { name: string; text: Localized; tags: string[]; learning?: boolean };
export type SkillGroup = { id: string; title: Localized; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    title: { en: "Programming", fr: "Programmation" },
    skills: [
      {
        name: "C",
        text: {
          en: "Programs built on functions, pointers, data structures and manual memory management.",
          fr: "Programmes basés sur les fonctions, les pointeurs, les structures de données et la gestion manuelle de la mémoire.",
        },
        tags: ["Pointers", "Structures", "Memory allocation", "Recursion", "Sorting algorithms", "Linked lists", "Queues"],
      },
      {
        name: "Python",
        text: {
          en: "Scripts, games and command-line tools, including ciphers and language detection.",
          fr: "Scripts, jeux et outils en ligne de commande, dont des chiffrements et de la détection de langue.",
        },
        tags: ["Functions", "File handling", "Exceptions", "CLI tools", "Ciphers", "Pygame"],
      },
      {
        name: "TypeScript & React",
        learning: true,
        text: {
          en: "Learning by building this site: typed components, state, 3D scenes and an API route.",
          fr: "En apprentissage en construisant ce site : composants typés, état, scènes 3D et route d'API.",
        },
        tags: ["Next.js", "Hooks", "Types", "Three.js"],
      },
    ],
  },
  {
    id: "web",
    title: { en: "Web", fr: "Web" },
    skills: [
      {
        name: "HTML & CSS",
        text: {
          en: "Responsive pages with semantic structure, flexible layouts and animations.",
          fr: "Pages responsives avec une structure sémantique, des mises en page flexibles et des animations.",
        },
        tags: ["Semantic HTML", "Flexbox", "CSS Grid", "Media queries", "Animations", "Accessibility"],
      },
    ],
  },
  {
    id: "tools",
    title: { en: "Systems & tools", fr: "Systèmes & outils" },
    skills: [
      {
        name: "Linux",
        text: {
          en: "Daily terminal use: files, permissions, redirection, packages and dev environments.",
          fr: "Usage quotidien du terminal : fichiers, permissions, redirections, paquets et environnements de dev.",
        },
        tags: ["Bash", "Permissions", "Redirection", "Ubuntu", "WSL", "Kali Linux"],
      },
      {
        name: "Git & GitHub",
        text: {
          en: "Version control, branches, SSH authentication and publishing with GitHub Pages.",
          fr: "Gestion de versions, branches, authentification SSH et publication avec GitHub Pages.",
        },
        tags: ["Commits", "Branches", "Push & pull", "SSH", "GitHub Pages", "GitHub Actions"],
      },
    ],
  },
  {
    id: "security",
    title: { en: "Cybersecurity", fr: "Cybersécurité" },
    skills: [
      {
        name: "Networking",
        text: {
          en: "How networks communicate: addressing, protocols and connectivity.",
          fr: "Le fonctionnement des réseaux : adressage, protocoles et connectivité.",
        },
        tags: ["IP addressing", "TCP/IP", "Protocols"],
      },
      {
        name: "Footprinting & reconnaissance",
        text: {
          en: "Information gathering techniques used at the start of a security assessment.",
          fr: "Techniques de collecte d'informations utilisées au début d'un audit de sécurité.",
        },
        tags: ["Reconnaissance", "OSINT", "Information gathering"],
      },
      {
        name: "Network attacks",
        text: {
          en: "How DHCP and MAC-level attacks work and what they do to a local network.",
          fr: "Le fonctionnement des attaques DHCP et MAC et leur impact sur un réseau local.",
        },
        tags: ["DHCP attacks", "MAC attacks", "Local networks"],
      },
      {
        name: "System & web security",
        text: {
          en: "System vulnerabilities and web application exploitation concepts.",
          fr: "Vulnérabilités système et concepts d'exploitation d'applications web.",
        },
        tags: ["System attacks", "Web exploitation", "Vulnerabilities"],
      },
      {
        name: "Wordlists with CeWL",
        text: {
          en: "Generating custom wordlists from website content on Kali Linux.",
          fr: "Génération de listes de mots personnalisées à partir du contenu d'un site sous Kali Linux.",
        },
        tags: ["Kali Linux", "CeWL", "Web crawling"],
      },
      {
        name: "Cryptography",
        text: {
          en: "Caesar and Vigenère ciphers implemented in Python for encryption and decryption.",
          fr: "Chiffrements de César et de Vigenère implémentés en Python.",
        },
        tags: ["Encryption", "Caesar", "Vigenère"],
      },
      {
        name: "Authentication",
        text: {
          en: "Authentication methods, and SSH keys for authenticated connections to GitHub.",
          fr: "Méthodes d'authentification et clés SSH pour se connecter à GitHub.",
        },
        tags: ["SSH", "Keys", "GitHub auth"],
      },
      {
        name: "Training modules",
        text: {
          en: "Coursework from my cybersecurity training, including APT Microsoft Safety and Upgrading.",
          fr: "Modules de ma formation en cybersécurité, dont APT Microsoft Safety et Upgrading.",
        },
        tags: ["APT Microsoft Safety", "Upgrading"],
      },
    ],
  },
];

// ---------------------------------------------------------------------------

export type TimelineEntry = { year: string; place?: string; title: Localized; text: Localized };

export const timeline: TimelineEntry[] = [
  {
    year: "2023",
    title: { en: "Scientific baccalaureate", fr: "Baccalauréat scientifique" },
    text: { en: "Physics and chemistry, with honours.", fr: "Physique-chimie, avec mention." },
  },
  {
    year: "2023–24",
    place: "ITEIP · Fès",
    title: { en: "Six-month cybersecurity bootcamp", fr: "Bootcamp cybersécurité de six mois" },
    text: {
      en: "November 2023 to April 2024: networks, attacks and defence. Completed with a certificate.",
      fr: "De novembre 2023 à avril 2024 : réseaux, attaques et défense. Validé par un certificat de fin de formation.",
    },
  },
  {
    year: "2024–25",
    place: "EMSI · Fès",
    title: { en: "Preparatory engineering studies, year 1", fr: "Classes préparatoires intégrées, 1re année" },
    text: {
      en: "Mathematics, programming and analytical thinking.",
      fr: "Mathématiques, programmation et raisonnement analytique.",
    },
  },
  {
    year: "2025–26",
    place: "EMSI · Fès",
    title: { en: "Preparatory engineering studies, year 2", fr: "Classes préparatoires intégrées, 2e année" },
    text: {
      en: "Deeper computer science and mathematical methods for harder problems.",
      fr: "Approfondissement de l'informatique et des méthodes mathématiques.",
    },
  },
  {
    year: "2026–27",
    place: "EPITECH · Paris",
    title: { en: "Exchange programme", fr: "Programme d'échange" },
    text: {
      en: "Project-based learning and independent problem solving.",
      fr: "Apprentissage par projets et résolution de problèmes en autonomie.",
    },
  },
];

// ---------------------------------------------------------------------------
// What I can bring to a team (the "services" of a student portfolio).

export type Service = { id: string; icon: "shield" | "code" | "chip" | "bot" | "terminal" | "puzzle"; title: Localized; text: Localized };

export const services: Service[] = [
  {
    id: "network-defence",
    icon: "shield",
    title: { en: "Network monitoring", fr: "Surveillance réseau" },
    text: {
      en: "Setting up intrusion detection with Snort, writing custom rules and reading alerts.",
      fr: "Mettre en place une détection d'intrusion avec Snort, écrire des règles et analyser les alertes.",
    },
  },
  {
    id: "security-basics",
    icon: "puzzle",
    title: { en: "Security analysis", fr: "Analyse de sécurité" },
    text: {
      en: "Reconnaissance, understanding network and web attacks, and explaining how to defend against them.",
      fr: "Reconnaissance, compréhension des attaques réseau et web, et des moyens de s'en protéger.",
    },
  },
  {
    id: "web",
    icon: "code",
    title: { en: "Web interfaces", fr: "Interfaces web" },
    text: {
      en: "Responsive, accessible pages, from HTML and CSS to React, TypeScript and Next.js.",
      fr: "Des pages responsives et accessibles, du HTML et CSS jusqu'à React, TypeScript et Next.js.",
    },
  },
  {
    id: "embedded",
    icon: "chip",
    title: { en: "Embedded prototypes", fr: "Prototypes embarqués" },
    text: {
      en: "Arduino systems with sensors, motors and displays, programmed in C/C++.",
      fr: "Des systèmes Arduino avec capteurs, moteurs et écrans, programmés en C/C++.",
    },
  },
  {
    id: "automation",
    icon: "bot",
    title: { en: "Automation", fr: "Automatisation" },
    text: {
      en: "Python scripts, command-line tools and bots that save time on repetitive work.",
      fr: "Scripts Python, outils en ligne de commande et bots qui font gagner du temps.",
    },
  },
  {
    id: "systems",
    icon: "terminal",
    title: { en: "Linux & Git workflows", fr: "Linux & Git au quotidien" },
    text: {
      en: "Comfortable in the terminal: permissions, packages, SSH keys, branches and deployments.",
      fr: "À l'aise dans le terminal : permissions, paquets, clés SSH, branches et déploiements.",
    },
  },
];
