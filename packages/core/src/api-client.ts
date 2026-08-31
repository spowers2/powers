/**
 * Tiny JSON HTTP helper for Powers apps — pair with `resource` / `createQuery`.
 * Not a cache layer and not OpenAPI; just baseUrl + headers + verbs.
 */

export type ApiClientOptions = {
  /** Origin + prefix, e.g. `https://api.example.com` or `/api`. */
  baseUrl: string | (() => string);
  /** Merged into every request (auth, Accept, etc.). */
  getHeaders?: () => HeadersInit | Promise<HeadersInit>;
  /** Override for tests. Defaults to global `fetch`. */
  fetch?: typeof fetch;
};

export type ApiRequestOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: unknown;
  /** When false, skip JSON parse and return Response. Default true for data helpers. */
  json?: boolean;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export type ApiClient = {
  /** Low-level: path is joined to baseUrl; body object → JSON. */
  request: (path: string, options?: ApiRequestOptions) => Promise<Response>;
  get: <T = unknown>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) => Promise<T>;
  post: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) => Promise<T>;
  put: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) => Promise<T>;
  patch: <T = unknown>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">) => Promise<T>;
  delete: <T = unknown>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) => Promise<T>;
};

function joinUrl(base: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!b) return p;
  return `${b}${p}`;
}

function headersToRecord(h?: HeadersInit): Record<string, string> {
  if (!h) return {};
  if (h instanceof Headers) {
    const out: Record<string, string> = {};
    h.forEach((v, k) => {
      out[k] = v;
    });
    return out;
  }
  if (Array.isArray(h)) {
    const out: Record<string, string> = {};
    for (const [k, v] of h) out[k] = v;
    return out;
  }
  return { ...h };
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/**
 * Create a small JSON API client for use with `resource` / `createQuery`.
 *
 * @example
 * ```ts
 * const api = createApiClient({
 *   baseUrl: "/api",
 *   getHeaders: () => ({ Authorization: `Bearer ${token()}` }),
 * });
 * const users = createQuery({
 *   queryKey: () => "users",
 *   queryFn: () => api.get<User[]>("/users"),
 * });
 * ```
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
  const doFetch = options.fetch ?? fetch;

  const request = async (
    path: string,
    req: ApiRequestOptions = {},
  ): Promise<Response> => {
    const base =
      typeof options.baseUrl === "function" ? options.baseUrl() : options.baseUrl;
    const url = joinUrl(base, path);
    const extra = options.getHeaders ? await options.getHeaders() : undefined;
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...headersToRecord(extra),
      ...headersToRecord(req.headers),
    };

    const init: RequestInit = {
      method: req.method ?? "GET",
      headers,
    };
    if (req.signal !== undefined) init.signal = req.signal;
    if (req.body !== undefined && req.body !== null) {
      if (
        typeof req.body === "string" ||
        req.body instanceof FormData ||
        req.body instanceof Blob ||
        req.body instanceof ArrayBuffer ||
        ArrayBuffer.isView(req.body)
      ) {
        init.body = req.body as BodyInit;
      } else {
        headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
        init.headers = headers;
        init.body = JSON.stringify(req.body);
      }
    }

    return doFetch(url, init);
  };

  const parse = async <T>(res: Response): Promise<T> => {
    const data = await readBody(res);
    if (!res.ok) {
      throw new ApiError(res.status, data);
    }
    return data as T;
  };

  return {
    request,
    get: async (path, opts) => parse(await request(path, { ...opts, method: "GET" })),
    post: async (path, body, opts) =>
      parse(await request(path, { ...opts, method: "POST", body })),
    put: async (path, body, opts) =>
      parse(await request(path, { ...opts, method: "PUT", body })),
    patch: async (path, body, opts) =>
      parse(await request(path, { ...opts, method: "PATCH", body })),
    delete: async (path, opts) =>
      parse(await request(path, { ...opts, method: "DELETE" })),
  };
}
