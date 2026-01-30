const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const images = [
    '/Users/decepticonmanager/Book Reader/src/assets/images/The Friction of the Spark.png',
    '/Users/decepticonmanager/Book Reader/src/assets/images/The Friction of the Spark.png-last scene.png'
];

const destDir = '/Users/decepticonmanager/Book Reader/Content/TheFrictionOfTheSpark/images';
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

images.forEach(src => {
    const filename = path.basename(src);
    const dest = path.join(destDir, filename);

    // Convert to high-quality JPEG to reduce size significantly while keeping visual quality
    // Since user said "without reducing visual size", they often mean dimensions.
    // PNGs are huge. JPEG 85% is a safely standard optimization for photos/art.
    // If transparent, we'd need PNG, but "The Friction of the Spark" sounds like a cover (opaque).
    // Let's assume opaque for cover and scene.

    // Using sips to convert to jpeg with 80% quality.
    // Also keeping same dimensions.

    // We will rename to .jpg for better browser handling if we convert.
    const destJpg = dest.replace('.png', '.jpg');

    try {
        console.log(`Optimizing ${filename}...`);
        // sips -s format jpeg -s formatOptions 80
        execSync(`sips -s format jpeg -s formatOptions 80 "${src}" --out "${destJpg}"`);
        console.log(`Saved to ${destJpg}`);

        const oldSize = fs.statSync(src).size / 1024 / 1024;
        const newSize = fs.statSync(destJpg).size / 1024 / 1024;
        console.log(`Size reduced from ${oldSize.toFixed(2)}MB to ${newSize.toFixed(2)}MB`);
    } catch (e) {
        console.error(`Failed to optimize ${filename}:`, e);
    }
});
