import {
  Badge,
  Button,
  Card,
  Stack,
  Text,
  type ToastController,
} from "@lab206/ui";
import type { Router } from "@lab206/router";
import { PHOTOS, PHOTO_CREDIT, setPhotoBackground } from "../data/images.js";
import {
  profile,
  popularMenu,
  formatMoney,
  CATEGORY_LABELS,
} from "../data/store.js";

/** Public-facing landing for diners (not ops). */
export function GuestHomePage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router } = props;

  return (
    <Stack gap={6}>
      <section class="hero hero--guest">
        <div
          class="hero__media"
          role="img"
          aria-label="Restaurant dining room"
          ref={(el: HTMLElement) => setPhotoBackground(el, PHOTOS.hero)}
        />
        <div class="hero__shade" aria-hidden="true" />
        <div class="hero__content">
          <Badge tone="accent">Reservations · walk-ins welcome</Badge>
          <Text as="h1" size="2xl" class="hero__title">
            {() => profile().name}
          </Text>
          <Text class="hero__lede">{() => profile().tagline}</Text>
          <Text size="sm" class="hero__meta">
            {() => profile().address}
            <br />
            {() => profile().hours}
            <br />
            {() => profile().phone}
          </Text>
          <Stack direction="row" gap={2} wrap>
            <Button size="sm" onClick={() => router.navigate("/visit/book")}>
              Book a table
            </Button>
            <Button
              size="sm"
              variant="soft"
              onClick={() => router.navigate("/visit/menu")}
            >
              See the menu
            </Button>
          </Stack>
        </div>
      </section>

      <Card>
        <Stack gap={3}>
          <Text weight="semibold">How booking works</Text>
          <div class="guest-steps">
            <div class="guest-step">
              <div class="guest-step__n">Step 1</div>
              <Text size="sm" weight="semibold">
                Pick a time
              </Text>
              <Text size="sm" muted>
                Party size, date, and time.
              </Text>
            </div>
            <div class="guest-step">
              <div class="guest-step__n">Step 2</div>
              <Text size="sm" weight="semibold">
                Prefer a spot (optional)
              </Text>
              <Text size="sm" muted>
                Window, patio, bar — or a specific table.
              </Text>
            </div>
            <div class="guest-step">
              <div class="guest-step__n">Step 3</div>
              <Text size="sm" weight="semibold">
                We seat you
              </Text>
              <Text size="sm" muted>
                Staff honors your preference when they can.
              </Text>
            </div>
          </div>
          <Button size="sm" onClick={() => router.navigate("/visit/book")}>
            Start a reservation
          </Button>
        </Stack>
      </Card>

      <Stack gap={3}>
        <Text weight="semibold" size="lg">
          Tonight’s favorites
        </Text>
        <Text muted size="sm">
          A taste of the board — full menu next.
        </Text>
        <div class="dish-grid">
          {() => {
            const list = popularMenu().slice(0, 4);
            if (list.length === 0) {
              return (
                <Text muted size="sm">
                  Menu coming soon.
                </Text>
              );
            }
            const frag = document.createDocumentFragment();
            for (const dish of list) {
              const card = document.createElement("button");
              card.type = "button";
              card.className = "dish-card";
              card.onclick = () => router.navigate("/visit/menu");
              const img = document.createElement("div");
              img.className = "dish-card__img";
              setPhotoBackground(img, dish.imageUrl);
              const body = document.createElement("div");
              body.className = "dish-card__body";
              const title = document.createElement("div");
              title.className = "dish-card__title";
              title.textContent = dish.name;
              const desc = document.createElement("div");
              desc.className = "dish-card__desc";
              desc.textContent = dish.description;
              const price = document.createElement("div");
              price.className = "dish-card__price";
              price.textContent = formatMoney(dish.price);
              body.append(title, desc, price);
              card.append(img, body);
              frag.appendChild(card);
            }
            return frag;
          }}
        </div>
      </Stack>

      <GridLike />

      <Card>
        <Stack gap={3}>
          <Text weight="semibold">Visit us</Text>
          <Text muted size="sm">
            {() => profile().address} · {() => profile().hours}
          </Text>
          <Text muted size="sm">
            Call {() => profile().phone} for same-day questions. Online booking
            holds a table in our book (demo — local only).
          </Text>
          <Stack direction="row" gap={2} wrap>
            <Button onClick={() => router.navigate("/visit/book")}>
              Reserve
            </Button>
            <Button variant="ghost" onClick={() => router.navigate("/visit/menu")}>
              Full menu
            </Button>
          </Stack>
          <Text size="xs" muted>
            {PHOTO_CREDIT}
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}

function GridLike() {
  return (
    <div class="guest-info-grid">
      <Card>
        <Stack gap={2}>
          <Text weight="semibold" size="sm">
            Categories
          </Text>
          <Text muted size="sm">
            {Object.values(CATEGORY_LABELS).join(" · ")}
          </Text>
        </Stack>
      </Card>
      <Card>
        <Stack gap={2}>
          <Text weight="semibold" size="sm">
            Good to know
          </Text>
          <Text muted size="sm">
            Dietary notes welcome when you book. Kitchen is open-fire — plates
            arrive as they finish.
          </Text>
        </Stack>
      </Card>
    </div>
  );
}
