const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');

const password = 'lieverd';

function encryptBook(bookName, languageFiles, images = {}) {
    const bookContent = [];
    const baseDir = path.join('/Users/decepticonmanager/Book Reader/Content', bookName);

    // Read all language files
    const langData = {};
    for (const [lang, filename] of Object.entries(languageFiles)) {
        const filePath = path.join(baseDir, filename);
        if (fs.existsSync(filePath)) {
            langData[lang] = fs.readFileSync(filePath, 'utf8');
        }
    }

    // Split EN into chapters for baseline
    const enText = langData['en'];
    // Handle both "Chapter 1:" and "# Chapter 1:" or similar variants if needed
    // The Friction of the Spark has "Chapter 1: The Gilded Cage"
    const chapterSplits = enText.split(/Chapter \d+:/);
    const chapters = chapterSplits.filter(c => c.trim().length > 0);
    const titlesMatch = enText.match(/Chapter \d+: (.*)/g);
    const titles = titlesMatch ? titlesMatch.map(t => t.replace(/Chapter \d+: /, '')) : [];

    // Process other languages
    const otherLangs = {};
    for (const [lang, text] of Object.entries(langData)) {
        if (lang === 'en') continue;
        const splitRegex = lang === 'cn' ? /Chapter \d+:|第 \d+ 章:/ :
            lang === 'id' ? /Chapter \d+:|Bab \d+:/ :
                lang === 'ru' ? /Chapter \d+:|Глава \d+:/ : /Chapter \d+:/;

        const langChapters = text.split(splitRegex).filter(c => c.trim().length > 0);
        const titleRegex = lang === 'cn' ? /第 \d+ 章: (.*)/g :
            lang === 'id' ? /Bab \d+: (.*)/ :
                lang === 'ru' ? /Глава \d+: (.*)/ : /Chapter \d+: (.*)/;

        const langTitlesMatch = text.match(new RegExp(titleRegex.source, 'g'));
        const langTitles = langTitlesMatch ? langTitlesMatch.map(t => t.replace(new RegExp(titleRegex.source.split(' (.*)')[0] + ': '), '')) : [];

        otherLangs[lang] = {
            chapters: langChapters,
            titles: langTitles
        };
    }

    titles.forEach((title, i) => {
        const chapterObj = {
            title: `Chapter ${i + 1}: ${title}`,
            content: chapters[i].trim(),
            book_title: bookName.replace(/([A-Z])/g, ' $1').trim(),
            theme_color: "#efe8d9"
        };

        // Fix title duplication in content if present
        if (chapterObj.content.startsWith(title)) {
            chapterObj.content = chapterObj.content.substring(title.length).trim();
        }

        // Inject Cover into Chapter 1
        if (i === 0 && images && images.cover) {
            chapterObj.cover = images.cover;
        }

        // Inject Last Scene into Last Chapter
        if (i === titles.length - 1 && images && images.lastScene) {
            chapterObj.content += `<div class="end-scene"><img src="${images.lastScene}" alt="End Scene" class="scene-img"></div>`;
        }

        if (otherLangs['cn']) {
            chapterObj.title_cn = otherLangs['cn'].titles[i] ? `第 ${i + 1} 章: ${otherLangs['cn'].titles[i]}` : chapterObj.title;
            chapterObj.content_cn = otherLangs['cn'].chapters[i] ? otherLangs['cn'].chapters[i].trim() : '';
        }
        if (otherLangs['id']) {
            chapterObj.title_id = otherLangs['id'].titles[i] ? `Bab ${i + 1}: ${otherLangs['id'].titles[i]}` : chapterObj.title;
            chapterObj.content_id = otherLangs['id'].chapters[i] ? otherLangs['id'].chapters[i].trim() : '';
        }
        if (otherLangs['ru']) {
            chapterObj.title_ru = otherLangs['ru'].titles[i] ? `Глава ${i + 1}: ${otherLangs['ru'].titles[i]}` : chapterObj.title;
            chapterObj.content_ru = otherLangs['ru'].chapters[i] ? otherLangs['ru'].chapters[i].trim() : '';
        }

        bookContent.push(chapterObj);
    });

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(bookContent), password).toString();
    const output = `window.PocketReader = window.PocketReader || {};\nPocketReader.encryptedContent = "${encrypted}";`;

    fs.writeFileSync(path.join(baseDir, 'data.js'), output);
    console.log(`Successfully encrypted: ${bookName}`);
}

// 3. TheFrictionOfTheSpark
encryptBook('TheFrictionOfTheSpark', {
    en: 'en.txt'
}, {
    cover: 'Content/TheFrictionOfTheSpark/images/cover.png',
    lastScene: 'Content/TheFrictionOfTheSpark/images/last_scene.png'
});
