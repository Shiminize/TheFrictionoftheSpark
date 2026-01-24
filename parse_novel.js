const fs = require('fs');
const path = require('path');

const filePath = '/Users/decepticonmanager/Book Reader/Content/The Audacity of Silence.txt';
const content = fs.readFileSync(filePath, 'utf8');

const chapters = [];
const chapterRegex = /Ch (\d+): (.*?)(?=\nCh \d+:|$)/gs;

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
    const chapterContent = match[0].split('\n').slice(1).join('\n').trim();

    const formattedContent = chapterContent
        .split('\n\n')
        .map(p => `<p>${p.trim().replace(/\n/g, ' ')}</p>`)
        .join('\n');

    chapters.push({
        chapter: chapterNum,
        title: `CH ${chapterNum}: ${title}`,
        title_cn: `第 ${chapterNum} 章: ${title}`, // Placeholder translation or just title
        content: formattedContent,
        content_cn: formattedContent // Placeholder for CN content
    });
}

const output = `PocketReader.bookContent = ${JSON.stringify(chapters, null, 4)};`;
fs.writeFileSync('/Users/decepticonmanager/Book Reader/src/features/reader/data.js', output);
console.log('Successfully generated data.js');
