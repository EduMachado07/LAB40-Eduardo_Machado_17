// Testes unitários da funcionalidade 17 (Ordenador numérico).
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const feature17 = require("../src/features/feature17");

describe("Funcionalidade 17 - Ordenador numérico", () => {
  describe("contrato", () => {
    it("exporta id 17, nome e implemented = true", () => {
      assert.equal(feature17.id, 17);
      assert.equal(feature17.name, "Ordenador numérico");
      assert.equal(feature17.implemented, true);
    });
  });

  describe("ordenação", () => {
    it("ordena o exemplo do enunciado [8, 2, 5]", () => {
      assert.deepEqual(feature17.execute({ valores: [8, 2, 5] }), { ordenados: [2, 5, 8], quantidade: 3 });
    });

    it("ordena numericamente e não como texto (10 depois de 2)", () => {
      assert.deepEqual(feature17.execute({ valores: [10, 2, 1, 100] }).ordenados, [1, 2, 10, 100]);
    });

    it("ordena negativos, zero e decimais", () => {
      assert.deepEqual(feature17.execute({ valores: [3.5, -1, 0, -7.25, 2] }).ordenados, [-7.25, -1, 0, 2, 3.5]);
    });

    it("mantém valores repetidos", () => {
      assert.deepEqual(feature17.execute({ valores: [4, 1, 4, 1] }).ordenados, [1, 1, 4, 4]);
    });

    it("aceita lista com um único número", () => {
      assert.deepEqual(feature17.execute({ valores: [42] }), { ordenados: [42], quantidade: 1 });
    });

    it("mantém uma lista já ordenada", () => {
      assert.deepEqual(feature17.execute({ valores: [1, 2, 3] }).ordenados, [1, 2, 3]);
    });

    it("não altera a lista original recebida", () => {
      const valores = [3, 1, 2];
      feature17.execute({ valores });
      assert.deepEqual(valores, [3, 1, 2]);
    });

    it("aceita o limite máximo de 10000 itens", () => {
      const valores = Array.from({ length: 10000 }, (_, i) => 10000 - i);
      const { ordenados, quantidade } = feature17.execute({ valores });
      assert.equal(quantidade, 10000);
      assert.equal(ordenados[0], 1);
      assert.equal(ordenados[9999], 10000);
    });
  });

  describe("validação de entrada", () => {
    const casosInvalidos = [
      ["entrada nula", null, /objeto/],
      ["entrada como lista", [1, 2], /objeto/],
      ["entrada como texto", "8,2,5", /objeto/],
      ["sem o campo valores", {}, /obrigatório/],
      ["valores não é lista", { valores: "8,2,5" }, /obrigatório/],
      ["lista vazia", { valores: [] }, /pelo menos um/],
      ["item texto", { valores: [1, "2", 3] }, /posição 1/],
      ["item nulo", { valores: [null] }, /posição 0/],
      ["item booleano", { valores: [1, true] }, /posição 1/],
      ["item NaN", { valores: [1, NaN] }, /posição 1/],
      ["item infinito", { valores: [Infinity, 1] }, /posição 0/],
      ["mais de 10000 itens", { valores: new Array(10001).fill(1) }, /no máximo 10000/],
    ];

    for (const [descricao, entrada, mensagem] of casosInvalidos) {
      it(`rejeita ${descricao}`, () => {
        assert.throws(() => feature17.execute(entrada), { name: "Error", message: mensagem });
      });
    }
  });
});
