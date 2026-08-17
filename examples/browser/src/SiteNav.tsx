/**
 * Single site navigation — Docs first for new developers.
 * Progressive disclosure keeps primary links on one row.
 */
import type { Router } from "@powers/router";
import { Link } from "@powers/router";
import {
  Button,
  Container,
  type ThemeController,
  type PaletteController,
} from "@powers/ui";

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
            aria-label="Powers home"
            onClick={() => {
              // Always land on the marketing home (clear query/hash) and scroll up.
              router.navigate("/");
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <span class="site-mark" aria-hidden="true" />
            <span class="site-brand-label">Powers</span>
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
              href="http://localhost:5180"
              target="_blank"
              rel="noreferrer"
              title="designlab206 freelance workspace demo"
            >
              designlab206
            </a>
            <a
              class="site-nav-demo"
              href="http://localhost:5181"
              target="_blank"
              rel="noreferrer"
              title="Hearth restaurant demo"
            >
              Hearth
            </a>
          </nav>

          <div class="site-nav-actions">
            <Button
              size="sm"
              variant="ghost"
              title="Toggle palette: Dual electric ↔ Instrument (current default look)"
              onClick={() => palette.toggle()}
            >
              {() =>
                palette.id() === "dual" ? "Instrument" : "Dual electric"
              }
            </Button>
            <Button size="sm" variant="ghost" onClick={() => theme.toggle()}>
              {() => (theme.mode() === "dark" ? "Light" : "Dark")}
            </Button>
            <a
              class="site-nav-demo-btn"
              href="http://localhost:5180"
              target="_blank"
              rel="noreferrer"
            >
              Demos
            </a>
            <a
              class="site-nav-demo-btn site-nav-cta"
              href="http://localhost:5180"
              target="_blank"
              rel="noreferrer"
              title="Flagship product demo"
            >
              designlab206
            </a>
            <Button
              size="sm"
              class="site-nav-cta"
              onClick={() => router.navigate("/lab?recipe=hello")}
            >
              Lab
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
