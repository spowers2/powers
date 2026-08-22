/**
 * Contact form — posts to /contact.php on the live host (cPanel PHP).
 * No mailto / default mail app.
 */
import { signal } from "@powers/core";
import type { Router } from "@powers/router";
import {
  Alert,
  Button,
  Card,
  Container,
  Field,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@powers/ui";
import { SITE } from "./siteConfig.js";

const SUBJECTS = [
  { value: "General", label: "General" },
  { value: "Commercial license", label: "Commercial license" },
  { value: "Support", label: "Support" },
  { value: "Other", label: "Other" },
];

type Status = "idle" | "sending" | "ok" | "error";

export function ContactPage(_props: { router: Router }) {
  const name = signal("");
  const email = signal("");
  const subject = signal("General");
  const message = signal("");
  /** Honeypot — leave empty; bots often fill it */
  const companyWebsite = signal("");
  const status = signal<Status>("idle");
  const errorMsg = signal("");

  const nameError = () => {
    const n = name().trim();
    if (!n) return "Name is required";
    return "";
  };
  const emailError = () => {
    const e = email().trim();
    if (!e) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "Enter a valid email";
    return "";
  };
  const messageError = () => {
    if (!message().trim()) return "Message is required";
    return "";
  };

  async function onSubmit(e: Event) {
    e.preventDefault();
    if (nameError() || emailError() || messageError()) {
      status.set("error");
      errorMsg.set("Please fix the fields above.");
      return;
    }
    if (companyWebsite().trim()) {
      // Silent success for bots
      status.set("ok");
      return;
    }

    status.set("sending");
    errorMsg.set("");

    const body = new FormData();
    body.set("name", name().trim());
    body.set("email", email().trim());
    body.set("subject", subject());
    body.set("message", message().trim());
    body.set("company_website", companyWebsite());

    try {
      const base = import.meta.env.BASE_URL || "/";
      const endpoint =
        (base.endsWith("/") ? base : `${base}/`) + "contact.php";
      const res = await fetch(endpoint, { method: "POST", body });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        status.set("error");
        errorMsg.set(
          data?.error ||
            (import.meta.env.DEV
              ? "Local dev has no PHP mailer — deploy to lab206.com to send, or check contact.php on the host."
              : "Something went wrong sending your message. Please try again."),
        );
        return;
      }

      status.set("ok");
      name.set("");
      email.set("");
      subject.set("General");
      message.set("");
    } catch {
      status.set("error");
      errorMsg.set(
        import.meta.env.DEV
          ? "Local dev has no PHP mailer — deploy to lab206.com to send."
          : "Network error. Please try again in a moment.",
      );
    }
  }

  return (
    <Container size="md">
      <Stack gap={6}>
        <Stack gap={2}>
          <Text as="h1" size="2xl">
            Contact
          </Text>
          <Text muted>
            Questions about {SITE.systemName}, licensing, or lab206? Send a
            message — it goes to{" "}
            <strong>{SITE.contact.email}</strong>. For public bugs you can also
            open a{" "}
            <a
              class="docs-inline-link"
              href={SITE.contact.githubIssues}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub issue
            </a>
            .
          </Text>
        </Stack>

        {() =>
          status() === "ok" ? (
            <Alert tone="success" title="Message sent">
              Thanks — we’ll get back to you at the email you provided.
            </Alert>
          ) : null
        }

        {() =>
          status() === "error" && errorMsg() ? (
            <Alert tone="danger" title="Couldn’t send">
              {() => errorMsg()}
            </Alert>
          ) : null
        }

        <Card>
          <form class="contact-form" onSubmit={onSubmit}>
            <Stack gap={4}>
              <Field label="Name" required error={nameError}>
                <Input
                  bind={name}
                  autocomplete="name"
                  disabled={() => status() === "sending"}
                />
              </Field>

              <Field label="Email" required error={emailError}>
                <Input
                  type="email"
                  bind={email}
                  autocomplete="email"
                  disabled={() => status() === "sending"}
                />
              </Field>

              <Field label="Subject">
                <Select
                  bind={subject}
                  options={SUBJECTS}
                  disabled={() => status() === "sending"}
                />
              </Field>

              <Field label="Message" required error={messageError}>
                <Textarea
                  bind={message}
                  rows={6}
                  disabled={() => status() === "sending"}
                />
              </Field>

              {/* Honeypot — hidden from people */}
              <div class="contact-honeypot" aria-hidden="true">
                <label>
                  Company website
                  <input
                    type="text"
                    name="company_website"
                    autocomplete="off"
                    tabIndex={-1}
                    value={companyWebsite}
                    onInput={(e: Event) =>
                      companyWebsite.set((e.target as HTMLInputElement).value)
                    }
                  />
                </label>
              </div>

              <Stack direction="row" gap={2} align="center">
                <Button
                  type="submit"
                  disabled={() => status() === "sending"}
                >
                  {() => (status() === "sending" ? "Sending…" : "Send message")}
                </Button>
                <Text size="sm" muted>
                  We don’t sell or share your info.
                </Text>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Stack>
    </Container>
  );
}
