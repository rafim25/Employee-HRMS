import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredVars = [
  'NODE_ENV',
  'DB_HOST',
  'DB_PORT',
  'DB_USER_NAME',
  'DB_PASSWORD',
  'DB_NAME'
];

const main = () => {
  // Load production env
  const envPath = path.join(__dirname, '..', '.env.production');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.production file not found!');
    process.exit(1);
  }

  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    console.error('❌ Error loading .env.production:', result.error);
    process.exit(1);
  }

  console.log('🔍 Checking environment variables...');
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }

  console.log('✅ All required environment variables are present');
  console.log('📊 Database Configuration:');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Port: ${process.env.DB_PORT}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`Username: ${process.env.DB_USER_NAME}`);
}

main(); 