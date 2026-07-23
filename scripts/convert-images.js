const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcDir = path.join(__dirname, '..', 'public', 'images');
const files = [
  { src: 'flower.webp', dest: 'flower.jpg' },
  { src: 'plants.webp', dest: 'plants.jpg' },
];

async function convert() {dd 
  for (const f of files) {
    const srcPath = path.join(srcDir, f.src);
    const destPath = path.join(srcDir, f.dest);
    
    if (!fs.existsSync(srcPath)) {
      console.error(`Source not found: ${srcPath}`);
      continue;
    }

    await sharp(srcPath)
      .jpeg({ quality: 90 })
      .toFile(destPath);
    
    const srcSize = fs.statSync(srcPath).size;
    const destSize = fs.statSync(destPath).size;
    console.log(`✓ ${f.src} → ${f.dest} (${(srcSize/1024).toFixed(1)}KB → ${(destSize/1024).toFixed(1)}KB)`);
  }
  console.log('Done!');
}

convert().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
