// Sobe a aplicação em uma porta livre para os testes de integração.
const { createServer } = require("node:http");
const app = require("../src/app");

async function startServer() {
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

module.exports = { startServer };
