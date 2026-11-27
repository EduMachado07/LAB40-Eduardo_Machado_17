# LAB40 – Laboratório de Funcionalidades Web

Projeto-base para avaliação prática de Integração e Entrega Contínua (CI/CD).

## Requisitos
- Node.js 20 ou superior.
- npm.

## Executar localmente
```bash
npm install
npm start
```
Acesse http://localhost:3000. Para desenvolvimento com reinicialização automática: `npm run dev`.

## Endpoints
- `GET /health`: verificação de disponibilidade.
- `GET /api/features`: lista as 40 funcionalidades e seus estados.
- `POST /api/features/:id`: executa uma funcionalidade, recebendo JSON no corpo.

Exemplo:
```bash
curl -X POST http://localhost:3000/api/features/1 -H "Content-Type: application/json" -d '{"valor":200,"percentual":15}'
```

## Estrutura
```text
lab40/
├── public/
├── src/
│   ├── app.js
│   ├── server.js
│   └── features/
├── package.json
└── package-lock.json
```

## Contrato de cada módulo
Cada arquivo `src/features/featureNN.js` exporta `id`, `name`, `description`, `implemented` e `execute(input)`.

1. Implemente `execute(input)`.
2. Valide os dados recebidos.
3. Retorne um objeto serializável em JSON.
4. Trate entradas inválidas lançando `Error` com mensagem clara.
5. Depois de implementar e validar, altere `implemented` para `true`.
6. Não altere o contrato dos outros módulos nem a API central sem autorização.

Enquanto `implemented` for `false`, a API retorna HTTP 501 para aquele módulo.

## Importante
Este repositório é entregue intencionalmente sem testes automatizados, análise estática, workflow de CI, build ou configuração de deploy. O estudante deverá criar e justificar esses elementos durante a avaliação.

O servidor escuta `process.env.PORT` e `0.0.0.0`, e a aplicação não persiste dados em disco.

## Funcionalidade implementada
**17 – Ordenador numérico**: recebe `{ "valores": [8, 2, 5] }` e retorna `{ "ordenados": [2, 5, 8], "quantidade": 3 }`.

Regras de validação (respondem HTTP 400 com mensagem clara):
- a entrada deve ser um objeto com o campo `valores`;
- `valores` deve ser uma lista com 1 a 10000 itens;
- cada item deve ser um número finito (texto, `null`, booleano, `NaN` e `Infinity` são recusados).

A ordenação usa comparação numérica (`a - b`), para que `10` venha depois de `2`, e não altera a lista recebida.

## Qualidade e testes
```bash
npm run lint            # análise estática (ESLint)
npm test                # testes unitários e de integração (node:test)
npm run test:coverage   # testes com cobertura mínima de 90% (linhas e ramos)
```
- `tests/feature17.test.js`: testes unitários da funcionalidade 17.
- `tests/feature17.api.test.js`: testes de integração da funcionalidade 17 pela API HTTP.
- `tests/api.test.js`: testes das rotas centrais (`/health`, catálogo, 404, 405, 501, limite de corpo).
- `tests/contract.test.js`: garante que os 40 módulos mantêm o contrato.

Os testes usam o executor nativo do Node.js (`node:test`), sem dependências extras.

## CI/CD (GitHub Actions)
**CI** (`.github/workflows/ci.yml`): roda em todo Pull Request para a `main` e em cada push na `main`.
1. Análise estática com ESLint.
2. Testes no Node.js 20 e 22; no 22, com cobertura e relatório `lcov` publicado como artefato.
3. Build de produção (`npm ci --omit=dev`) e teste de fumaça com o servidor real (`/health` e `/api/features/17`).

**CD** (`.github/workflows/cd.yml`): roda somente depois que o CI da `main` termina com sucesso após um push (merge do PR).
1. Faz checkout exatamente do commit aprovado no CI.
2. Gera o pacote `lab40-vX.Y.Z-build.N.tar.gz` com o checksum SHA-256.
3. Valida o pacote com instalação limpa e teste de fumaça.
4. Publica uma Release no GitHub com o pacote anexado.

Não foi usado Docker: a aplicação não tem dependências de produção nem banco de dados, então o pacote com Node.js já basta para a entrega.
