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
import { OverviewPage } from "./pages/Overview.js";
import { ShipmentsPage } from "./pages/Shipments.js";
import { ShipmentDetailPage } from "./pages/ShipmentDetail.js";
import { ExceptionsPage } from "./pages/Exceptions.js";
import { PartnersPage } from "./pages/Partners.js";
import { SettingsPage } from "./pages/Settings.js";

export function createApp(opts: {
  theme: ThemeController;
  density: DensityController;
  toaster: ToastController;
}) {
  const { theme, density, toaster } = opts;

  const routerMode =
    import.meta.env.BASE_URL === "/" ? ("history" as const) : ("hash" as const);

  const router = createRouter({
    mode: routerMode,
    routes: [
      {
        path: "/",
        component: () => OverviewPage({ router, toaster }),
      },
      {
        path: "/shipments",
        component: () => ShipmentsPage({ router, toaster }),
      },
      {
        path: "/shipments/:id",
        component: ({ params }) =>
          ShipmentDetailPage({
            router,
            toaster,
            id: String(params.id ?? ""),
          }),
      },
      {
        path: "/exceptions",
        component: () => ExceptionsPage({ router, toaster }),
      },
      {
        path: "/partners",
        component: () => PartnersPage({ router, toaster }),
      },
      {
        path: "/settings",
        component: () =>
          SettingsPage({ router, theme, density, toaster }),
      },
    ],
    notFound: () => (
      <Container size="xl">
        <div class="not-found">
          <p>That page isn’t in this demo.</p>
          <Button size="sm" onClick={() => router.navigate("/")}>
            Back to overview
          </Button>
        </div>
      </Container>
    ),
  });

  const phoneMenuItems = [
    { id: "/", label: "Overview" },
    { id: "/shipments", label: "Shipments" },
    { id: "/exceptions", label: "Issues" },
    { id: "/partners", label: "Partners" },
    { id: "/settings", label: "Settings" },
  ];

  const outletNode = router.outlet();

  function Shell() {
    return (
      <div class="app-shell">
        <div class="circuit-bg" aria-hidden="true">
          <div class="circuit-bg__grid" />
          <div class="circuit-bg__traces" />
          <div class="circuit-bg__pulse" />
        </div>
        <header class="app-header">
          <Link router={router} to="/" class="app-brand" exact>
            <span class="app-brand__mark" aria-hidden="true" />
            <span class="app-brand__text">
              <span class="app-brand__name">Logistics Power</span>
              <span class="app-brand__sub">Ops console demo</span>
            </span>
          </Link>

          <nav class="app-nav" aria-label="Main">
            <Link
              router={router}
              to="/"
              exact
              activeClass="is-active"
              class="app-nav__link"
            >
              Overview
            </Link>
            <Link
              router={router}
              to="/shipments"
              activeClass="is-active"
              class="app-nav__link"
            >
              Shipments
            </Link>
            <Link
              router={router}
              to="/exceptions"
              activeClass="is-active"
              class="app-nav__link"
            >
              Issues
            </Link>
            <Link
              router={router}
              to="/partners"
              activeClass="is-active"
              class="app-nav__link"
            >
              Partners
            </Link>
            <Link
              router={router}
              to="/settings"
              activeClass="is-active"
              class="app-nav__link"
            >
              Settings
            </Link>
          </nav>

          <div class="app-nav-phone">
            <Menu
              items={[...phoneMenuItems]}
              align="end"
              onSelect={(id) => router.navigate(id)}
              trigger={
                <Button size="sm" variant="soft">
                  Menu
                </Button>
              }
            />
          </div>

          <div class="app-header-actions">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => theme.toggle()}
              aria-label="Toggle light or dark theme"
            >
              {() => (theme.mode() === "dark" ? "Light" : "Dark")}
            </Button>
          </div>
        </header>

        <main class="app-main">{outletNode}</main>
        <Toaster toaster={toaster} />
      </div>
    );
  }

  return { router, Shell };
}

export function bootstrapTheme() {
  // Light instrument panel by default (client-friendly); Dark still available
  const theme = createTheme("light");
  theme.bind();
  const density = createDensity("comfortable");
  density.bind();
  const toaster = createToaster();
  return { theme, density, toaster };
}
