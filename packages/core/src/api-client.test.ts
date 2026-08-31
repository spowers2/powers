import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ApiError, createApiClient } from "./api-client.js";

describe("createApiClient", () => {
  it("joins baseUrl and path", async () => {
    const calls: string[] = [];
    const api = createApiClient({
      baseUrl: "https://api.example.com/v1/",
      fetch: async (input) => {
        calls.push(String(input));
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    });
    await api.get("/users");
    assert.equal(calls[0], "https://api.example.com/v1/users");
  });

  it("merges getHeaders and request headers", async () => {
    let seen: HeadersInit | undefined;
    const api = createApiClient({
      baseUrl: "/api",
      getHeaders: () => ({ Authorization: "Bearer t" }),
      fetch: async (_input, init) => {
        seen = init?.headers;
        return new Response("{}", { status: 200 });
      },
    });
    await api.get("/x", { headers: { "X-Trace": "1" } });
    const h = seen as Record<string, string>;
    assert.equal(h.Authorization, "Bearer t");
    assert.equal(h["X-Trace"], "1");
    assert.equal(h.Accept, "application/json");
  });

  it("POSTs JSON body", async () => {
    let method = "";
    let body = "";
    const api = createApiClient({
      baseUrl: "",
      fetch: async (_input, init) => {
        method = init?.method ?? "";
        body = String(init?.body ?? "");
        return new Response(JSON.stringify({ id: 1 }), { status: 201 });
      },
    });
    const out = await api.post<{ id: number }>("/items", { name: "Ada" });
    assert.equal(method, "POST");
    assert.equal(body, JSON.stringify({ name: "Ada" }));
    assert.equal(out.id, 1);
  });

  it("throws ApiError on !ok", async () => {
    const api = createApiClient({
      baseUrl: "/api",
      fetch: async () =>
        new Response(JSON.stringify({ error: "nope" }), { status: 403 }),
    });
    await assert.rejects(
      () => api.get("/secret"),
      (err: unknown) => {
        assert.ok(err instanceof ApiError);
        assert.equal(err.status, 403);
        assert.deepEqual(err.body, { error: "nope" });
        return true;
      },
    );
  });

  it("supports reactive baseUrl function", async () => {
    let base = "https://a.test";
    const calls: string[] = [];
    const api = createApiClient({
      baseUrl: () => base,
      fetch: async (input) => {
        calls.push(String(input));
        return new Response("{}", { status: 200 });
      },
    });
    await api.get("/x");
    base = "https://b.test";
    await api.get("/x");
    assert.deepEqual(calls, ["https://a.test/x", "https://b.test/x"]);
  });
});
