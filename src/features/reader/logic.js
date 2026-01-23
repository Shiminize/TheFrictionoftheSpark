// logic.js - Core Reader Logic (Slide System + i18n)
// Depends on: namespace.js, data.js

// --- STATE MANAGEMENT ---
const state = {
    currentChapter: 1, // 1-based index
    fontSize: 18,
    theme: 'light',
    lang: 'en', // 'en' or 'cn'
    scrollPos: 0
};

// --- DOM ELEMENTS ---
const dom = {
    bookElement: document.getElementById('book'),
    readerContainer: document.getElementById('reader'),
    pageDisplay: document.getElementById('chapter-display'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    menuTag: document.getElementById('menu-tag'),
    settingsDrawer: document.getElementById('settings-drawer'),
    settingsOverlay: document.getElementById('settings-overlay'),
    closeSettings: document.getElementById('close-settings'),
    themeBtns: document.querySelectorAll('.theme-btn:not(.lang-btn)'), // Exclude lang buttons from theme logic
    langBtns: document.querySelectorAll('.lang-btn'),
    fontSlider: document.getElementById('font-size-slider'),
    tocList: document.getElementById('toc-list')
};

// --- INITIALIZATION ---
function init() {
    loadProgress();
    renderChapter('none'); // Initial render, no animation
    setupEventListeners();
    applyTheme(state.theme);
    applyFontSize(state.fontSize);
    updateLangBtns(state.lang); // Visual update
    buildTOC();
    console.log("Pocket Reader Initialized (Slide Engine + i18n)");
}

// --- RENDER LOGIC (SLIDE SYSTEM) ---
function renderChapter(direction) {
    const bookContent = PocketReader.bookContent;
    const chapterIndex = state.currentChapter - 1;
    const chapterData = bookContent[chapterIndex];

    if (!chapterData) return;

    // Determine Content Language
    const isCN = state.lang === 'cn';
    const title = isCN ? (chapterData.title_cn || chapterData.title) : chapterData.title;
    const content = isCN ? (chapterData.content_cn || chapterData.content) : chapterData.content;

    // 1. Create new page element
    const pageDiv = document.createElement('div');
    pageDiv.classList.add('page');

    // 2. Add animation class based on direction
    if (direction === 'next') {
        pageDiv.classList.add('slide-next');
    } else if (direction === 'prev') {
        pageDiv.classList.add('slide-prev');
    }

    // 3. Inject Content
    pageDiv.innerHTML = `
        <div class="page-content">
            <div class="page-header">
                <h1>${title}</h1>
            </div>
            <div class="page-text">
                ${content}
            </div>
            <div class="page-footer">
                ${state.currentChapter} / ${bookContent.length}
            </div>
        </div>
    `;

    // 4. Update DOM
    dom.bookElement.innerHTML = ''; // Clear previous
    dom.bookElement.appendChild(pageDiv);

    // 5. Update UI
    updateDisplay();
    // Scroll to top of window for Full Width layout
    window.scrollTo(0, 0);
}

// --- STATE ACTIONS ---
function nextChapter() {
    const total = PocketReader.bookContent.length;
    if (state.currentChapter < total) {
        state.currentChapter++;
        renderChapter('next');
        saveProgress();
    }
}

function prevChapter() {
    if (state.currentChapter > 1) {
        state.currentChapter--;
        renderChapter('prev');
        saveProgress();
    }
}

function jumpToChapter(index) {
    const oldIndex = state.currentChapter;
    state.currentChapter = index;
    const direction = index > oldIndex ? 'next' : 'prev';
    renderChapter(direction);
    saveProgress();
    closeMenu();
}

function setLanguage(lang) {
    if (state.lang === lang) return;
    state.lang = lang;
    updateLangBtns(lang);
    renderChapter('none'); // Re-render current chapter in new language
    buildTOC(); // Re-build TOC in new language
    saveProgress();
}

// --- CORE FUNCTIONS ---

function updateDisplay() {
    const bookContent = PocketReader.bookContent;
    // Localized Title from Data
    const chapterData = bookContent[state.currentChapter - 1];
    const partLabel = state.lang === 'cn' ? (chapterData.title_cn || chapterData.title) : chapterData.title;
    dom.pageDisplay.textContent = partLabel;

    const total = bookContent.length;
    dom.prevBtn.style.opacity = state.currentChapter === 1 ? '0.3' : '1';
    dom.prevBtn.disabled = state.currentChapter === 1;

    dom.nextBtn.style.opacity = state.currentChapter === total ? '0.3' : '1';
    dom.nextBtn.disabled = state.currentChapter === total;

    // Update Active TOC
    const tocItems = document.querySelectorAll('.toc-list li');
    tocItems.forEach((item, idx) => {
        if (idx === state.currentChapter - 1) item.classList.add('active');
        else item.classList.remove('active');
    });
}

function loadProgress() {
    const saved = localStorage.getItem('pocketReaderProgress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state.currentChapter = parsed.currentChapter || 1;
            state.fontSize = parsed.fontSize || 18;
            state.theme = parsed.theme || 'light';
            state.lang = parsed.lang || 'en'; // Default to EN

            dom.fontSlider.value = state.fontSize;
            updateThemeBtns(state.theme);
        } catch (e) {
            console.error("Save file corrupted, resetting.");
        }
    }
}

function saveProgress() {
    const safeState = {
        currentChapter: state.currentChapter,
        fontSize: state.fontSize,
        theme: state.theme,
        lang: state.lang
    };
    localStorage.setItem('pocketReaderProgress', JSON.stringify(safeState));
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

function updateLangBtns(activeLang) {
    dom.langBtns.forEach(btn => {
        if (btn.dataset.lang === activeLang) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function applyFontSize(size) {
    // Set global CSS variable on Root for persistence across chapter renders
    document.documentElement.style.setProperty('--dynamic-font-size', `${size}px`);
    state.fontSize = size;
    saveProgress();
}

function buildTOC() {
    const bookContent = PocketReader.bookContent;
    dom.tocList.innerHTML = '';

    bookContent.forEach((chapter, index) => {
        const li = document.createElement('li');
        // Use localized title
        const isCN = state.lang === 'cn';
        li.textContent = isCN ? (chapter.title_cn || chapter.title) : chapter.title;

        li.addEventListener('click', () => jumpToChapter(index + 1));
        dom.tocList.appendChild(li);
    });
}

// --- EVENTS ---

function setupEventListeners() {
    // Nav
    dom.prevBtn.addEventListener('click', prevChapter);
    dom.nextBtn.addEventListener('click', nextChapter);

    // Keyboard Nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextChapter();
        if (e.key === 'ArrowLeft') prevChapter();
    });

    // Settings
    function openMenu() {
        dom.settingsDrawer.classList.add('open');
        dom.settingsOverlay.classList.add('visible');
    }

    // Global close menu function for reuse
    window.closeMenu = function () {
        dom.settingsDrawer.classList.remove('open');
        dom.settingsOverlay.classList.remove('visible');
    }

    dom.menuTag.addEventListener('click', openMenu);
    dom.closeSettings.addEventListener('click', closeMenu);
    dom.settingsOverlay.addEventListener('click', closeMenu);

    // Theme & Font
    dom.themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => applyTheme(e.target.dataset.theme));
    });

    // Lang
    dom.langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => setLanguage(e.target.dataset.lang));
    });

    dom.fontSlider.addEventListener('input', (e) => {
        applyFontSize(e.target.value);
    });
}

// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', init);
