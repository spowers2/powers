/**
 * Site navigation — kit pages center-left; product demos once; theme tools right.
 */
import type { Router } from "@powers/router";
import { Link } from "@powers/router";
import {
  Button,
  Container,
  type ThemeController,
  type PaletteController,
} from "@powers/ui";
import { SITE } from "./siteConfig.js";

export function SiteNav(props: {
  router: Router;
  theme: ThemeController;
  palette: PaletteController;
}) {
  const { router, theme, palette } = props;

  return (
    <header class="site-nav">
      <Container size="xl">
        <div class="site-nav-inner">
          <Link
            router={router}
            to="/"
            class="site-brand"
            exact
            aria-label={`${SITE.name} home`}
            onClick={() => {
              router.navigate("/");
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <span class="site-mark" aria-hidden="true" />
            <span class="site-brand-label">{SITE.name}</span>
          </Link>

          <nav class="site-nav-links" aria-label="Primary">
            <Link router={router} to="/" exact activeClass="active">
              Home
            </Link>
            <Link router={router} to="/docs" activeClass="active">
              Docs
            </Link>
            <Link router={router} to="/lab" activeClass="active">
              Lab
            </Link>
            <Link router={router} to="/system" activeClass="active">
              System
            </Link>
            <span class="site-nav-sep" aria-hidden="true" />
            <a
              class="site-nav-demo"
              href={SITE.demos.workspace.href}
              target={import.meta.env.DEV ? "_blank" : undefined}
              rel={import.meta.env.DEV ? "noreferrer" : undefined}
              title={SITE.demos.workspace.title}
            >
              {SITE.demos.workspace.label}
            </a>
            <a
              class="site-nav-demo"
              href={SITE.demos.hearth.href}
              target={import.meta.env.DEV ? "_blank" : undefined}
              rel={import.meta.env.DEV ? "noreferrer" : undefined}
              title={SITE.demos.hearth.title}
            >
              {SITE.demos.hearth.label}
            </a>
            <a
              class="site-nav-demo"
              href={SITE.figma.pluginUrl}
              target="_blank"
              rel="noreferrer"
              title="Powers Design Kit — Figma Community"
            >
              Figma plugin
            </a>
          </nav>

          <div class="site-nav-actions" aria-label="Theme">
            <Button
              size="sm"
              variant="ghost"
              aria-label="Toggle color palette"
              title="Palette: Dual electric ↔ Instrument"
              onClick={() => palette.toggle()}
            >
              {() =>
                palette.id() === "dual" ? "Instrument" : "Dual electric"
              }
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Toggle light or dark theme"
              onClick={() => theme.toggle()}
            >
              {() => (theme.mode() === "dark" ? "Light" : "Dark")}
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
