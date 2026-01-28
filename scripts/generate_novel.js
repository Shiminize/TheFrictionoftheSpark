const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

// Config: Point to the location of the source content files relative to this script
const contentDir = path.join(__dirname, '../Content');
const enPath = path.join(contentDir, 'the_structual_integrity_of_walls');
const cnPath = path.join(contentDir, 'the_structual_integrity_of_walls_CN');

// Config: Output path
const outputPath = path.join(__dirname, '../src/features/reader/data.js');

// Helper to parse content file
function parseContent(filePath, langCode) {
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: Content file not found: ${filePath}`);
        return [];
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const chapters = [];

    // Regex matches: "Chapter X: Title\nNative Title (Optional)\nContent..."
    let regex;
    if (langCode === 'en') {
        regex = /(Chapter \d+|Epilogue|Post-Mortem|Abstract)(?:: (.*?))?\n(.*?)(?=\n(?:Chapter \d+|Epilogue|Post-Mortem|Abstract)|$)/gs;
    } else {
        // Localized files: English Header\nLocalized Header\nContent
        // Note: The regex handles standard double-newline separation for body
        regex = /(Chapter \d+|Epilogue|Post-Mortem|Abstract)(?:: (.*?))?\n(.*?)\n(.*?)(?=\n(?:Chapter \d+|Epilogue|Post-Mortem|Abstract)|$)/gs;
    }

    let match;
    let chapterCounter = 1;

    while ((match = regex.exec(content)) !== null) {
        const chapterLabel = match[1];
        const enTitle = match[2] ? match[2].trim() : chapterLabel;
        let localTitle = enTitle;
        let body = '';

        if (langCode === 'en') {
            body = match[3].trim();
        } else {
            localTitle = match[3].trim();
            body = match[4].trim();
        }

        let chapterNum = chapterCounter;
        if (chapterLabel.startsWith('Chapter')) {
            chapterNum = parseInt(chapterLabel.split(' ')[1]);
        } else if (chapterLabel === 'Post-Mortem') {
            chapterNum = 8;
        } else if (chapterLabel === 'Abstract') {
            chapterNum = 0.5;
        } else {
            chapterNum = 9;
        }

        const formattedBody = body
            .split('\n\n')
            .map(p => {
                const trimmed = p.trim();
                if (!trimmed) return '';
                return `<p>${trimmed.replace(/\n/g, ' ')}</p>`;
            })
            .filter(p => p)
            .join('\n');

        chapters.push({
            chapter: chapterNum,
            title: localTitle,
            content: formattedBody
        });
        chapterCounter++;
    }
    return chapters;
}

const enChapters = parseContent(enPath, 'en');
const cnChapters = parseContent(cnPath, 'cn');

// Merge
const finalChapters = [];

// Cover entry
const coverEntry = {
    chapter: 0,
    title: "COVER",
    title_cn: "封面",
    title_id: "SAMPUL",
    title_ru: "ОБЛОЖКА",
    content: `<img src="src/assets/images/TheStructuralIntegrityofWalls.png" class="cover-img" alt="Book Cover">`,
    content_cn: `<img src="src/assets/images/TheStructuralIntegrityofWalls.png" class="cover-img" alt="Book Cover">`,
    content_id: `<img src="src/assets/images/TheStructuralIntegrityofWalls.png" class="cover-img" alt="Book Cover">`,
    content_ru: `<img src="src/assets/images/TheStructuralIntegrityofWalls.png" class="cover-img" alt="Book Cover">`
};
finalChapters.push(coverEntry);

// Merge: Base on English chapters
enChapters.forEach(enChap => {
    const cnChap = cnChapters.find(c => c.chapter === enChap.chapter);

    // Fallbacks
    const title_cn = cnChap ? cnChap.title : enChap.title;
    const content_cn = cnChap ? cnChap.content : "Translation pending...";

    finalChapters.push({
        chapter: enChap.chapter,
        title: enChap.title,
        content: enChap.content,

        // Localized fields
        title_cn: title_cn,
        content_cn: content_cn,

        // Placeholders for others
        title_id: enChap.title,
        content_id: enChap.content,
        title_ru: enChap.title,
        content_ru: enChap.content
    });
});

const jsonContent = JSON.stringify(finalChapters);
const encrypted = CryptoJS.AES.encrypt(jsonContent, 'lieverd').toString();
const output = `PocketReader.encryptedContent = "${encrypted}";`;

fs.writeFileSync(outputPath, output);

console.log(`Successfully regenerated data.js with ${finalChapters.length} entries. Merged languages: EN, CN.`);
