import { Window } from "happy-dom";

/** Install a happy-dom window as the global document/window for tests. */
export function installDom(): { window: Window; document: Document } {
  const window = new Window({ url: "https://localhost/" });
  const document = window.document as unknown as Document;

  const g = globalThis as unknown as Record<string, unknown>;
  g.window = window;
  g.document = document;
  g.Node = window.Node;
  g.HTMLElement = window.HTMLElement;
  g.Text = window.Text;
  g.Element = window.Element;

  return { window, document };
}
