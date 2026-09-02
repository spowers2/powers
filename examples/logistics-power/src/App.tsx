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
        component: () => SettingsPage({ theme, density, toaster }),
      },
    ],
    notFound: () => (
      <Container size="xl">
        <div class="not-found">
          <p>Signal lost — route not on the mesh.</p>
          <Button size="sm" onClick={() => router.navigate("/")}>
            Return to command
          </Button>
        </div>
      </Container>
    ),
  });

  const phoneMenuItems = [
    { id: "/", label: "Overview" },
    { id: "/shipments", label: "Shipments" },
    { id: "/exceptions", label: "Exceptions" },
    { id: "/partners", label: "Partners" },
    { id: "/settings", label: "Settings" },
  ];

  const outletNode = router.outlet();

  function Shell() {
    return (
      <div class="app-shell">
        <header class="app-header">
          <Link router={router} to="/" class="app-brand" exact>
            <span class="app-brand__mark" aria-hidden="true" />
            <span class="app-brand__text">
              <span class="app-brand__name">Logistics Power</span>
              <span class="app-brand__sub">Control tower · v0.1</span>
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
              Exceptions
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
                  Panels
                </Button>
              }
            />
          </div>

          <div class="app-header-actions">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => theme.toggle()}
              aria-label="Toggle theme"
            >
              {() => (theme.mode() === "dark" ? "LT" : "DK")}
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
  // Always arm dark HUD by default — sci-fi instrument panel
  const theme = createTheme("dark");
  theme.bind();
  const density = createDensity("compact");
  density.bind();
  const toaster = createToaster();
  return { theme, density, toaster };
}
