/** PM2 — شغّل من جذر المشروع: pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: 'tam-backend',
      cwd: `${__dirname}/server`,
      script: 'src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
