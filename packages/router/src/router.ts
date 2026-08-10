import {
  createRoot,
  effect,
  signal,
  type Dispose,
  type Signal,
} from "@power-ui/core";
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  type HistoryAdapter,
  type HistoryMode,
  type RouterLocation,
} from "./history.js";
import { matchPath, normalizePath, type Params } from "./match.js";

export type RouteComponent = (props: {
  params: Params;
  location: RouterLocation;
}) => Node | DocumentFragment | null | undefined;

export interface RouteDefinition {
  /** Path pattern: `/`, `/about`, `/users/:id` */
  path: string;
  component: RouteComponent;
}

export interface RouterOptions {
  routes: RouteDefinition[];
  /** `history` (default in browser), `hash`, or `memory` (tests / SSR) */
  mode?: HistoryMode;
  /** Initial path for memory mode */
  initialPath?: string;
  history?: HistoryAdapter;
  notFound?: RouteComponent;
}

export interface Router {
  readonly location: Signal<RouterLocation>;
  readonly params: Signal<Params>;
  readonly path: Signal<string>;
  navigate(to: string, options?: { replace?: boolean }): void;
  /** Render the matched route. Call once inside `mount`. */
  outlet(): Node;
  dispose: Dispose;
}

/**
 * Create a tiny signal-based router.
 *
 * @example
 * ```tsx
 * const router = createRouter({
 *   routes: [
 *     { path: "/", component: () => <Home /> },
 *     { path: "/about", component: () => <About /> },
 *     { path: "/users/:id", component: ({ params }) => <User id={params.id} /> },
 *   ],
 * });
 * mount(app, () => <div>{router.outlet()}</div>);
 * ```
 */
export function createRouter(options: RouterOptions): Router {
  const mode =
    options.mode ??
    (typeof window !== "undefined" ? "history" : "memory");

  const history: HistoryAdapter =
    options.history ??
    (mode === "hash"
      ? createHashHistory()
      : mode === "memory"
        ? createMemoryHistory(options.initialPath ?? "/")
        : createBrowserHistory());

  const params = signal<Params>({});
  const path = signal(history.matchPath());

  const stopListen = history.listen();
  const stopSync = effect(() => {
    history.location();
    path.set(history.matchPath());
  });

  let outletStop: Dispose | undefined;
  let childDispose: Dispose | undefined;
  let childNode: Node | undefined;

  function navigate(to: string, navOpts?: { replace?: boolean }) {
    history.navigate(to, navOpts);
  }

  function resolve(): { component: RouteComponent; params: Params } {
    const current = history.matchPath();
    for (const route of options.routes) {
      const m = matchPath(route.path, current);
      if (m) {
        return { component: route.component, params: m.params };
      }
    }
    return {
      component:
        options.notFound ??
        (() => {
          const el = document.createElement("div");
          el.textContent = "Not found";
          return el;
        }),
      params: {},
    };
  }

  function outlet(): Node {
    const host = document.createElement("div");
    host.setAttribute("data-power-router-outlet", "");
    host.style.display = "contents";

    outletStop = effect(() => {
      path(); // re-run on navigation
      const resolved = resolve();
      params.set(resolved.params);

      childDispose?.();
      childDispose = undefined;
      if (childNode) {
        childNode.parentNode?.removeChild(childNode);
        childNode = undefined;
      }

      createRoot((d) => {
        childDispose = d;
        const result = resolved.component({
          params: resolved.params,
          location: history.location(),
        });
        if (result != null) {
          childNode = result;
          host.appendChild(result);
        }
      });
    });

    return host;
  }

  function dispose() {
    outletStop?.();
    childDispose?.();
    stopSync();
    stopListen();
  }

  return {
    location: history.location,
    params,
    path,
    navigate,
    outlet,
    dispose,
  };
}

/** Build a path with params, e.g. `/users/:id` + `{ id: "1" }` → `/users/1` */
export function buildPath(pattern: string, params: Params = {}): string {
  let result = pattern;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, encodeURIComponent(value));
  }
  return normalizePath(result);
}
