/**
 * Site navigation — kit pages + product demos; theme tools right.
 * Phone: single Menu (no sideways scroll). Tablet+: inline links.
 */
import type { Router } from "@lab206/router";
import { Link } from "@lab206/router";
import {
  Button,
  Container,
  Menu,
  type ThemeController,
  type PaletteController,
} from "@lab206/ui";
import { SITE } from "./siteConfig.js";

const PHONE_MENU = [
  { id: "/", label: "Home" },
  { id: "/docs", label: "Docs" },
  { id: "/lab", label: "Lab" },
  { id: "/system", label: "System" },
  { id: SITE.contact.href, label: SITE.contact.label },
  { id: "__workspace", label: "designlab206 (live)" },
  { id: "__logistics", label: SITE.demos.logistics.label },
  { id: "__bank", label: SITE.demos.bank.label },
  { id: "__hearth", label: SITE.demos.hearth.label },
  { id: "__figma", label: "Figma plugin" },
] as const;

export function SiteNav(props: {
  router: Router;
  theme: ThemeController;
  palette: PaletteController;
}) {
  const { router, theme, palette } = props;

  const onPhoneSelect = (id: string) => {
    if (id === "__workspace") {
      window.open(
        SITE.demos.workspace.href,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    if (id === "__logistics") {
      window.open(
        SITE.demos.logistics.href,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    if (id === "__bank") {
      window.open(SITE.demos.bank.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (id === "__hearth") {
      window.open(SITE.demos.hearth.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (id === "__figma") {
      window.open(SITE.figma.pluginUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (id === "/") {
      router.navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.navigate(id);
  };

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

          <div class="site-nav-phone">
            <Menu
              items={[...PHONE_MENU]}
              align="end"
              onSelect={onPhoneSelect}
              trigger={
                <button
                  type="button"
                  class="site-nav-phone__btn"
                  aria-label="Open menu"
                >
                  Menu
                </button>
              }
            />
          </div>

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
            <Link
              router={router}
              to={SITE.contact.href}
              class="site-nav-contact"
              activeClass="active"
            >
              {SITE.contact.label}
            </Link>
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
              <span class="site-nav-demo-short">designlab206</span>
            </a>
            <a
              class="site-nav-demo"
              href={SITE.demos.logistics.href}
              {...SITE.demoLinkAttrs}
              title={SITE.demos.logistics.title}
            >
              <span class="site-nav-demo-full">
                {SITE.demos.logistics.label}
              </span>
              <span class="site-nav-demo-short">Logistics</span>
            </a>
            <a
              class="site-nav-demo"
              href={SITE.demos.bank.href}
              {...SITE.demoLinkAttrs}
              title={SITE.demos.bank.title}
            >
              <span class="site-nav-demo-full">{SITE.demos.bank.label}</span>
              <span class="site-nav-demo-short">Bank</span>
            </a>
            <a
              class="site-nav-demo"
              href={SITE.demos.hearth.href}
              {...SITE.demoLinkAttrs}
              title={SITE.demos.hearth.title}
            >
              <span class="site-nav-demo-full">{SITE.demos.hearth.label}</span>
              <span class="site-nav-demo-short">Restaurant</span>
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
