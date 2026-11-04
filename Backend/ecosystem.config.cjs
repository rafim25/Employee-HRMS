/**
 * PM2 process file for AWS (local MariaDB on same host).
 *
 * First-time setup on the server:
 *   1. sudo mysql < scripts/createMariaDbUser.sql   (edit password first)
 *   2. cp .env.production.example .env.production && nano .env.production
 *   3. npm ci
 *   4. NODE_ENV=production npm run db:setup
 *   5. pm2 start ecosystem.config.cjs   # name: hrms-backend
 *      OR if already running: pm2 restart hrms-backend --update-env
 *   6. pm2 save && pm2 startup
 *
 * After git pull:
 *   git pull && npm ci && pm2 restart hrms-backend --update-env
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
      env: {
        NODE_ENV: "production",
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
