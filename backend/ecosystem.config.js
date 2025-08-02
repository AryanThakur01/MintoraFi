module.exports = {
  apps: [
    {
      script: 'node dist/server.js',
      max_memory_restart: '300M',
    },
  ],
}
