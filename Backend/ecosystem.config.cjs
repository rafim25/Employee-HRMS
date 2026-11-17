/**
 * PM2 process file for AWS (local MariaDB on same host).
 *
 * Start / reload:
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 reload ecosystem.config.cjs --env production --update-env
 *
 * First-time DB:
 *   cp .env.production.example .env.production && nano .env.production
 *   sudo mysql < scripts/createMariaDbUser.sql
 *   NODE_ENV=production npm run db:setup
 *
 * After git pull:
 *   git pull && npm ci && pm2 reload ecosystem.config.cjs --env production --update-env
 *
 * App loads secrets from Backend/.env.production when NODE_ENV=production.
 */
module.exports = {
  apps: [
    {
      name: "hrms-backend",
      script: "index.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "512M",
      // default (pm2 start without --env)
      env: {
        NODE_ENV: "production",
        APP_PORT: 3002,
      },
      // used by: pm2 start ecosystem.config.cjs --env production
      env_production: {
        NODE_ENV: "production",
        APP_PORT: 3002,
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
