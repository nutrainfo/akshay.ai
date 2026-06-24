/**
 * Generates PWA icons (192×192 and 512×512) as PNGs using Canvas.
 * Run once: node assets/icons/generate-icons.js
 * Requires Node ≥18 (no external deps).
 *
 * In production use a tool like sharp, Jimp, or Figma export for higher quality icons.
 */
const { createCanvas } = (() => {
  try { return require('canvas'); }
  catch { return null; }
})() || {};

const fs = require('fs');
const path = require('path');

function generateSVGIcon(size) {
  /* Inline SVG that browsers and OS can render — used as the icon source */
  const r = size * 0.25; // border-radius
  const arrowStart = size * 0.2;
  const arrowEnd = size * 0.8;
  const sw = size * 0.08;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <clipPath id="clip">
      <rect width="${size}" height="${size}" rx="${r}" ry="${r}"/>
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#g)"/>
  <g clip-path="url(#clip)">
    <polyline points="${arrowStart},${size*0.6} ${size*0.38},${size*0.35} ${size*0.56},${size*0.5} ${arrowEnd},${size*0.22}"
      fill="none" stroke="white" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${arrowEnd}" cy="${size*0.22}" r="${sw}" fill="white"/>
  </g>
</svg>`;
}

const outDir = path.join(__dirname);
[192, 512].forEach(size => {
  const svgContent = generateSVGIcon(size);
  const svgPath = path.join(outDir, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Generated icon-${size}.svg (convert to PNG for production)`);
});

console.log('\n📌 To convert SVGs to PNGs:');
console.log('   npx sharp-cli -i assets/icons/icon-192.svg -o assets/icons/icon-192.png');
console.log('   npx sharp-cli -i assets/icons/icon-512.svg -o assets/icons/icon-512.png');
console.log('\n   Or use: https://cloudconvert.com/svg-to-png');
