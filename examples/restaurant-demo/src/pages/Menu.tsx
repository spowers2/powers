import { signal } from "@power-ux/core";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  Drawer,
  Empty,
  Field,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  firstError,
  required,
  type ToastController,
  asSelectBind,
} from "@power-ux/ui";
import { PageHeader } from "../components/uiBits.js";
import { PHOTOS } from "../data/images.js";
import {
  menu,
  upsertMenuItem,
  removeMenuItem,
  toggleMenuAvailable,
  formatMoney,
  CATEGORY_LABELS,
} from "../data/store.js";
import type { MenuCategory, MenuItem } from "../data/types.js";

const CATEGORY_OPTS = (
  Object.entries(CATEGORY_LABELS) as [MenuCategory, string][]
).map(([value, label]) => ({ value, label }));

const FILTER_OPTS = [
  { value: "all", label: "All categories" },
  ...CATEGORY_OPTS,
];

const IMAGE_OPTS = [
  { value: PHOTOS.pasta, label: "Pasta" },
  { value: PHOTOS.salad, label: "Salad" },
  { value: PHOTOS.steak, label: "Steak" },
  { value: PHOTOS.fish, label: "Fish" },
  { value: PHOTOS.pizza, label: "Pizza" },
  { value: PHOTOS.dessert, label: "Dessert" },
  { value: PHOTOS.cocktail, label: "Cocktail" },
  { value: PHOTOS.soup, label: "Soup" },
  { value: PHOTOS.bread, label: "Bread" },
  { value: PHOTOS.brunch, label: "Brunch" },
];

