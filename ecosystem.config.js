module.exports = {
  apps: [
    {
      name: 'Server 1',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'production',
        PORT: 4000, // Atur port untuk Server 1
      },
      namespace: 'Server 1', // Menentukan namespace untuk instance ini
    },
    {
      name: 'Server 2',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'production',
        PORT: 4001, // Atur port yang berbeda untuk Server 2
      },
      namespace: 'Server 2', // Menentukan namespace untuk instance ini
    },
  ],
};
