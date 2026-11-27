// Funcionalidade 17: Ordenador numérico.
// Objetivo: Ordena números em ordem crescente.
// Exemplo de entrada: { valores: [8, 2, 5] }
// Implemente conforme as regras e critérios do enunciado fornecido pelo professor.

const implemented = true;

// Limite de itens para evitar processamento excessivo em uma única requisição.
const MAX_ITENS = 10000;

// Valida a entrada e ordena os valores em ordem crescente, sem alterar a lista original.
function execute(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("A entrada deve ser um objeto no formato { valores: [números] }.");
  }

  const { valores } = input;

  if (!Array.isArray(valores)) {
    throw new Error("O campo 'valores' é obrigatório e deve ser uma lista de números.");
  }
  if (valores.length === 0) {
    throw new Error("A lista 'valores' deve conter pelo menos um número.");
  }
  if (valores.length > MAX_ITENS) {
    throw new Error(`A lista 'valores' aceita no máximo ${MAX_ITENS} números.`);
  }

  valores.forEach((valor, indice) => {
    if (typeof valor !== "number" || !Number.isFinite(valor)) {
      throw new Error(`O item na posição ${indice} não é um número válido.`);
    }
  });

  // Comparação numérica: sort() sem comparador ordenaria como texto (10 antes de 2).
  const ordenados = [...valores].sort((a, b) => a - b);

  return { ordenados, quantidade: ordenados.length };
}

// Mantém o contrato de integração utilizado pela API central.
module.exports = {
  id: 17,
  name: "Ordenador numérico",
  description: "Ordena números em ordem crescente.",
  implemented,
  execute
};
