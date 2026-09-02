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
import { AccountsPage } from "./pages/Accounts.js";
import { AccountDetailPage } from "./pages/AccountDetail.js";
import { ActivityPage } from "./pages/Activity.js";
import { TransferPage } from "./pages/Transfer.js";
import { CardsPage } from "./pages/Cards.js";
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
        path: "/accounts",
        component: () => AccountsPage({ router }),
      },
      {
        path: "/accounts/:id",
        component: ({ params }) =>
          AccountDetailPage({
            router,
            id: String(params.id ?? ""),
          }),
      },
      {
        path: "/activity",
        component: () => ActivityPage({ router }),
      },
      {
        path: "/transfer",
        component: () => TransferPage({ router, toaster }),
      },
      {
        path: "/cards",
        component: () => CardsPage({ router, toaster }),
      },
      {
        path: "/settings",
        component: () => SettingsPage({ router, theme, density, toaster }),
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
    { id: "/accounts", label: "Accounts" },
    { id: "/activity", label: "Activity" },
    { id: "/transfer", label: "Transfer" },
    { id: "/cards", label: "Cards" },
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
              <span class="app-brand__name">Bank Power</span>
              <span class="app-brand__sub">Personal banking demo</span>
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
              to="/accounts"
              activeClass="is-active"
              class="app-nav__link"
            >
              Accounts
            </Link>
            <Link
              router={router}
              to="/activity"
              activeClass="is-active"
              class="app-nav__link"
            >
              Activity
            </Link>
            <Link
              router={router}
              to="/transfer"
              activeClass="is-active"
              class="app-nav__link"
            >
              Transfer
            </Link>
            <Link
              router={router}
              to="/cards"
              activeClass="is-active"
              class="app-nav__link"
            >
              Cards
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
  const theme = createTheme("light");
  theme.bind();
  const density = createDensity("comfortable");
  density.bind();
  const toaster = createToaster();
  return { theme, density, toaster };
}
