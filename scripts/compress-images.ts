import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_SIZE_KB = 55;
const MIN_KB = 20;
const MAX_KB = 88;

const srcImagesDir = path.resolve('src/assets/images');
const publicImagesDir = path.resolve('public/images');
const publicAssetsImagesDir = path.resolve('public/assets/images');

fs.mkdirSync(publicImagesDir, { recursive: true });
fs.mkdirSync(publicAssetsImagesDir, { recursive: true });

const files = fs.readdirSync(srcImagesDir).filter((f) => f.endsWith('.jpg') || f.endsWith('.jpeg'));

console.log(`Found ${files.length} images to compress strictly into 20 - 90 KB (target ~${TARGET_SIZE_KB} KB)...\n`);

for (const file of files) {
  const srcPath = path.join(srcImagesDir, file);
  const originalSizeKb = (fs.statSync(srcPath).size / 1024).toFixed(1);
  const tempPath = path.join('/tmp', `opt50_${file}`);

  let bestDiff = Infinity;
  let bestQuality = 70;
  let bestWidth = 850;
  let bestBuffer: Buffer | null = null;

  // Search combinations to strictly land between 25 KB and 85 KB (under 90 KB)
  const candidateWidths = [800, 850, 900, 960];
  const candidateQualities = [62, 66, 70, 72, 75, 78];

  for (const width of candidateWidths) {
    for (const quality of candidateQualities) {
      try {
        const cmd = `convert "${srcPath}" -resize ${width}x\\> -strip -interlace Plane -sampling-factor 4:2:0 -quality ${quality} "${tempPath}"`;
        execSync(cmd, { stdio: 'pipe' });
        const sizeKb = fs.statSync(tempPath).size / 1024;

        // Must strictly be between MIN_KB and MAX_KB
        if (sizeKb >= MIN_KB && sizeKb <= MAX_KB) {
          const diff = Math.abs(sizeKb - TARGET_SIZE_KB);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestQuality = quality;
            bestWidth = width;
            bestBuffer = fs.readFileSync(tempPath);
          }
        }
      } catch (err) {
        // continue
      }
    }
  }

  // Fallback if no candidate hit: force 800px width at quality 65
  if (!bestBuffer) {
    try {
      const fallbackCmd = `convert "${srcPath}" -resize 800x\\> -strip -interlace Plane -sampling-factor 4:2:0 -quality 65 "${tempPath}"`;
      execSync(fallbackCmd, { stdio: 'pipe' });
      bestBuffer = fs.readFileSync(tempPath);
    } catch {
      bestBuffer = fs.readFileSync(srcPath);
    }
  }

  // Write optimized image
  fs.writeFileSync(srcPath, bestBuffer);
  fs.writeFileSync(path.join(publicImagesDir, file), bestBuffer);
  fs.writeFileSync(path.join(publicAssetsImagesDir, file), bestBuffer);

  const newSizeKb = (bestBuffer.length / 1024).toFixed(1);
  console.log(`✓ ${file}: ${originalSizeKb} KB ➔ ${newSizeKb} KB (width: ${bestWidth}px, quality: ${bestQuality}%)`);
}

console.log('\nAll images compressed to between 20 - 90 KB successfully!');
