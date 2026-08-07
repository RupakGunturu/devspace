const fs = require('fs');
const https = require('https');
const path = require('path');

const FONTS_DIR = path.join(__dirname, 'public', 'fonts');

// Font configurations
const SITE_FONTS = [
  { name: 'Inter', weights: [400, 500, 600] },
  { name: 'JetBrains Mono', weights: [400, 500, 700] },
  { name: 'Bricolage Grotesque', weights: [400, 500, 600, 700, 800] },
];

const TYPOGRAPHY_FONTS = [
  { name: 'Playfair Display', weights: [700] },
  { name: 'Source Sans Pro', weights: [400, 600] },
  { name: 'Fredoka One', weights: [400] },
  { name: 'Nunito', weights: [400, 600] },
  { name: 'Space Grotesque', weights: [700] },
  { name: 'Cormorant Garamond', weights: [700] },
  { name: 'Lato', weights: [400, 700] },
  { name: 'IBM Plex Sans', weights: [600] },
  { name: 'IBM Plex Mono', weights: [400] },
  { name: 'Archivo Black', weights: [400] },
  { name: 'Roboto', weights: [400, 500] },
];

function downloadFont(fontName, weight) {
  return new Promise((resolve, reject) => {
    const fileName = `${fontName.toLowerCase().replace(/\s+/g, '-')}-${weight}.woff2`;
    const filePath = path.join(FONTS_DIR, fileName);
    
    // Google Fonts API URL for WOFF2
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@${weight}&display=swap`;
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let css = '';
      res.on('data', (chunk) => css += chunk);
      res.on('end', () => {
        // Extract WOFF2 URL from CSS
        const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
        if (match) {
          const woff2Url = match[1];
          https.get(woff2Url, (woff2Res) => {
            const fileStream = fs.createWriteStream(filePath);
            woff2Res.pipe(fileStream);
            fileStream.on('finish', () => {
              console.log(`Downloaded: ${fileName}`);
              resolve({ fileName, family: fontName, weight });
            });
          }).on('error', reject);
        } else {
          console.log(`Could not find WOFF2 URL for ${fontName} weight ${weight}`);
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function downloadAllFonts() {
  console.log('Downloading site fonts...');
  for (const font of SITE_FONTS) {
    for (const weight of font.weights) {
      await downloadFont(font.name, weight);
    }
  }
  
  console.log('\nDownloading typography tool fonts...');
  for (const font of TYPOGRAPHY_FONTS) {
    for (const weight of font.weights) {
      await downloadFont(font.name, weight);
    }
  }
  
  console.log('\nDone! All fonts downloaded.');
}

downloadAllFonts().catch(console.error);
