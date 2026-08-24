# Quality gates (Pro)

Copied/adapted from the free kit quality bar — use before client delivery.

| Gate | Pass criteria |
|------|----------------|
| Instance purity | No detached kit components on pattern pages |
| Variables | Fills/strokes/radius from Variables where kit supports them |
| A11y chrome | Focus rings visible; dialogs have titles; menus keyboardable |
| Contrast | Text on surfaces meets your WCAG target (aim AA) |
| Density | Comfortable + compact checked if product uses density |
| Theme | Light/dark for auth + primary app shell |
| Parity | Pattern recipe layers match Figma layer names |

Automated (maintainers): `pnpm design-kit:figma-audit` from monorepo.
