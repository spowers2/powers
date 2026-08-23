import { signal, type Signal } from "@lab206/core";
import { normalizePath } from "./match.js";

export type HistoryMode = "history" | "hash" | "memory";

export interface RouterLocation {
  /** Pathname only, e.g. `/users/1` */
  pathname: string;
  /** Query string including `?`, or empty */
  search: string;
  /** Hash including `#`, or empty (when not using hash mode for routing) */
  hash: string;
  /** Full path used for matching (pathname + search in history mode) */
  path: string;
}

export interface HistoryAdapter {
  readonly location: Signal<RouterLocation>;
  navigate(to: string, options?: { replace?: boolean }): void;
  listen(): () => void;
  /** Current path used for route matching */
  matchPath(): string;
}

function parseUrl(url: string): RouterLocation {
  // Support path-only or full relative URLs
  const fake =
    url.startsWith("http") || url.startsWith("//")
      ? url
      : `http://local.invalid${url.startsWith("/") ? "" : "/"}${url}`;
  let u: URL;
  try {
    u = new URL(fake);
  } catch {
    return { pathname: "/", search: "", hash: "", path: "/" };
  }
  const pathname = normalizePath(u.pathname);
  return {
    pathname,
    search: u.search,
    hash: u.hash,
    path: pathname + u.search,
  };
}

export function createBrowserHistory(): HistoryAdapter {
  const location = signal(readBrowser());

  function readBrowser(): RouterLocation {
    if (typeof window === "undefined") {
      return { pathname: "/", search: "", hash: "", path: "/" };
    }
    return parseUrl(
      window.location.pathname + window.location.search + window.location.hash,
    );
  }

  return {
    location,
    matchPath: () => location().pathname,
    navigate(to, options) {
      // Resolve against origin so path-only targets clear search + hash.
      const url = new URL(to.startsWith("/") ? to : `/${to}`, window.location.origin);
      const next = url.pathname + url.search + url.hash;
      if (options?.replace) {
        window.history.replaceState(null, "", next);
      } else if (
        next !==
        window.location.pathname + window.location.search + window.location.hash
      ) {
        window.history.pushState(null, "", next);
      } else {
        // Same full URL (e.g. brand click while already home) — still notify.
        window.history.replaceState(null, "", next);
      }
      location.set(readBrowser());
    },
    listen() {
      const onPop = () => location.set(readBrowser());
      window.addEventListener("popstate", onPop);
      return () => window.removeEventListener("popstate", onPop);
    },
  };
}

export function createHashHistory(): HistoryAdapter {
  const location = signal(readHash());

  function readHash(): RouterLocation {
    if (typeof window === "undefined") {
      return { pathname: "/", search: "", hash: "", path: "/" };
    }
    const raw = window.location.hash.replace(/^#/, "") || "/";
    const loc = parseUrl(raw.startsWith("/") ? raw : `/${raw}`);
    return loc;
  }

  return {
    location,
    matchPath: () => location().pathname,
    navigate(to, options) {
      const path = to.startsWith("/") ? to : `/${to}`;
      const hash = `#${path}`;
      if (options?.replace) {
        window.history.replaceState(null, "", hash);
      } else {
        window.location.hash = path;
      }
      location.set(readHash());
    },
    listen() {
      const onHash = () => location.set(readHash());
      window.addEventListener("hashchange", onHash);
      return () => window.removeEventListener("hashchange", onHash);
    },
  };
}

export function createMemoryHistory(initial = "/"): HistoryAdapter {
  let stack = [normalizePath(initial)];
  let index = 0;
  const location = signal(parseUrl(stack[0]!));

  return {
    location,
    matchPath: () => location().pathname,
    navigate(to, options) {
      const path = normalizePath(to.split("?")[0] ?? to);
      const search = to.includes("?") ? `?${to.split("?")[1]}` : "";
      const full = path + search;
      if (options?.replace) {
        stack[index] = full;
      } else {
        stack = stack.slice(0, index + 1);
        stack.push(full);
        index = stack.length - 1;
      }
      location.set(parseUrl(full));
    },
    listen() {
      return () => {};
    },
  };
}
