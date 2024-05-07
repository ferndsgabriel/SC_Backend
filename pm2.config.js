module.exports = {
  apps: [
    {
      name: 'My Application',
      script: './src/server.ts',
      interpreter: 'ts-node', 
      env_qa: {
        PORT: 3333,
        NODE_ENV: 'production',
      },
      env_production: {
        PORT: 3333,
        NODE_ENV: 'production',
      },
    },
  ],
};
