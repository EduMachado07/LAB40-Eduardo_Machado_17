// Configuração da análise estática (ESLint, formato flat config).
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  { ignores: ["node_modules/", "coverage/", "dist/"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "tests/**/*.js", "eslint.config.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    files: ["public/**/*.js"],
    languageOptions: { sourceType: "script", globals: globals.browser },
  },
];
