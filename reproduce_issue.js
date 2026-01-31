
const text = `第 1 章：镀金的牢笼
Content 1...
第 2 章：悲伤的翻译
Content 2...`;

const regex = /Chapter \d+:|第 \d+ 章:/;
const splits = text.split(regex);
console.log('Splits length:', splits.length);
console.log('Splits:', splits);

const regexCorrected = /Chapter \d+:|第 \d+ 章[：:]/;
const splitsCorrected = text.split(regexCorrected);
console.log('Corrected Splits length:', splitsCorrected.length);
