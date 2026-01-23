// script.js - Persistence & Reader Logic

// --- STATE MANAGEMENT ---
const state = {
    currentChapter: 1, // 1-based index (matches book.js)
    fontSize: 18,
    theme: 'light',
    scrollPos: 0
};

// --- DOM ELEMENTS ---
const dom = {
    reader: document.getElementById('content-area'),
    header: document.getElementById('chapter-header'),
    display: document.getElementById('chapter-display'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    menuBtn: document.getElementById('menu-toggle'),
    settingsPanel: document.getElementById('settings-panel'),
    closeSettings: document.getElementById('close-settings'),
    themeBtns: document.querySelectorAll('.theme-btn'),
    fontSlider: document.getElementById('font-size-slider'),
    tocList: document.getElementById('toc-list')
};

// --- INITIALIZATION ---
function init() {
    loadProgress();
    renderChapter(state.currentChapter, false); // false = don't auto-scroll to top yet
    applyTheme(state.theme);
    applyFontSize(state.fontSize);
    buildTOC();
    setupEventListeners();

    // Restore scroll position after a slight delay to ensure layout
    setTimeout(() => {
        if (state.scrollPos > 0) {
            window.scrollTo(0, state.scrollPos);
        }
    }, 100);
}

// --- CORE FUNCTIONS ---

function renderChapter(chapterNum, resetScroll = true) {
    // 1. Validate
    const chapterData = bookContent.find(c => c.chapter === chapterNum);
    if (!chapterData) return;

    // 2. Update State
    state.currentChapter = chapterNum;

    // 3. Render HTML with fade animation
    dom.reader.innerHTML = `<div class="fade-in">${chapterData.content}</div>`;
    dom.header.innerHTML = `<h1>${chapterData.title}</h1>`;
    dom.display.textContent = `Part ${toRoman(chapterNum)}`;

    // 4. Update Controls
    dom.prevBtn.style.opacity = chapterNum === 1 ? '0.3' : '1';
    dom.prevBtn.disabled = chapterNum === 1;

    dom.nextBtn.style.opacity = chapterNum === bookContent.length ? '0.3' : '1';
    dom.nextBtn.disabled = chapterNum === bookContent.length;

    // 5. Scroll Handling
    if (resetScroll) {
        window.scrollTo(0, 0);
        state.scrollPos = 0;
    }

    saveProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('pocketReaderProgress');
    if (saved) {
        const parsed = JSON.parse(saved);
        state.currentChapter = parsed.currentChapter || 1;
        state.fontSize = parsed.fontSize || 18;
        state.theme = parsed.theme || 'light';
        state.scrollPos = parsed.scrollPos || 0;

        // Update UI controls to match loaded state
        dom.fontSlider.value = state.fontSize;
        updateThemeBtns(state.theme);
    }
}

function saveProgress() {
    localStorage.setItem('pocketReaderProgress', JSON.stringify(state));
}

function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    state.theme = themeName;
    updateThemeBtns(themeName);
    saveProgress();
}

function updateThemeBtns(activeTheme) {
    dom.themeBtns.forEach(btn => {
        if (btn.dataset.theme === activeTheme) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function applyFontSize(size) {
    dom.reader.style.fontSize = `${size}px`;
    state.fontSize = size;
    saveProgress();
}

function buildTOC() {
    dom.tocList.innerHTML = '';
    bookContent.forEach(chapter => {
        const li = document.createElement('li');
        li.textContent = chapter.title;
        if (chapter.chapter === state.currentChapter) li.classList.add('active');

        li.addEventListener('click', () => {
            renderChapter(chapter.chapter);
            dom.settingsPanel.classList.add('hidden');
        });

        dom.tocList.appendChild(li);
    });
}

// --- UTILS ---

// Simple throttled scroll saver
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        state.scrollPos = window.scrollY;
        saveProgress();
    }, 200);
});

// Helper for Roman Numerals (Simple version)
function toRoman(num) {
    const map = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII', 13: 'XIII' };
    return map[num] || num;
}

// --- EVENTS ---

function setupEventListeners() {
    // Nav
    dom.prevBtn.addEventListener('click', () => {
        if (state.currentChapter > 1) renderChapter(state.currentChapter - 1);
    });

    dom.nextBtn.addEventListener('click', () => {
        if (state.currentChapter < bookContent.length) renderChapter(state.currentChapter + 1);
    });

    // Settings Logic
    dom.menuBtn.addEventListener('click', () => dom.settingsPanel.classList.remove('hidden'));
    dom.closeSettings.addEventListener('click', () => dom.settingsPanel.classList.add('hidden'));

    // Theme Toggle
    dom.themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => applyTheme(e.target.dataset.theme));
    });

    // Font Slider
    dom.fontSlider.addEventListener('input', (e) => applyFontSize(e.target.value));
}

// Start
init();
