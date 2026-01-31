const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');

const password = 'crazyfrog';

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

    // --- Inject Cover Page as First Item ---
    if (images && images.cover) {
        bookContent.push({
            title: "Cover",
            title_cn: "封面",
            title_id: "Sampul",
            title_ru: "Обложка",
            content: `<img src="${images.cover}" class="cover-img-full" alt="Cover">`,
            book_title: bookName.replace(/([A-Z])/g, ' $1').trim(),
            theme_color: "#efe8d9"
        });
    }

    const lastSceneParagraph = "She reached the bridge over the canal. It was a rusted iron structure that vibrated every time a truck passed. She leaned against the railing and looked down at the water. It was black and moved with a heavy, slow intent, carrying the debris of the city toward the sea.";

    // Exact paragraph from text to ensure match
    const bodyGeographyParagraph = "She leaned in, her mouth leaving his just long enough to move to his ear. Her voice was low, a whisper that barely disturbed the air.";

    // --- Process Chapters ---
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

        // --- Precise Image Injection ---

        // Last Scene Image
        if (images && images.lastScene && chapterObj.content.includes(lastSceneParagraph)) {
            const injectionHtml = `\n\n<div class="end-scene"><img src="${images.lastScene}" alt="End Scene" class="scene-img"></div>\n\n`;
            chapterObj.content = chapterObj.content.replace(lastSceneParagraph, lastSceneParagraph + injectionHtml);
        }

        // Body of Geography Image
        if (images && images.bodyGeography && chapterObj.content.includes(bodyGeographyParagraph)) {
            const injectionHtml = `\n\n<div class="scene-wrapper"><img src="${images.bodyGeography}" alt="The Geography of the Body" class="scene-img"></div>\n\n`;
            chapterObj.content = chapterObj.content.replace(bodyGeographyParagraph, bodyGeographyParagraph + injectionHtml);
        }

        if (otherLangs['cn']) {
            chapterObj.title_cn = otherLangs['cn'].titles[i] ? `第 ${i + 1} 章: ${otherLangs['cn'].titles[i]}` : chapterObj.title;
            chapterObj.content_cn = otherLangs['cn'].chapters[i] ? otherLangs['cn'].chapters[i].trim() : '';

            const bodyGeographyParagraphCN = '她向他倾身，她的嘴离开他的嘴唇仅仅长到足够移到他的耳边。她的声音很低，是一种几乎不扰动空气的耳语。';
            if (images && images.bodyGeography && chapterObj.content_cn.includes(bodyGeographyParagraphCN)) {
                const injectionHtml = `\n\n<div class="scene-wrapper"><img src="${images.bodyGeography}" alt="The Geography of the Body" class="scene-img"></div>\n\n`;
                chapterObj.content_cn = chapterObj.content_cn.replace(bodyGeographyParagraphCN, bodyGeographyParagraphCN + injectionHtml);
            }
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
    en: 'en.txt',
    cn: 'cn.txt'
}, {
    cover: 'Content/TheFrictionOfTheSpark/images/cover.jpg',
    lastScene: 'Content/TheFrictionOfTheSpark/images/last_scene.jpg',
    bodyGeography: 'Content/TheFrictionOfTheSpark/images/body_of_geography.jpg'
});
