---
name: Russian Story Translator
description: Guidelines for translating narrative content into Russian while preserving literary style and integrating it into the codebase.
---

# 🇷🇺 Russian Story Translator Skill

This skill guides you through translating the "Book Reader" content (`data.js`) into Russian. It emphasizes **literary quality** (akin to Dostoyevsky or Bulgakov) over literal translation and provides a workflow for integrating multilingual support.

## 🎯 When to Use
- **Localizing Content**: When the user requests a Russian version of the story.
- **Adding Language Support**: When implementing the UI toggle for EN/CN/ID/RU.

## 🧠 Philosophy
> **"Передавайте чувство, а не просто слова."**
> The source material is a "Nordic Noir" style thriller. The Russian translation must reflect this **cold, clinical, yet intense** atmosphere. Use sophisticated, literary Russian (literaturnyy yazyk) for narrative, and more erratic, psychological language for Noa.

**Tone Guidelines:**
-   **Noa**: Poetic, delusional, tragic. Use evocative, slightly archaic or metaphor-heavy language (e.g., "Sepia-toned delusion" -> "Подёрнутый сепией бред").
-   **Kyle**: Efficient, cold, corporate. Use precise, modern, and formal Russian business terminology.
-   **Eline**: Analytical, detached, clinical. Use clinical, psychological, or medical phrasing.

## 🚀 Workflows

### Workflow A: The "Quad-Data" Integration
Use this to structurally prepare the codebase for Russian support.

1.  **Schema Update**:
    Modify `src/features/reader/data.js` to support Russian fields.
    ```javascript
    {
        chapter: 1,
        title: "PART I: THE DEFICIT",
        title_ru: "ЧАСТЬ I: ДЕФИЦИТ",  // [NEW]
        content: "<p>...</p>",
        content_ru: "<p>...</p>" // [NEW]
    }
    ```

2.  **Logic Update**:
    Update `logic.js` to handle the `ru` language state.
    ```javascript
    const state = {
        lang: 'en', // 'cn', 'id', or 'ru'
    };
    
    // In renderChapter:
    let title, content;
    if (state.lang === 'cn') {
        title = chapter.title_cn;
        content = chapter.content_cn;
    } else if (state.lang === 'id') {
        title = chapter.title_id;
        content = chapter.content_id;
    } else if (state.lang === 'ru') {
        title = chapter.title_ru;
        content = chapter.content_ru;
    } else {
        title = chapter.title;
        content = chapter.content;
    }
    ```

3.  **UI Update**:
    Add a language toggle (RU) in the Settings Drawer.

### Workflow B: The Translation Process
Use this when generating the content.

1.  **Extract**: Read `Novel.txt` or `data.js` chunk by chunk.
2.  **Translate**:
    -   *Input*: "The Netherlands is a country of engineered landscapes..."
    -   *Draft*: "Нидерланды — страна инженерных ландшафтов..." (Too literal)
    -   *Polish*: "Нидерланды — страна выверенных ландшафтов; здесь всё измерено, отвоёвано у моря и подчинено порядку..." (Literary/Noir)
3.  **Validate**: Ensure HTML structure (`<p>`) is preserved.

## 🛠️ Toolbelt

### Common Terminology Map
| English Term | Context | Russian Translation | Note |
| :--- | :--- | :--- | :--- |
| **"HelloTalk"** | The App | HelloTalk | Keep English brand name usually |
| **"Social Housing"** | Setting | Социальное жилье | Conveys the specific economic status |
| **"Polders"** | Geography | Польдеры | Standard term in Russian |
| **"Apex Predator"** | Metaphor | Высший хищник | Strength/Danger |

## ✅ Checklist
- [ ] Is the JSON valid?
- [ ] Are HTML tags preserved?
- [ ] Does the tone match the character?
