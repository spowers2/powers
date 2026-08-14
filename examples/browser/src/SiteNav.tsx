/**
 * Single site navigation — Docs first for new developers.
 * Progressive disclosure keeps primary links on one row.
 */
import type { Router } from "@power-ui/router";
import { Link } from "@power-ui/router";
import { Button, Container, type ThemeController } from "@power-ui/ui";

export function SiteNav(props: {
  router: Router;
  theme: ThemeController;
}) {
  const { router, theme } = props;

  return (
    <header class="site-nav">
      <Container size="xl">
        <div class="site-nav-inner">
          <Link router={router} to="/" class="site-brand" exact>
            <span class="site-mark" aria-hidden="true" />
            <span class="site-brand-label">Power UI</span>
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
            <Button
              size="sm"
              variant="soft"
              class="site-nav-cta"
              onClick={() => router.navigate("/docs")}
            >
              How to use
            </Button>
            <Button
              size="sm"
              class="site-nav-cta"
              onClick={() => router.navigate("/lab")}
            >
              Open Lab
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
