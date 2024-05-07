module.exports = {
  apps: [
    {
      name: 'My Application',
      script: 'src/server.ts',
      interpreter: 'ts-node',
      interpreter_args: '-r tsconfig-paths/register',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
