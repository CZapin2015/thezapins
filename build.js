const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');
const publicDir = path.join(__dirname, 'public');

// Clean and create dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy src files to dist
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy public assets (images, etc.)
copyDir(publicDir, distDir);

// Copy src files to dist root
for (const file of fs.readdirSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
}

console.log('Build complete -> dist/');
