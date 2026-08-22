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
      href: import.meta.env.DEV ? "http://localhost:5180" : "/workspace/",
      title: "Flagship product — freelance workspace",
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
    /** Public site / lab206.com */
    email: "scott@lab206.com",
    mailto:
      "mailto:scott@lab206.com?subject=Powers%20%E2%80%94%20contact%20from%20lab206",
    githubProfile: "https://github.com/spowers2",
    githubIssues: "https://github.com/spowers2/powers/issues/new",
    githubRepo: "https://github.com/spowers2/powers",
  },
} as const;
