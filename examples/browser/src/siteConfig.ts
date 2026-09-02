/**
 * Public site brand (lab206.com) vs product system (Powers).
 * Demo URLs: local Vite ports in dev; same-origin paths on the live site.
 */
export const SITE = {
  /** Domain / marketing brand */
  name: "lab206",
  /** UI system / packages / Figma kit */
  systemName: "Powers",
  /**
   * Craft-first AI marketing (same voice as labazine.com):
   * accelerate with tools; don’t outsource judgment.
   */
  marketing: {
    /** Short line for hero / meta */
    aiLine: "AI where it helps; judgment where it counts.",
    /** Contact / about */
    aiNote:
      "I use AI to move faster on Powers and lab206 — design and code stay in the loop. AI helps with the pace; the decisions are still mine.",
    /** Meta description for the public site */
    description:
      "Powers — fine-grained UI kit with a design system built in. Figma, Lab, and production components. AI where it helps; judgment where it counts.",
  },
  figma: {
    /** Published design library file */
    kitUrl: "https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd",
    /** Live Community plugin */
    pluginUrl:
      "https://www.figma.com/community/plugin/1671016490810398688",
    pluginLabel: "Powers Design Kit",
  },
  demos: {
    workspace: {
      label: "designlab206",
      /** Live product site (Powers). Local app: `pnpm example:starter` → :5180 */
      href: "https://designlab206.com/",
      title: "Flagship product — freelance workspace (live)",
    },
    hearth: {
      label: "Restaurant Power",
      href: import.meta.env.DEV ? "http://localhost:5181" : "/hearth/",
      title: "Restaurant Power — hospitality product demo",
    },
    logistics: {
      label: "Logistics Power",
      href: import.meta.env.DEV ? "http://localhost:5182" : "/logistics/",
      title: "Freight ops control tower — dense data demo",
    },
    bank: {
      label: "Bank Power",
      href: import.meta.env.DEV ? "http://localhost:5183" : "/bank/",
      title: "Bank Power — business banking console demo",
    },
  },
  /** Always open product demos in a new tab so lab206 stays available. */
  demoLinkAttrs: {
    target: "_blank" as const,
    rel: "noopener noreferrer" as const,
  },
  /**
   * How to reach the author about Powers.
   * Email is the primary “Contact” affordance on lab206;
   * GitHub Issues for bugs / public discussion.
   */
  contact: {
    label: "Contact",
    /** In-app form route (no mailto / mail app) */
    href: "/contact",
    /** Pre-filled commercial inquire */
    commercialHref: "/contact?subject=Commercial%20license",
    /** Shown on the form; PHP delivers here */
    email: "scott@lab206.com",
    githubProfile: "https://github.com/spowers2",
    githubIssues: "https://github.com/spowers2/powers/issues/new",
    githubRepo: "https://github.com/spowers2/powers",
  },
} as const;
