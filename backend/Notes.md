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
