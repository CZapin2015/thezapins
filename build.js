const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');
const publicDir = path.join(__dirname, 'public');
const version = Date.now();

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

// Copy src files to dist root, adding cache-busting to HTML
for (const file of fs.readdirSync(srcDir)) {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(distDir, file);
  if (file === 'index.html') {
    let html = fs.readFileSync(srcPath, 'utf8');
    html = html.replace('/styles.css"', `/styles.css?v=${version}"`);
    html = html.replace('/app.js"', `/app.js?v=${version}"`);
    fs.writeFileSync(destPath, html);
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
}

console.log('Build complete -> dist/');
