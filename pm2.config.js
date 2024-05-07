module.exports = {
  apps: [
    {
      name: "server",
      script: "./src/server.ts",
      interpreter: "ts-node",
      watch: true, // opcional: se deseja que o PM2 assista por mudanças nos arquivos
      ignore_watch: ["node_modules"] // opcional: pastas para ignorar enquanto observa por mudanças
    }
  ]
};
