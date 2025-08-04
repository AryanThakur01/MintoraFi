module.exports = {
  apps: [
    {
      name: 'mintorafi', // make sure it is same in deployment.yml file too
      script: 'node dist/server.js',
      max_memory_restart: '250M',
    },
  ],
}
