// Testes de integração da funcionalidade 17 pela API HTTP.
const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { startServer } = require("./helpers");

describe("API - POST /api/features/17", () => {
  let server;
  before(async () => { server = await startServer(); });
  after(async () => { await server.close(); });

  const post = (body) =>
    fetch(`${server.baseUrl}/api/features/17`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

  it("responde 200 com a lista ordenada", async () => {
    const res = await post(JSON.stringify({ valores: [8, 2, 5] }));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), {
      id: 17,
      name: "Ordenador numérico",
      result: { ordenados: [2, 5, 8], quantidade: 3 },
    });
  });

  it("aparece como implementada no catálogo", async () => {
    const res = await fetch(`${server.baseUrl}/api/features`);
    const { items } = await res.json();
    assert.equal(items.find((f) => f.id === 17).implemented, true);
  });

  it("responde 400 com mensagem clara para entrada inválida", async () => {
    const res = await post(JSON.stringify({ valores: [1, "x"] }));
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /posição 1/);
  });

  it("responde 400 para corpo sem JSON válido", async () => {
    const res = await post("{valores:");
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /JSON válido/);
  });
});
