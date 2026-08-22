/**
 * Site navigation — kit pages + product demos; theme tools right.
 * Below ~1100px demos use short labels; on phones the link row scrolls.
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
            <a
              class="site-nav-contact"
              href={SITE.contact.mailto}
              title={`Email ${SITE.contact.email}`}
            >
              {SITE.contact.label}
            </a>
            <span class="site-nav-sep" aria-hidden="true" />
            <a
              class="site-nav-demo"
              href={SITE.demos.workspace.href}
              {...SITE.demoLinkAttrs}
              title={SITE.demos.workspace.title}
            >
              <span class="site-nav-demo-full">
                {SITE.demos.workspace.label}
              </span>
              <span class="site-nav-demo-short">Workspace</span>
            </a>
            <a
              class="site-nav-demo"
              href={SITE.demos.hearth.href}
              {...SITE.demoLinkAttrs}
              title={SITE.demos.hearth.title}
            >
              <span class="site-nav-demo-full">{SITE.demos.hearth.label}</span>
              <span class="site-nav-demo-short">Hearth</span>
            </a>
            <a
              class="site-nav-demo"
              href={SITE.figma.pluginUrl}
              target="_blank"
              rel="noreferrer"
              title="Powers Design Kit — Figma Community"
            >
              <span class="site-nav-demo-full">Figma plugin</span>
              <span class="site-nav-demo-short">Plugin</span>
            </a>
          </nav>

          <div class="site-nav-actions" aria-label="Theme">
            <Button
              size="sm"
              variant="ghost"
              aria-label="Toggle color palette"
              onClick={() => palette.toggle()}
            >
              <span class="site-nav-action-full">
                {() =>
                  palette.id() === "dual" ? "Instrument" : "Dual electric"
                }
              </span>
              <span class="site-nav-action-short">
                {() => (palette.id() === "dual" ? "Instr." : "Dual")}
              </span>
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
