import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const galleryDir = path.join(__dirname, '../public/gallery');
const backupDir = path.join(galleryDir, 'backup');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Get all files in the gallery directory
const files = fs.readdirSync(galleryDir);

// Filter WhatsApp images
const whatsappImages = files.filter(file => 
  file.startsWith('WhatsApp Image') && 
  file.endsWith('.jpeg') &&
  !file.includes('backup')
);

// Sort files by date and time
whatsappImages.sort();

// Rename files with incremental counter
whatsappImages.forEach((file, index) => {
  const oldPath = path.join(galleryDir, file);
  const newFileName = `gallery_${(index + 1).toString().padStart(3, '0')}.jpg`;
  const newPath = path.join(galleryDir, newFileName);
  
  // Create backup
  fs.copyFileSync(oldPath, path.join(backupDir, file));
  
  // Rename file
  fs.renameSync(oldPath, newPath);
  console.log(`Renamed: ${file} -> ${newFileName}`);
});

console.log('Image renaming completed. Backups are stored in the backup directory.'); 