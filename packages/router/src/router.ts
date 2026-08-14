import {
  createRoot,
  effect,
  signal,
  untrack,
  type Dispose,
  type Signal,
} from "@powers/core";
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
  /** Pathname only (for matching). */
  readonly path: Signal<string>;
  /** Query string including `?`, or `""`. */
  readonly search: Signal<string>;
  /**
   * Reactive URLSearchParams for the current location.
   * Call inside effects / JSX accessors so updates re-run.
   */
  searchParams(): URLSearchParams;
  /** Read one query key (reactive when called in a reactive scope). */
  query(name: string): string | null;
  navigate(to: string, options?: { replace?: boolean }): void;
  /** Render the matched route. Call **once** per app (not per route). */
  outlet(): Node;
  dispose: Dispose;
}

/** Parse `?a=1&b=2` or `a=1` into URLSearchParams (non-reactive). */
export function parseSearch(search: string): URLSearchParams {
  const q = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(q);
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
  const search = signal(history.location().search);

  const stopListen = history.listen();
  const stopSync = effect(() => {
    const loc = history.location();
    path.set(loc.pathname);
    search.set(loc.search);
  });

  let outletStop: Dispose | undefined;
  let childDispose: Dispose | undefined;
  let childNode: Node | undefined;
  let outletCallCount = 0;
  /**
   * Last outlet key (pathname + search). Same path+query skips remount;
   * query-only changes remount so list pages can seed filters from the URL.
   */
  let renderedKey: string | undefined;

  function navigate(to: string, navOpts?: { replace?: boolean }) {
    history.navigate(to, navOpts);
  }

  function resolve(
    current: string,
  ): { component: RouteComponent; params: Params } {
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
    outletCallCount += 1;
    if (outletCallCount > 1) {
      const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } })
        .process?.env?.NODE_ENV;
      if (env !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          "[Powers] router.outlet() was called more than once. " +
            "Call it once per app and reuse the node (e.g. const outlet = router.outlet()). " +
            "Two outlets fight over the same route effects.",
        );
      }
    }

    const host = document.createElement("div");
    host.setAttribute("data-power-router-outlet", "");
    host.style.display = "contents";

    outletStop = effect(() => {
      // Track pathname + query for deep links (e.g. /invoices?status=overdue).
      const current = path();
      const q = search();
      const key = current + q;
      if (renderedKey === key && childNode) {
        const resolved = untrack(() => resolve(current));
        untrack(() => {
          params.set(resolved.params);
        });
        return;
      }
      renderedKey = key;

      const resolved = untrack(() => resolve(current));
      untrack(() => {
        params.set(resolved.params);
      });

      childDispose?.();
      childDispose = undefined;
      if (childNode) {
        childNode.parentNode?.removeChild(childNode);
        childNode = undefined;
      }

      // createRoot clears active tracking node so component setup signal
      // reads (e.g. Input reading value={email}) do NOT re-bind this effect.
      createRoot((d) => {
        childDispose = d;
        const loc = untrack(() => history.location());
        const result = resolved.component({
          params: resolved.params,
          location: loc,
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

  function searchParams(): URLSearchParams {
    return parseSearch(search());
  }

  function query(name: string): string | null {
    return searchParams().get(name);
  }

  return {
    location: history.location,
    params,
    path,
    search,
    searchParams,
    query,
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
