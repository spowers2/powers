import { signal } from "@powers/core";
import {
  Button,
  Card,
  Empty,
  Field,
  Input,
  Select,
  Stack,
  Text,
  type ToastController,
} from "@powers/ui";
import type { Router } from "@powers/router";
import { PageHeader } from "../components/uiBits.js";
import {
  menu,
  formatMoney,
  CATEGORY_LABELS,
} from "../data/store.js";
import type { MenuCategory } from "../data/types.js";

const FILTER_OPTS = [
  { value: "all", label: "All courses" },
  ...(Object.entries(CATEGORY_LABELS) as [MenuCategory, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

/** Guest menu — browse only (no 86 / edit). */
export function GuestMenuPage(props: {
  router: Router;
  toaster: ToastController;
}) {
  const { router } = props;
  const filter = signal("");
  const categoryFilter = signal("all");

  return (
    <Stack gap={6}>
      <PageHeader
        title="Menu"
        subtitle="What’s on tonight — prices include service demo fees."
        actions={
          <Button size="sm" onClick={() => router.navigate("/visit/book")}>
            Book a table
          </Button>
        }
      />

      <Card>
        <Stack gap={3}>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 12rem" }}>
              <Field label="Search">
                <Input
                  placeholder="Dish name…"
                  bind={filter}
                />
              </Field>
            </div>
            <div style={{ flex: "0 1 10rem" }}>
              <Field label="Course">
                <Select
                  bind={categoryFilter}
                  options={FILTER_OPTS}
                />
              </Field>
            </div>
          </Stack>

          {() => {
            const q = filter().trim().toLowerCase();
            const cf = categoryFilter();
            const list = menu().filter((m) => {
              if (!m.available) return false;
              if (cf !== "all" && m.category !== cf) return false;
              if (!q) return true;
              return (
                m.name.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q)
              );
            });

            if (list.length === 0) {
              return (
                <Empty
                  icon="◉"
                  title="Nothing matches"
                  description="Try another search or course."
                />
              );
            }

            const frag = document.createDocumentFragment();
            for (const item of list) {
              const row = document.createElement("div");
              row.className = "menu-row";
              const img = document.createElement("div");
              img.className = "menu-row__img";
              img.style.backgroundImage = `url(${item.imageUrl})`;
              img.style.cursor = "default";
              const main = document.createElement("div");
              main.className = "menu-row__main";
              main.style.cursor = "default";
              const title = document.createElement("div");
              title.className = "menu-row__title";
              title.textContent = item.name;
              const meta = document.createElement("div");
              meta.className = "menu-row__meta";
              meta.textContent =
                CATEGORY_LABELS[item.category] +
                (item.popular ? " · favorite" : "");
              const desc = document.createElement("div");
              desc.className = "menu-row__desc";
              desc.textContent = item.description;
              main.append(title, meta, desc);
              const side = document.createElement("div");
              side.className = "menu-row__side";
              const price = document.createElement("div");
              price.className = "menu-row__price";
              price.textContent = formatMoney(item.price);
              side.append(price);
              row.append(img, main, side);
              frag.appendChild(row);
            }
            return frag;
          }}
        </Stack>
      </Card>

      <Text muted size="sm">
        86’d items are hidden from this guest view. Ops can manage the full menu
        in the staff app.
      </Text>
    </Stack>
  );
}
