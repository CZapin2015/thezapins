const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const distDir = path.join(__dirname, 'dist');
const srcDir = path.join(__dirname, 'src');
const publicDir = path.join(__dirname, 'public');
const version = Date.now();

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

function generateOgImage() {
  const wedding = new Date('2027-01-24T17:00:00-05:00');
  const now = new Date();
  const diff = wedding - now;
  const days = Math.floor(diff / 86400000);
  // Single centered days-only countdown box (caches well since days changes slowly)
  function countdownDays(value) {
    return `
      <rect x="540" y="390" width="120" height="86" rx="12" fill="rgba(10,22,40,0.45)" stroke="rgba(201,169,110,0.15)" stroke-width="1"/>
      <text x="600" y="440" text-anchor="middle" font-family="Georgia, serif" font-size="56" font-weight="400" fill="#c9a96e">${value}</text>
      <text x="600" y="463" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" letter-spacing="3" font-weight="500" fill="rgba(201,169,110,0.95)">DAYS</text>
    `;
  }

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#080e1c"/>
        <stop offset="30%" stop-color="#0a1224"/>
        <stop offset="50%" stop-color="#0c1628"/>
        <stop offset="75%" stop-color="#0a1020"/>
        <stop offset="100%" stop-color="#080e1c"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="40%">
        <stop offset="0%" stop-color="rgba(201,169,110,0.06)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="divider" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="transparent"/>
        <stop offset="50%" stop-color="rgba(201,169,110,0.7)"/>
        <stop offset="100%" stop-color="transparent"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#glow)"/>
    <path d="M30,85 L30,30 L85,30" fill="none" stroke="rgba(201,169,110,0.2)" stroke-width="1"/>
    <path d="M1115,30 L1170,30 L1170,85" fill="none" stroke="rgba(201,169,110,0.2)" stroke-width="1"/>
    <path d="M30,545 L30,600 L85,600" fill="none" stroke="rgba(201,169,110,0.2)" stroke-width="1"/>
    <path d="M1115,600 L1170,600 L1170,545" fill="none" stroke="rgba(201,169,110,0.2)" stroke-width="1"/>
    <text x="600" y="210" text-anchor="middle" font-family="Georgia, 'Palatino Linotype', serif" font-size="82" font-style="italic" fill="#c9a96e" letter-spacing="-1">Stephanie &amp; Corey</text>
    <rect x="570" y="240" width="60" height="1" fill="url(#divider)"/>
    <text x="600" y="290" text-anchor="middle" font-family="Georgia, 'Palatino Linotype', serif" font-size="30" fill="#e8e4dc" letter-spacing="5">January 24, 2027</text>
    <text x="600" y="325" text-anchor="middle" font-family="Georgia, 'Palatino Linotype', serif" font-size="22" font-style="italic" font-weight="300" fill="#c9a96e" letter-spacing="3">Eau Palm Beach Resort &amp; Spa</text>
    <rect x="520" y="348" width="160" height="34" rx="2" fill="none" stroke="rgba(201,169,110,0.35)" stroke-width="1"/>
    <text x="600" y="371" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="4" fill="rgba(201,169,110,0.9)">BLACK TIE</text>
    ${countdownDays(days)}
    <text x="600" y="520" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" letter-spacing="3" fill="rgba(201,169,110,0.35)">THEZAPINS.COM</text>
  </svg>`;

  // Start with venue-hero background, resize to 1200x630, darken with overlay, then composite text SVG
  const heroPath = path.join(__dirname, 'public', 'images', 'venue-hero.webp');
  const overlayBuf = Buffer.from(
    `<svg width="1200" height="630"><rect width="1200" height="630" fill="rgba(10,18,36,0.78)"/></svg>`
  );

  return sharp(heroPath)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .composite([
      { input: overlayBuf, blend: 'over' },
      { input: Buffer.from(svg), blend: 'over' },
    ])
    .jpeg({ quality: 90 })
    .toBuffer()
    .then(buf => {
      console.log(`OG image: ${days} days countdown`);
      return buf;
    });
}

async function build() {
  // Clean and create dist
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // Generate OG image into public/images before copying
  const ogBuf = await generateOgImage();
  fs.writeFileSync(path.join(publicDir, 'images', 'og-image.jpg'), ogBuf);

  // Copy public assets
  copyDir(publicDir, distDir);

  // Copy src files with cache-busting
  for (const file of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(distDir, file);
    if (file === 'index.html') {
      let html = fs.readFileSync(srcPath, 'utf8');
      html = html.replace('/styles.css"', `/styles.css?v=${version}"`);
      html = html.replace('/app.js"', `/app.js?v=${version}"`);
      // Cache-bust OG image URL so platforms fetch the updated version
      html = html.replace(/og-image\.jpg"/g, `og-image.jpg?v=${version}"`);
      fs.writeFileSync(destPath, html);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log('Build complete -> dist/');
}

build().catch(console.error);