export function MenuPage(props: { toaster: ToastController }) {
  const { toaster } = props;
  const filter = signal("");
  const categoryFilter = signal("all");
  const drawerOpen = signal(false);
  const confirmOpen = signal(false);
  const editingId = signal<string | null>(null);

  const name = signal("");
  const description = signal("");
  const price = signal("18");
  const category = signal<MenuCategory>("mains");
  const imageUrl = signal(PHOTOS.pasta);
  const available = signal(true);
  const popular = signal(false);
  const touched = signal(false);

  const nameErr = () =>
    !touched() ? "" : firstError(required(name(), "Name required"));

  const openNew = () => {
    editingId.set(null);
    name.set("");
    description.set("");
    price.set("18");
    category.set("mains");
    imageUrl.set(PHOTOS.pasta);
    available.set(true);
    popular.set(false);
    touched.set(false);
    drawerOpen.set(true);
  };

  const openEdit = (item: MenuItem) => {
    editingId.set(item.id);
    name.set(item.name);
    description.set(item.description);
    price.set(String(item.price));
    category.set(item.category);
    imageUrl.set(item.imageUrl);
    available.set(item.available);
    popular.set(item.popular);
    touched.set(false);
    drawerOpen.set(true);
  };

  const save = () => {
    touched.set(true);
    if (nameErr()) {
      toaster.push({ title: "Fix the form", tone: "danger" });
      return;
    }
    upsertMenuItem({
      id: editingId() ?? undefined,
      name: name().trim(),
      description: description().trim(),
      price: Math.max(0, Math.round(Number(price()) || 0)),
      category: category(),
      imageUrl: imageUrl(),
      available: available(),
      popular: popular(),
    });
    drawerOpen.set(false);
    toaster.push({
      title: editingId() ? "Dish updated" : "Dish added",
      description: name().trim(),
      tone: "success",
    });
  };

  const confirmDelete = () => {
    const id = editingId();
    if (!id) return;
    const label = name().trim();
    removeMenuItem(id);
    confirmOpen.set(false);
    drawerOpen.set(false);
    toaster.push({ title: "Dish removed", description: label, tone: "info" });
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="Menu"
        subtitle="Plates, prices, and 86’d items — with Unsplash food photography."
        actions={
          <Button size="sm" onClick={openNew}>
            Add dish
          </Button>
        }
      />

      <Card>
        <Stack gap={3}>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 12rem" }}>
              <Field label="Search">
                <Input
                  placeholder="Name or description…"
                  bind={filter}
                />
              </Field>
            </div>
            <div style={{ flex: "0 1 10rem" }}>
              <Field label="Category">
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
                  title={q || cf !== "all" ? "No matches" : "Menu is empty"}
                  description="Add a dish to populate the floor menu."
                >
                  <Button size="sm" onClick={openNew}>
                    Add dish
                  </Button>
                </Empty>
              );
            }

            const frag = document.createDocumentFragment();
            for (const item of list) {
              const card = document.createElement("div");
              card.className =
                "menu-row" + (item.available ? "" : " is-unavailable");

              const img = document.createElement("button");
              img.type = "button";
              img.className = "menu-row__img";
              img.style.backgroundImage = `url(${item.imageUrl})`;
              img.setAttribute("aria-label", `Edit ${item.name}`);
              img.onclick = () => openEdit(item);

              const main = document.createElement("button");
              main.type = "button";
              main.className = "menu-row__main";
              main.onclick = () => openEdit(item);
              const title = document.createElement("div");
              title.className = "menu-row__title";
              title.textContent = item.name;
              const meta = document.createElement("div");
              meta.className = "menu-row__meta";
              meta.textContent = `${CATEGORY_LABELS[item.category]}${item.popular ? " · popular" : ""}${item.available ? "" : " · 86’d"}`;
              const desc = document.createElement("div");
              desc.className = "menu-row__desc";
              desc.textContent = item.description;
              main.append(title, meta, desc);

              const side = document.createElement("div");
              side.className = "menu-row__side";
              const priceEl = document.createElement("div");
              priceEl.className = "menu-row__price";
              priceEl.textContent = formatMoney(item.price);
              const toggle = document.createElement("button");
              toggle.type = "button";
              toggle.className = "row-action";
              toggle.textContent = item.available ? "86" : "Restore";
              toggle.onclick = (e) => {
                e.stopPropagation();
                toggleMenuAvailable(item.id);
                toaster.push({
                  title: item.available ? "86’d" : "Back on menu",
                  description: item.name,
                  tone: "info",
                });
              };
              side.append(priceEl, toggle);

              card.append(img, main, side);
              frag.appendChild(card);
            }
            return frag;
          }}
        </Stack>
      </Card>

      <Drawer
        open={drawerOpen}
        onClose={() => drawerOpen.set(false)}
        title="Dish"
        side="right"
      >
        <Stack gap={4}>
          <Field label="Name" required error={nameErr}>
            <Input
              bind={name}
              onBlur={() => touched.set(true)}
              placeholder="Hand-cut tagliatelle"
            />
          </Field>
          <Field label="Description">
            <Textarea
              rows={3}
              bind={description}
              placeholder="Brown butter, sage…"
            />
          </Field>
          <Stack direction="row" gap={2} wrap>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Price (USD)">
                <Input
                  type="number"
                  bind={price}
                />
              </Field>
            </div>
            <div style={{ flex: "1 1 8rem" }}>
              <Field label="Category">
                <Select
                  bind={asSelectBind(category)}
                  options={CATEGORY_OPTS}
                />
              </Field>
            </div>
          </Stack>
          <Field label="Photo (Unsplash)">
            <Select
              bind={imageUrl}
              options={IMAGE_OPTS}
            />
          </Field>
          {() => (
            <div
              class="dish-preview"
              style={{ backgroundImage: `url(${imageUrl()})` }}
              role="img"
              aria-label="Dish preview"
            />
          )}
          <Checkbox
            checked={available}
            onChange={(v) => available.set(v)}
            label="Available tonight"
          />
          <Checkbox
            checked={popular}
            onChange={(v) => popular.set(v)}
            label="Featured / popular"
          />
          <Stack direction="row" gap={2} wrap>
            <Button onClick={save}>Save</Button>
            {() =>
              editingId()
                ? Button({
                    variant: "danger",
                    children: "Delete…",
                    onClick: () => confirmOpen.set(true),
                  })
                : null
            }
            <Button variant="ghost" onClick={() => drawerOpen.set(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      <Dialog
        open={confirmOpen}
        onClose={() => confirmOpen.set(false)}
        title="Remove dish?"
        description="Guests won’t see it on the floor menu."
        size="sm"
      >
        <Stack direction="row" gap={2} justify="end">
          <Button variant="ghost" onClick={() => confirmOpen.set(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Stack>
      </Dialog>
    </Stack>
  );
}
