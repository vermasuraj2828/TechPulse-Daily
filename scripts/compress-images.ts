import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_SIZE_KB = 100;
const MIN_KB = 85;
const MAX_KB = 115;

const srcImagesDir = path.resolve('src/assets/images');
const publicImagesDir = path.resolve('public/images');
const publicAssetsImagesDir = path.resolve('public/assets/images');

const files = fs.readdirSync(srcImagesDir).filter((f) => f.endsWith('.jpg') || f.endsWith('.jpeg'));

console.log(`Found ${files.length} images to compress to ~${TARGET_SIZE_KB} KB...\n`);

for (const file of files) {
  const srcPath = path.join(srcImagesDir, file);
  const originalSizeKb = (fs.statSync(srcPath).size / 1024).toFixed(1);
  const tempPath = path.join('/tmp', `opt_${file}`);

  // We search for optimal (width, quality) combination to land near 100 KB
  let bestDiff = Infinity;
  let bestQuality = 75;
  let bestWidth = 960;

  // Search grid: widths from 850 to 1100, qualities from 65 to 82
  const candidateWidths = [900, 960, 1000, 1080, 1150];
  const candidateQualities = [65, 68, 70, 72, 75, 78, 80, 82];

  let bestBuffer: Buffer | null = null;

  for (const width of candidateWidths) {
    for (const quality of candidateQualities) {
      try {
        const cmd = `convert "${srcPath}" -resize ${width}x\\> -strip -interlace Plane -sampling-factor 4:2:0 -quality ${quality} "${tempPath}"`;
        execSync(cmd, { stdio: 'pipe' });
        const sizeKb = fs.statSync(tempPath).size / 1024;
        const diff = Math.abs(sizeKb - TARGET_SIZE_KB);

        if (diff < bestDiff) {
          bestDiff = diff;
          bestQuality = quality;
          bestWidth = width;
          bestBuffer = fs.readFileSync(tempPath);
        }

        // If we found something within 95KB - 105KB, that's already optimal
        if (sizeKb >= 95 && sizeKb <= 105) {
          break;
        }
      } catch (err) {
        // continue
      }
    }
  }

  if (bestBuffer) {
    // Write optimized image to src/assets/images
    fs.writeFileSync(srcPath, bestBuffer);

    // Also sync to public/images and public/assets/images
    if (fs.existsSync(publicImagesDir)) {
      fs.writeFileSync(path.join(publicImagesDir, file), bestBuffer);
    }
    if (fs.existsSync(publicAssetsImagesDir)) {
      fs.writeFileSync(path.join(publicAssetsImagesDir, file), bestBuffer);
    }

    const newSizeKb = (bestBuffer.length / 1024).toFixed(1);
    console.log(`✓ ${file}: ${originalSizeKb} KB ➔ ${newSizeKb} KB (width: ${bestWidth}px, quality: ${bestQuality}%)`);
  }
}

console.log('\nAll images compressed successfully!');
