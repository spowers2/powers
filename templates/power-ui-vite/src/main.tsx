import { signal } from "@power-ui/core";
import { mount } from "@power-ui/dom";
import {
  Button,
  Card,
  createField,
  createTheme,
  Field,
  Input,
  installDevWarnings,
  Stack,
  Text,
  required,
  emailFormat,
  firstError,
} from "@power-ui/ui";
import "@power-ui/ui/theme.css";
import "./app.css";

installDevWarnings();

const theme = createTheme(
  typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
);
theme.bind();

const name = createField({
  validate: (v) => required(v, "Name required"),
});
const email = createField({
  validate: (v) => firstError(required(v), emailFormat(v)),
});
const status = signal("");

function App() {
  return (
    <div class="app">
      <Card>
        <Stack gap={4}>
          <Stack gap={1}>
            <Text as="h1" size="xl">
              Power UI starter
            </Text>
            <Text muted size="sm">
              Edit <code>src/main.tsx</code> — forms use{" "}
              <code>bind</code> + <code>createField</code>.
            </Text>
          </Stack>
          <Field label="Name" required error={name.error}>
            <Input bind={name.value} onBlur={name.touch} placeholder="Ada" />
          </Field>
          <Field label="Email" required error={email.error}>
            <Input
              bind={email.value}
              type="email"
              onBlur={email.touch}
              placeholder="ada@example.com"
            />
          </Field>
          <Stack direction="row" gap={2} wrap>
            <Button
              onClick={() => {
                name.touch();
                email.touch();
                if (name.error() || email.error()) {
                  status.set("Fix the fields above");
                  return;
                }
                status.set(`Hello, ${name.get()} · ${email.get()}`);
              }}
            >
              Save
            </Button>
            <Button variant="soft" onClick={() => theme.toggle()}>
              {() => (theme.mode() === "dark" ? "Light" : "Dark")}
            </Button>
          </Stack>
          <Text muted size="sm">
            {() => status() || " "}
          </Text>
        </Stack>
      </Card>
    </div>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("#root missing");
mount(root, () => <App />);
