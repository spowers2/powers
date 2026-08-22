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
} as const;
