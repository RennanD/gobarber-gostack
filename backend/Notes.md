# Notes for backend

## Usar classes para o Backend

- Nomeia as funcionalidade;
- Constructor: método executado sempre que a classe é instaciada;
- Métodos são como funcões;

## Exportando

- new Class() / nova instanciância, não a classe em si;

## Sucrase

```json
{
  "execMap": {
    "js": "sucrase-node"
  }
}
```

### Debug

```json
{
  "dev:debug": "nodemon --inspect src/server.js"
}
```

```json
{
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "protocol": "inspector"
    }
  ]
}
```

## Style guides para o Node Js

```bash
yarn add eslint -D
```

```js
env: {
    es6: true,
    node: true
  },
  extends: ["airbnb-base", "prettier"],
  plugins: "prettier",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    camelcase: "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }]
  }
```

-prettier
-eslint-config-prettier
-eslint-plugin-prettier

```json
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

```bash
yarn eslint --fix src --ext .js
```
