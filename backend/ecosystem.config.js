module.exports = {
  apps: [
    {
      script: 'node dist/server.js', // or backend/dist/server.js or server.js — depends on your structure
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '300M',
      node_args: '--max-old-space-size=4096',
    },
  ],
}
