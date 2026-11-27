// Garante que todos os módulos mantêm o contrato exigido pela API central.
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const features = require("../src/features");

describe("Contrato dos módulos", () => {
  const items = features.list();

  it("registra 40 módulos com ids únicos de 1 a 40", () => {
    assert.deepEqual(items.map((f) => f.id), Array.from({ length: 40 }, (_, i) => i + 1));
  });

  for (const item of items) {
    it(`módulo ${String(item.id).padStart(2, "0")} exporta id, name, description, implemented e execute`, () => {
      const feature = features.get(item.id);
      assert.equal(typeof feature.name, "string");
      assert.equal(typeof feature.description, "string");
      assert.equal(typeof feature.implemented, "boolean");
      assert.equal(typeof feature.execute, "function");
    });
  }
});
