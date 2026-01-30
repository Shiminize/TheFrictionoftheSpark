const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcDir = '/Users/decepticonmanager/Book Reader/Content/TheFrictionOfTheSpark/images';
const images = [
    'cover.png',
    'last_scene.png'
];

if (!fs.existsSync(srcDir)) {
    console.error('Source directory not found:', srcDir);
    process.exit(1);
}

images.forEach(filename => {
    const src = path.join(srcDir, filename);
    const destJpg = src.replace('.png', '.jpg');

    if (fs.existsSync(src)) {
        try {
            console.log(`Optimizing ${filename}...`);
            // Convert to JPEG with 85% quality to keep visual quality high but reduce size
            execSync(`sips -s format jpeg -s formatOptions 85 "${src}" --out "${destJpg}"`);

            const oldSize = fs.statSync(src).size / 1024 / 1024;
            const newSize = fs.statSync(destJpg).size / 1024 / 1024;
            console.log(`Saved to ${destJpg}`);
            console.log(`Size reduced from ${oldSize.toFixed(2)}MB to ${newSize.toFixed(2)}MB`);

            // Remove the old png? No, keep it as backup or for source, but repo will use jpg.
            // Actually, better to remove the big pngs from repo to save space if committed.
            // But I will just use jpg in code.

        } catch (e) {
            console.error(`Failed to optimize ${filename}:`, e);
        }
    } else {
        console.warn(`File not found: ${src}`);
    }
});
