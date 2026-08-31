/**
 * Public site brand (lab206.com) vs product system (Powers).
 * Demo URLs: local Vite ports in dev; same-origin paths on the live site.
 */
export const SITE = {
  /** Domain / marketing brand */
  name: "lab206",
  /** UI system / packages / Figma kit */
  systemName: "Powers",
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
      label: "Hearth",
      href: import.meta.env.DEV ? "http://localhost:5181" : "/hearth/",
      title: "Restaurant product demo",
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
