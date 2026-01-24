---
name: Indonesian Story Translator
description: Guidelines for translating narrative content into Indonesian while preserving literary style and integrating it into the codebase.
---

# 🇮🇩 Indonesian Story Translator Skill

This skill guides you through translating the "Book Reader" content (`data.js`) into Indonesian. It emphasizes **literary quality** over literal translation and provides a workflow for integrating multilingual support.

## 🎯 When to Use
- **Localizing Content**: When the user requests an Indonesian version of the story.
- **Adding Language Support**: When implementing the UI toggle for EN/CN/ID.

## 🧠 Philosophy
> **"Pahami Perasaan, Bukan Sekadar Kata."**
> The source material is a "Nordic Noir" style thriller. The Indonesian translation must reflect this **cold, clinical, yet intense** atmosphere. Use formal Indonesian (*Bahasa Baku*) for narrative and analytical sections, while allowing for more emotive language in Noa's sections.

**Tone Guidelines:**
-   **Noa**: Poetic, delusional, tragic. Use evocative, slightly archaic or metaphor-heavy language (e.g., "Sepia-toned delusion" -> "Delusi sewarna sepia").
-   **Kyle**: Efficient, cold, corporate. Use precise, modern, and formal Indonesian.
-   **Eline**: Analytical, detached, clinical. Use clinical or psychological phrasing.

## 🚀 Workflows

### Workflow A: The "Tri-Data" Integration
Use this to structurally prepare the codebase for Indonesian support.

1.  **Schema Update**:
    Modify `src/features/reader/data.js` to support Indonesian fields.
    ```javascript
    {
        chapter: 1,
        title: "PART I: THE DEFICIT",
        title_id: "BAGIAN I: DEFISIT",  // [NEW]
        content: "<p>...</p>",
        content_id: "<p>...</p>" // [NEW]
    }
    ```

2.  **Logic Update**:
    Update `logic.js` to handle the `id` language state.
    ```javascript
    const state = {
        lang: 'en', // 'cn', or 'id'
    };
    
    // In renderChapter:
    let title, content;
    if (state.lang === 'cn') {
        title = chapter.title_cn;
        content = chapter.content_cn;
    } else if (state.lang === 'id') {
        title = chapter.title_id;
        content = chapter.content_id;
    } else {
        title = chapter.title;
        content = chapter.content;
    }
    ```

3.  **UI Update**:
    Add a language toggle (ID) in the Settings Drawer.

### Workflow B: The Translation Process
Use this when generating the content.

1.  **Extract**: Read `Novel.txt` or `data.js` chunk by chunk.
2.  **Translate**:
    -   *Input*: "The Netherlands is a country of engineered landscapes..."
    -   *Draft*: "Belanda adalah negara dengan lanskap teknik..." (Too literal)
    -   *Polish*: "Belanda adalah negeri dengan bentang alam yang dirancang secara presisi..." (Literary)
3.  **Validate**: Ensure HTML structure (`<p>`) is preserved.

## 🛠️ Toolbelt

### Common Terminology Map
| English Term | Context | Indonesian Translation | Note |
| :--- | :--- | :--- | :--- |
| **"HelloTalk"** | The App | HelloTalk | Keep English brand name usually |
| **"Social Housing"** | Setting | Perumahan Rakyat / Subsidi | Conveys lower economic status |
| **"Polders"** | Geography | Polder | Common term in Indonesian for reclaimed land |
| **"Apex Predator"** | Metaphor | Predator Puncak | Strength/Danger |

## ✅ Checklist
- [ ] Is the JSON valid?
- [ ] Are HTML tags preserved?
- [ ] Does the tone match the character?
