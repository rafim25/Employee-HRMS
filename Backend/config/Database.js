import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables if not already loaded
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({
  path: path.join(__dirname, '..', envFile),
});

// Database configuration (MySQL / MariaDB — same dialect)
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER_NAME;
const dbPassword = process.env.DB_PASSWORD ?? '';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbSsl = process.env.DB_SSL === 'true';

if (!dbName || !dbUser) {
  console.error(
    `❌ Missing DB_NAME / DB_USER_NAME. Create Backend/${envFile} (see .env.production.example for AWS MariaDB).`
  );
}

console.log(
  `🗄️  DB config → host=${dbHost}:${dbPort} db=${dbName || '(missing)'} user=${dbUser || '(missing)'} ssl=${dbSsl}`
);

const database = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  // Recreate connections that MariaDB closed after wait_timeout
  retry: {
    max: 3,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 10000,
  },
  dialectOptions: {
    connectTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    // Local MariaDB on EC2: DB_SSL=false. Railway/RDS often need true.
    ...(dbSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  },
});

const testConnection = async () => {
  try {
    await database.authenticate();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error(
      '   Hint: For local MariaDB use DB_HOST=127.0.0.1 and DB_SSL=false (not Railway).'
    );
    throw error;
  }
};

export { database as default, testConnection };
