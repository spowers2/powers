/**
 * Single site navigation — same on landing, playground, todos, etc.
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
            Power UI
          </Link>

          <nav class="site-nav-links" aria-label="Primary">
            <Link router={router} to="/" exact activeClass="active">
              Home
            </Link>
            <Link router={router} to="/playground" activeClass="active">
              Playground
            </Link>
            <Link router={router} to="/todos" activeClass="active">
              Todos
            </Link>
            <Link router={router} to="/system" activeClass="active">
              System
            </Link>
          </nav>

          <div class="site-nav-actions">
            <Button size="sm" variant="ghost" onClick={() => theme.toggle()}>
              {() => (theme.mode() === "dark" ? "Light" : "Dark")}
            </Button>
            <Button
              size="sm"
              onClick={() => router.navigate("/playground")}
            >
              Get started
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
