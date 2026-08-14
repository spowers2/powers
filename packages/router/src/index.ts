/**
 * @powers/router
 *
 * Learn in 2 minutes:
 *   createRouter({ routes }) → router.outlet() + router.navigate() + <Link />
 */

export { createRouter, buildPath, parseSearch } from "./router.js";
export type {
  Router,
  RouterOptions,
  RouteDefinition,
  RouteComponent,
} from "./router.js";

export { Link } from "./link.js";
export type { LinkProps } from "./link.js";

export {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from "./history.js";
export type {
  HistoryAdapter,
  HistoryMode,
  RouterLocation,
} from "./history.js";

export { matchPath, normalizePath, joinPaths } from "./match.js";
export type { Params, MatchResult } from "./match.js";
