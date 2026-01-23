// gatekeeper.js - Secure Access Controller
// Handles decryption of book content using CryptoJS

window.Gatekeeper = (function () {
    const STORAGE_KEY = 'pocket_reader_session';
    const OVERLAY_ID = 'gatekeeper-overlay';

    let encryptedData = null;

    function init() {
        // Find encrypted data
        encryptedData = window.PocketReader.encryptedContent;

        if (!encryptedData) {
            console.warn("Gatekeeper: No encrypted content found. Proceeding without gate.");
            hideGate();
            if (window.PocketReaderLogic) window.PocketReaderLogic.init();
            return;
        }

        // Check for existing session
        const savedPass = sessionStorage.getItem(STORAGE_KEY);
        if (savedPass && attemptUnlock(savedPass)) {
            return;
        }

        renderLogin();
    }

    function renderLogin() {
        const overlay = document.getElementById(OVERLAY_ID);
        overlay.innerHTML = `
            <div class="login-card" id="login-card">
                <h2>Protected Story</h2>
                <div class="input-wrapper">
                    <input type="password" id="gate-password" placeholder="Enter Password" autocomplete="current-password">
                    <div id="error-msg" class="error-msg">Incorrect password</div>
                </div>
                <button id="gate-submit" class="gate-submit">Unlock Content</button>
            </div>
        `;

        const input = document.getElementById('gate-password');
        const submit = document.getElementById('gate-submit');

        submit.addEventListener('click', () => handleUnlock());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUnlock();
        });

        input.focus();
    }

    function handleUnlock() {
        const input = document.getElementById('gate-password');
        const pass = input.value;

        if (attemptUnlock(pass)) {
            sessionStorage.setItem(STORAGE_KEY, pass);
        } else {
            showError();
        }
    }

    function attemptUnlock(password) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, password);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedString) return false;

            const content = JSON.parse(decryptedString);

            // Success! Inject content and start reader
            window.PocketReader.bookContent = content;
            hideGate();

            // Initialize main reader logic
            if (window.PocketReaderLogic) {
                window.PocketReaderLogic.init();
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function showError() {
        const card = document.getElementById('login-card');
        const msg = document.getElementById('error-msg');

        card.classList.add('shake');
        msg.classList.add('visible');

        setTimeout(() => {
            card.classList.remove('shake');
        }, 400);
    }

    function hideGate() {
        const overlay = document.getElementById(OVERLAY_ID);
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 500);
    }

    return { init };
})();

// Wait for document and CryptoJS to load
document.addEventListener('DOMContentLoaded', () => {
    // If CryptoJS isn't loaded yet, wait for its onload or check in interval
    if (window.CryptoJS) {
        window.Gatekeeper.init();
    } else {
        console.error("Gatekeeper: CryptoJS not found.");
    }
});
