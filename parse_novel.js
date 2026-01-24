const fs = require('fs');
const path = require('path');

const filePath = '/Users/decepticonmanager/Book Reader/Content/The Audacity of Silence.txt';
const content = fs.readFileSync(filePath, 'utf8');

const chapters = [];
// Updated regex to properly capture title and content
const chapterRegex = /Ch (\d+): (.*?)\n(.*?)(?=\nCh \d+:|$)/gs;

// Cover entry
chapters.push({
    chapter: 0,
    title: "COVER",
    title_cn: "封面",
    content: `<img src="src/assets/images/cover.jpg" class="cover-img" alt="Book Cover">`,
    content_cn: `<img src="src/assets/images/cover.jpg" class="cover-img" alt="Book Cover">`
});

let match;
while ((match = chapterRegex.exec(content)) !== null) {
    const chapterNum = parseInt(match[1]);
    const title = match[2].trim();
    const chapterContent = match[3].trim();

    // Format paragraph breaks
    const formattedContent = chapterContent
        .split('\n\n')
        .map(p => `<p>${p.trim().replace(/\n/g, ' ')}</p>`)
        .join('\n');

    chapters.push({
        chapter: chapterNum,
        title: `CH ${chapterNum}: ${title}`,
        title_cn: `第 ${chapterNum} 章: ${title}`,
        content: formattedContent,
        content_cn: formattedContent
    });
}

const output = `PocketReader.bookContent = ${JSON.stringify(chapters, null, 4)};`;
fs.writeFileSync('/Users/decepticonmanager/Book Reader/src/features/reader/data.js', output);
console.log('Successfully regenerated data.js with correct structure');
