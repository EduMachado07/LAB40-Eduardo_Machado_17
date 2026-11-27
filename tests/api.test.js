// Testes de integração da API central (rotas comuns a todos os módulos).
const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { startServer } = require("./helpers");

describe("API central do LAB40", () => {
  let server;
  before(async () => { server = await startServer(); });
  after(async () => { await server.close(); });

  it("GET /health responde 200 com status ok", async () => {
    const res = await fetch(`${server.baseUrl}/health`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: "ok", application: "LAB40" });
  });

  it("GET /api/features lista as 40 funcionalidades", async () => {
    const res = await fetch(`${server.baseUrl}/api/features`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.total, 40);
    assert.equal(body.items.length, 40);
    for (const item of body.items) {
      assert.deepEqual(Object.keys(item).sort(), ["description", "id", "implemented", "name"]);
    }
  });

  it("POST para funcionalidade inexistente responde 404", async () => {
    const res = await fetch(`${server.baseUrl}/api/features/99`, { method: "POST", body: "{}" });
    assert.equal(res.status, 404);
  });

  it("funcionalidade ainda não implementada responde 501", async () => {
    const { items } = await (await fetch(`${server.baseUrl}/api/features`)).json();
    const pendente = items.find((f) => !f.implemented);
    const res = await fetch(`${server.baseUrl}/api/features/${pendente.id}`, { method: "POST", body: "{}" });
    assert.equal(res.status, 501);
  });

  it("corpo maior que 100 KB é recusado e a conexão é encerrada", async () => {
    const body = JSON.stringify({ valores: new Array(30000).fill(12345) });
    await assert.rejects(fetch(`${server.baseUrl}/api/features/17`, { method: "POST", body }));
  });

  it("método não permitido responde 405", async () => {
    const res = await fetch(`${server.baseUrl}/health`, { method: "DELETE" });
    assert.equal(res.status, 405);
  });

  it("GET / entrega a interface HTML", async () => {
    const res = await fetch(`${server.baseUrl}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
  });

  it("arquivo estático inexistente responde 404", async () => {
    const res = await fetch(`${server.baseUrl}/nao-existe.html`);
    assert.equal(res.status, 404);
  });
});
