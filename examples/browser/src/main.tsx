/**
 * Powers site — shared nav + landing + demos + design system
 */
import { signal } from "@powers/core";
import { animate, spring } from "@powers/animate";
import { mount, bindStyle } from "@powers/dom";
import { createRouter, Link } from "@powers/router";
import {
  Button,
  Input,
  Textarea,
  Select,
  Field,
  Switch,
  Checkbox,
  Stack,
  Text,
  Card,
  Container,
  Badge,
  createTheme,
  createDensity,
  installDevWarnings,
} from "@powers/ui";
import "@powers/ui/theme.css";
import "./app.css";
import { LandingPage } from "./LandingPage.js";
import { DocsPage } from "./DocsPage.js";
import { SiteNav } from "./SiteNav.js";
import { SystemPage } from "./SystemPage.js";
import { LabPage } from "./lab/LabPage.js";

installDevWarnings();

const theme = createTheme(
  typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
);
theme.bind();

const density = createDensity("comfortable");
density.bind();

function PlaygroundPage() {
  const count = signal(0);
  const x = signal(0);
  const name = signal("Ada");

  const email = signal("");
  const role = signal("dev");
  const bio = signal("");
  const newsletter = signal(true);
  const terms = signal(false);
  const submitted = signal("");

  const emailError = () => {
    const v = email().trim();
    if (!v) return "";
    return v.includes("@") ? "" : "Enter a valid email";
  };

  const bump = (delta: number) => {
    count.update((n) => n + delta);
    animate(x, delta > 0 ? 100 : 0, spring({ stiffness: 220, damping: 18 }));
  };

  const ball = <div class="demo-ball" /> as HTMLElement;
  bindStyle(ball, () => ({ transform: `translateX(${x()}px)` }));

  return (
    <Container size="xl">
      <Stack gap={5}>
        <Stack direction="row" justify="between" align="center" wrap>
          <Text as="h2" size="xl">
            Playground
          </Text>
          <Badge tone="accent">forms · density · tokens</Badge>
        </Stack>

        <Card>
          <Stack gap={3}>
            <Text as="h3" size="sm" muted weight="semibold">
              Counter + animate
            </Text>
            <Text size="2xl">{() => String(count())}</Text>
            {ball}
            <Stack direction="row" gap={2} wrap>
              <Button variant="soft" onClick={() => bump(-1)}>
                −1
              </Button>
              <Button onClick={() => bump(1)}>+1</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  count.set(0);
                  animate(x, 0, { duration: 250, ease: "easeOut" });
                }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>
        </Card>

        <Card>
          <Stack gap={3}>
            <Text as="h3" size="sm" muted weight="semibold">
              Forms
            </Text>
            <Field
              label="Email"
              htmlFor="pg-email"
              required
              hint="We never share your email."
              error={emailError}
            >
              <Input
                id="pg-email"
                type="email"
                placeholder="you@company.com"
                bind={email}
                aria-invalid={() => !!emailError()}
              />
            </Field>
            <Field label="Role" htmlFor="pg-role">
              <Select
                id="pg-role"
                bind={role}
                options={[
                  { value: "dev", label: "Developer" },
                  { value: "design", label: "Designer" },
                  { value: "pm", label: "Product" },
                ]}
              />
            </Field>
            <Field label="Bio" htmlFor="pg-bio" hint="Optional">
              <Textarea
                id="pg-bio"
                rows={3}
                placeholder="Short intro…"
                bind={bio}
              />
            </Field>
            <Switch
              label="Email me product updates"
              bind={newsletter}
            />
            <Checkbox label="I agree to the terms" bind={terms} />
            <Stack direction="row" gap={2} wrap>
              <Button
                onClick={() => {
                  if (!terms()) {
                    submitted.set("Please accept the terms.");
                    return;
                  }
                  if (emailError() || !email().trim()) {
                    submitted.set("Fix the email field.");
                    return;
                  }
                  submitted.set(
                    `Saved ${email()} · ${role()} · news=${newsletter()}`,
                  );
                }}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  email.set("");
                  bio.set("");
                  role.set("dev");
                  newsletter.set(true);
                  terms.set(false);
                  submitted.set("");
                }}
              >
                Clear
              </Button>
            </Stack>
            <Text muted size="sm">
              {() => submitted() || " "}
            </Text>
          </Stack>
        </Card>

        <Card>
          <Stack gap={3}>
            <Text as="h3" size="sm" muted weight="semibold">
              Theme & density
            </Text>
            <Text muted>
              Theme: {() => theme.mode()} · Density: {() => density.density()}
            </Text>
            <Stack direction="row" gap={2} wrap>
              <Button variant="soft" onClick={() => theme.toggle()}>
                Toggle theme
              </Button>
              <Button variant="ghost" onClick={() => density.toggle()}>
                Toggle density
              </Button>
            </Stack>
          </Stack>
        </Card>

        <Card>
          <Stack gap={3}>
            <Text as="h3" size="sm" muted weight="semibold">
              Reactive props
            </Text>
            <Text>{() => `Hello, ${name()}`}</Text>
            <Stack direction="row" gap={2} wrap>
              <Button variant="ghost" onClick={() => name.set("Ada")}>
                Ada
              </Button>
              <Button variant="ghost" onClick={() => name.set("Grace")}>
                Grace
              </Button>
              <Button variant="soft" onClick={() => name.set("Katherine")}>
                Katherine
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

const router = createRouter({
  routes: [
    {
      path: "/",
      component: () => LandingPage({ router }),
    },
    { path: "/docs", component: () => DocsPage({ router }) },
    { path: "/lab", component: () => LabPage() },
    // Playground folded into System — keep redirect so old links work
    {
      path: "/playground",
      component: () => {
        queueMicrotask(() => router.navigate("/system", { replace: true }));
        return (
          <Container size="xl">
            <Text muted>Redirecting to Design system…</Text>
          </Container>
        );
      },
    },
    {
      path: "/system",
      component: () => SystemPage({ theme, density }),
    },
  ],
  notFound: () => (
    <Container size="xl">
      <Stack gap={3}>
        <Text as="h2" size="xl">
          404
        </Text>
        <Text muted>That page does not exist.</Text>
        <Link router={router} to="/">
          Go home
        </Link>
      </Stack>
    </Container>
  ),
});

function AppShell() {
  /** Shared shell gutters: landing flush sections, lab on site grid, rest padded content. */
  const mainClass = () => {
    const p = router.path();
    if (p === "/") return "site-main site-main--flush";
    if (p === "/lab") return "site-main site-main--lab";
    return "site-main";
  };

  return (
    <div class="site-root">
      {SiteNav({ router, theme })}
      <div class={mainClass}>{router.outlet()}</div>
    </div>
  );
}

const root = document.getElementById("app");
if (!root) throw new Error("#app missing");
mount(root, () => AppShell());
