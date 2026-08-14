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
} from "@power-ui/ui";
import { createRouter, Link } from "@power-ui/router";
import { HomePage } from "./pages/Home.js";
import { MenuPage } from "./pages/Menu.js";
import { ReservationsPage } from "./pages/Reservations.js";
import { ServicePage } from "./pages/Service.js";
import { TableMapPage } from "./pages/TableMap.js";
import { SettingsPage } from "./pages/Settings.js";
import { GuestHomePage } from "./pages/GuestHome.js";
import { GuestMenuPage } from "./pages/GuestMenu.js";
import { GuestBookPage } from "./pages/GuestBook.js";
import { profile } from "./data/store.js";

export function createApp(opts: {
  theme: ThemeController;
  density: DensityController;
  toaster: ToastController;
}) {
  const { theme, density, toaster } = opts;

  const router = createRouter({
    routes: [
      {
        path: "/",
        component: () => HomePage({ router, toaster }),
      },
      {
        path: "/menu",
        component: () => MenuPage({ toaster }),
      },
      {
        path: "/reservations",
        component: () => ReservationsPage({ toaster, router }),
      },
      {
        path: "/service",
        component: () => ServicePage({ toaster, router }),
      },
      {
        path: "/tables",
        component: () => TableMapPage({ router, toaster }),
      },
      {
        path: "/settings",
        component: () => SettingsPage({ theme, density, toaster }),
      },
      {
        path: "/visit",
        component: () => GuestHomePage({ router, toaster }),
      },
      {
        path: "/visit/menu",
        component: () => GuestMenuPage({ router, toaster }),
      },
      {
        path: "/visit/book",
        component: () => GuestBookPage({ router, toaster }),
      },
    ],
    notFound: () => (
      <Container size="xl">
        <div class="not-found">
          <p>That page doesn’t exist.</p>
          <Button size="sm" onClick={() => router.navigate("/")}>
            Back home
          </Button>
        </div>
      </Container>
    ),
  });

  /** Single outlet host — must not call outlet() twice (would fight over effects). */
  const outletNode = router.outlet();

  function Shell() {
    return (
      <div class="app-shell">
        {() =>
          router.path().startsWith("/visit") ? (
            <header class="app-header app-header--guest">
              <Link router={router} to="/visit" class="app-brand" exact>
                <span class="app-brand__mark" aria-hidden="true" />
                <span class="app-brand__text">
                  <span class="app-brand__name">
                    {() => profile().name || "Hearth"}
                  </span>
                  <span class="app-brand__sub">Dining</span>
                </span>
              </Link>
              <nav class="app-nav" aria-label="Guest">
                <Link router={router} to="/visit" exact activeClass="is-active">
                  Home
                </Link>
                <Link router={router} to="/visit/menu" activeClass="is-active">
                  Menu
                </Link>
                <Link router={router} to="/visit/book" activeClass="is-active">
                  Book
                </Link>
              </nav>
              <div class="app-header-actions">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.navigate("/")}
                >
                  Staff
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
                  <span class="app-brand__name">
                    {() => profile().name || "Hearth"}
                  </span>
                  <span class="app-brand__sub">Staff</span>
                </span>
              </Link>
              <nav class="app-nav" aria-label="Staff">
                <Link router={router} to="/" exact activeClass="is-active">
                  Overview
                </Link>
                <Link router={router} to="/tables" activeClass="is-active">
                  Map
                </Link>
                <Link router={router} to="/service" activeClass="is-active">
                  Kitchen
                </Link>
                <Link
                  router={router}
                  to="/reservations"
                  activeClass="is-active"
                  class="app-nav__wide"
                >
                  Book
                </Link>
                <Link
                  router={router}
                  to="/menu"
                  activeClass="is-active"
                  class="app-nav__wide"
                >
                  Menu
                </Link>
                <Link
                  router={router}
                  to="/settings"
                  activeClass="is-active"
                  class="app-nav__wide"
                >
                  Team
                </Link>
                <div class="app-nav-more">
                  <Menu
                    items={[
                      { id: "/reservations", label: "Book" },
                      { id: "/menu", label: "Menu" },
                      { id: "/settings", label: "Team & settings" },
                      { id: "/visit", label: "Guest site →" },
                    ]}
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
                  onClick={() => router.navigate("/visit")}
                >
                  Guest site
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
              router.path().startsWith("/visit")
                ? `${profile().name} · ${profile().address}`
                : `${profile().name} · staff ops`
            }
          </span>
          <span>
            {() =>
              router.path().startsWith("/visit")
                ? profile().phone
                : `${profile().phone} · ${theme.mode()}`
            }
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
