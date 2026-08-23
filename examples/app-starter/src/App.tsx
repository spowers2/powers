import {
  Button,
  Container,
  Menu,
  createDensity,
  createTheme,
  createToaster,
  Toaster,
  type DensityController,
  type ThemeController,
  type ToastController,
} from "@lab206/ui";
import { createRouter, Link } from "@lab206/router";
import { DashboardPage } from "./pages/Dashboard.js";
import { ClientsPage } from "./pages/Clients.js";
import { ProjectsPage } from "./pages/Projects.js";
import { TasksPage } from "./pages/Tasks.js";
import { InvoicesPage } from "./pages/Invoices.js";
import { TimePage } from "./pages/Time.js";
import { SettingsPage } from "./pages/Settings.js";
import { PortalPage } from "./pages/Portal.js";
import { profile } from "./data/store.js";

export function createApp(opts: {
  theme: ThemeController;
  density: DensityController;
  toaster: ToastController;
}) {
  const { theme, density, toaster } = opts;

  // Subdirectory deploys (e.g. lab206.com/workspace/) use hash routes so
  // deep links work without a server rewrite / basename.
  const routerMode =
    import.meta.env.BASE_URL === "/" ? ("history" as const) : ("hash" as const);

  const router = createRouter({
    mode: routerMode,
    routes: [
      {
        path: "/",
        component: () => DashboardPage({ router, toaster }),
      },
      {
        path: "/clients",
        component: () => ClientsPage({ toaster, router }),
      },
      {
        path: "/projects",
        component: () => ProjectsPage({ toaster, router }),
      },
      {
        path: "/tasks",
        component: () => TasksPage({ toaster, router }),
      },
      {
        path: "/invoices",
        component: () => InvoicesPage({ toaster, router }),
      },
      {
        path: "/time",
        component: () => TimePage({ toaster, router }),
      },
      {
        path: "/settings",
        component: () => SettingsPage({ theme, density, toaster }),
      },
      {
        path: "/portal",
        component: () => PortalPage({ router, toaster }),
      },
    ],
    notFound: () => (
      <Container size="xl">
        <div class="not-found">
          <p>That page doesn’t exist.</p>
          <Button size="sm" onClick={() => router.navigate("/")}>
            Back to dashboard
          </Button>
        </div>
      </Container>
    ),
  });

  const moreItems = [
    { id: "/projects", label: "Projects" },
    { id: "/invoices", label: "Invoices" },
    { id: "/time", label: "Time" },
    { id: "/settings", label: "Settings" },
    { id: "/portal", label: "Client portal →" },
  ];

  const outletNode = router.outlet();

  function Shell() {
    const isPortal = () => router.path().startsWith("/portal");

    return (
      <div class="app-shell">
        {() =>
          isPortal() ? (
            <header class="app-header app-header--portal">
              <Link router={router} to="/portal" class="app-brand" exact>
                <span class="app-brand__mark" aria-hidden="true" />
                <span class="app-brand__text">
                  <span class="app-brand__name">designlab206</span>
                  <span class="app-brand__sub">Client portal</span>
                </span>
              </Link>
              <nav class="app-nav" aria-label="Portal">
                <Link router={router} to="/portal" exact activeClass="is-active">
                  My projects
                </Link>
              </nav>
              <div class="app-header-actions">
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => router.navigate("/")}
                >
                  Staff workspace
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => theme.toggle()}
                  aria-label="Toggle theme"
                >
                  {() => (theme.mode() === "dark" ? "Light" : "Dark")}
                </Button>
              </div>
            </header>
          ) : (
            <header class="app-header">
              <Link router={router} to="/" class="app-brand" exact>
                <span class="app-brand__mark" aria-hidden="true" />
                <span class="app-brand__text">
                  <span class="app-brand__name">designlab206</span>
                  <span class="app-brand__sub">
                    {() => profile().company || "Studio"}
                  </span>
                </span>
              </Link>
              <nav class="app-nav" aria-label="Main">
                <Link router={router} to="/" exact activeClass="is-active">
                  Dashboard
                </Link>
                <Link router={router} to="/clients" activeClass="is-active">
                  Clients
                </Link>
                <Link
                  router={router}
                  to="/projects"
                  activeClass="is-active"
                  class="app-nav__wide"
                >
                  Projects
                </Link>
                <Link router={router} to="/tasks" activeClass="is-active">
                  Tasks
                </Link>
                <Link
                  router={router}
                  to="/invoices"
                  activeClass="is-active"
                  class="app-nav__wide"
                >
                  Invoices
                </Link>
                <Link
                  router={router}
                  to="/time"
                  activeClass="is-active"
                  class="app-nav__wide"
                >
                  Time
                </Link>
                <Link
                  router={router}
                  to="/settings"
                  activeClass="is-active"
                  class="app-nav__wide"
                >
                  Settings
                </Link>
                <div class="app-nav-more">
                  <Menu
                    items={moreItems}
                    onSelect={(id) => router.navigate(id)}
                    trigger={
                      <Button size="sm" variant="soft" aria-label="More pages">
                        More
                      </Button>
                    }
                  />
                </div>
              </nav>
              <div class="app-header-actions">
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => router.navigate("/portal")}
                >
                  Client portal
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => theme.toggle()}
                  aria-label="Toggle theme"
                >
                  {() => (theme.mode() === "dark" ? "Light" : "Dark")}
                </Button>
              </div>
            </header>
          )
        }
        <main class="app-main">
          <Container size="xl">{outletNode}</Container>
        </main>
        <footer class="app-footer">
          <span>
            {() =>
              isPortal()
                ? "designlab206 · client portal (demo)"
                : "designlab206 · built with Powers"
            }
          </span>
          <span>
            {() => profile().email} · {() => theme.mode()} ·{" "}
            <a
              class="app-footer__link"
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
            >
              Powers kit
            </a>
          </span>
        </footer>
        <Toaster toaster={toaster} />
      </div>
    );
  }

  return { router, Shell };
}

export function bootstrapTheme() {
  const theme = createTheme(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );
  theme.bind();
  const density = createDensity("comfortable");
  density.bind();
  const toaster = createToaster();
  return { theme, density, toaster };
}
