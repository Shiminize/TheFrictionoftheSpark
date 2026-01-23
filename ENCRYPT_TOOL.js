// Encryption Tool - Run this in your browser console on any page that has CryptoJS loaded
// or just use this as a reference.

const contentToEncrypt = [
    // Paste your data.js array contents here
];

const password = "YourChosenPassword";

const encrypted = CryptoJS.AES.encrypt(JSON.stringify(contentToEncrypt), password).toString();

console.log("----- COPY THIS INTO data.js -----");
console.log(`PocketReader.encryptedContent = "${encrypted}";`);
console.log("----------------------------------");
