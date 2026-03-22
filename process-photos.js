const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'raw-photos', 'Professional ');
const outDir = path.join(__dirname, 'public', 'images', 'gallery');

// Create output dirs
fs.mkdirSync(path.join(outDir, 'thumbs'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'full'), { recursive: true });

async function processPhotos() {
  const files = fs.readdirSync(srcDir)
    .filter(f => f.startsWith('CS9A') && f.endsWith('.jpg') && !f.includes('('))
    .sort();

  console.log(`Found ${files.length} unique photos to process`);

  for (const file of files) {
    const src = path.join(srcDir, file);
    const name = file.replace('.jpg', '');

    try {
      // Thumbnail for grid: 600x600 square crop, quality 80
      await sharp(src)
        .resize(600, 600, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 80 })
        .toFile(path.join(outDir, 'thumbs', `${name}.jpg`));

      // Full size for lightbox: max 1600px wide, quality 85
      await sharp(src)
        .resize(1600, null, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(path.join(outDir, 'full', `${name}.jpg`));

      console.log(`  Processed: ${file}`);
    } catch (err) {
      console.error(`  Error processing ${file}:`, err.message);
    }
  }

  // List final files
  const thumbs = fs.readdirSync(path.join(outDir, 'thumbs'));
  const fulls = fs.readdirSync(path.join(outDir, 'full'));
  console.log(`\nDone! ${thumbs.length} thumbnails, ${fulls.length} full-size images`);

  // Output the file list as JSON for use in app.js
  const imageList = fulls.map(f => `/images/gallery/full/${f}`);
  console.log('\nGallery images array:');
  console.log(JSON.stringify(imageList, null, 2));
}

processPhotos().catch(console.error);
