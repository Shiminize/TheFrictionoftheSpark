---
name: Design Reading Page
description: specialist skill to design a high-quality reading experience with focus on typography and color
---

# Design Reading Page Skill

This skill helps you design a beautiful, readable web page for reading content (like a book reader or article view). It focuses on "Calm Luxury" aesthetics, utilizing CSS variables for theming and standard CSS for layout.

## 1. Color Palette Design
Define your colors in a separate CSS file (e.g., `colors.css`) using CSS Custom Properties (Variables) for easy theming (Light/Dark mode).

### Principles
- **Base Colors**: Use HSL values for easy manipulation of lightness and saturation.
- **Contrast**: Ensure high contrast between text and background (AAA standard).
- **Harmony**: Use analogous or monochromatic schemes for a "calm" feel.

### Example `colors.css`
```css
:root {
  /* HSL Helpers */
  --hue-base: 210; /* Blue-ish gray */
  --sat-base: 10%;
  
  /* Backgrounds */
  --color-bg-paper: hsl(var(--hue-base), var(--sat-base), 98%);
  --color-bg-default: hsl(var(--hue-base), var(--sat-base), 94%);
  
  /* Text */
  --color-text-primary: hsl(var(--hue-base), var(--sat-base), 15%);
  --color-text-secondary: hsl(var(--hue-base), var(--sat-base), 40%);
  
  /* Accents */
  --color-accent: hsl(var(--hue-base), 50%, 50%);
  
  /* UI Elements */
  --color-border: hsl(var(--hue-base), var(--sat-base), 85%);
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-paper: hsl(var(--hue-base), var(--sat-base), 10%);
    --color-bg-default: hsl(var(--hue-base), var(--sat-base), 15%);
    --color-text-primary: hsl(var(--hue-base), var(--sat-base), 90%);
    --color-text-secondary: hsl(var(--hue-base), var(--sat-base), 70%);
    --color-border: hsl(var(--hue-base), var(--sat-base), 25%);
  }
}
```

## 2. Reading Layout Architecture
Create a layout that mimics a comfortable book reading experience.

### Key Layout Rules
- **Line Length**: Limit text width to 60-75 characters (approx. 600px - 700px) for optimal readability.
- **Typography**: Use a serif font for body text and sans-serif for UI/headers (or vice versa, but be consistent).
- **Whitespace**: Generous margins and substantial line-height (1.6 - 1.8).

### CSS implementation snippet
```css
.reading-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  background-color: var(--color-bg-paper);
}

.reading-content {
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--color-text-primary);
}

.reading-content p {
  margin-bottom: 1.5em;
}
```

## 3. Usage Steps
1.  **Create `colors.css`** with the chosen palette.
2.  **Create `layout.css`** (or main style file) and import colors:
    ```css
    @import 'colors.css';
    /* Your layout styles here */
    ```
3.  **Link in HTML**:
    ```html
    <link rel="stylesheet" href="layout.css">
    ```
