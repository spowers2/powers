import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rewriteImportsToLab } from "./importRewrite.js";

describe("rewriteImportsToLab", () => {
  it("rewrites named imports to __lab bindings", () => {
    const out = rewriteImportsToLab(`import { createQuery, Show } from "@lab206/core";
const list = createQuery({ queryKey: () => "x", queryFn: async () => [] });
`);
    assert.match(out, /const createQuery = __lab\.createQuery/);
    assert.match(out, /const Show = __lab\.Show/);
    assert.match(out, /const list = createQuery/);
    assert.doesNotMatch(out, /import\s+\{/);
  });

  it("allows recipe local names that used to be Function params", () => {
    const out = rewriteImportsToLab(`import { createApiClient, createQuery } from "@lab206/core";
const api = createApiClient({ baseUrl: "/api" });
const list = createQuery({ queryKey: () => "items", queryFn: () => api.get("/items") });
`);
    assert.match(out, /const api = createApiClient/);
    assert.match(out, /const list = createQuery/);
    assert.match(out, /const createApiClient = __lab\.createApiClient/);
  });
});
