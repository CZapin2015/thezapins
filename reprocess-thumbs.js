const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'raw-photos', 'Professional ');
const thumbDir = path.join(__dirname, 'public', 'images', 'gallery', 'thumbs');

// All unique photos - no crop, just resize to max 800px wide
const files = fs.readdirSync(srcDir)
  .filter(f => f.startsWith('CS9A') && f.endsWith('.jpg') && !f.includes('('))
  .sort();

async function reprocess() {
  for (const file of files) {
    const name = file.replace('.jpg', '');
    const src = path.join(srcDir, file);

    // No crop - resize to max 800px wide, maintain original aspect ratio
    await sharp(src)
      .resize(800, null, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toFile(path.join(thumbDir, file));

    process.stdout.write('.');
  }
  console.log(`\nDone! Processed ${files.length} thumbnails (no crop)`);
}

reprocess().catch(console.error);
