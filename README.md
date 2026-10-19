# LinkedIn Theme Studio 

A Chrome/Edge extension (Manifest V3) that adds custom curated themes, accent color personalization, and focus-mode decluttering to LinkedIn.

---

##  Key Features

1. **6 Curated Theme Presets:**
   - **OLED Pitch Black:** Pure `#000000` dark mode with deep contrast for night browsing & OLED screens.
   - **Midnight Navy:** Deep sapphire backgrounds with cool blue highlights.
   - **Cyberpunk Neon:** Dark purple/charcoal foundation with electric pink & cyan tones.
   - **Emerald Teal:** Calming slate with mint/teal highlights.
   - **Dracula Nord:** Elegant slate-purple aesthetic with pastel accents.
   - **Minimalist Light:** Distraction-free, border-softened ultra-clean light mode.

2. **Custom Accent Color Engine:**
   - Pick any custom hex color or choose from quick palette swatches.
   - Automatically overrides primary buttons, badges, active tabs, and highlights in real time.

3. **Focus & Declutter Mode:**
   - **Hide Promoted Posts:** Collapses sponsored and promoted feed advertisements.
   - **Hide LinkedIn News:** Removes the right-hand news sidebar widget.
   - **Hide Suggested Follows:** Removes "Add to your feed" recommendation boxes.

4. **Zero-Reload Live Sync:**
   - Changes made in the popup take effect immediately on active LinkedIn tabs via `chrome.storage.sync` and `MutationObserver`.

---

## How to Install and Load into Chrome / Edge

### Step 1: Open Extensions Page
- In **Google Chrome** or **Brave**: Go to `chrome://extensions`
- In **Microsoft Edge**: Go to `edge://extensions`

### Step 2: Enable Developer Mode
- In the top-right corner of the Extensions page, switch the toggle for **Developer mode** to **ON**.

### Step 3: Load Unpacked Extension
1. Click the **"Load unpacked"** button in the top-left corner.
2. Browse to and select this project folder:
   ```text
   C:\Users\Ankit Singh Tomar\.gemini\antigravity-ide\scratch\linkedin-theme-extension
   ```
3. The extension **"LinkedIn Theme Studio"** will now appear in your extensions list.

### Step 4: Pin and Enjoy
1. Click the puzzle icon (Extensions) in your browser toolbar and pin **LinkedIn Theme Studio**.
2. Open [linkedin.com](https://www.linkedin.com) (or refresh an existing tab).
3. Click the extension icon to select your favorite theme, customize accents, or toggle declutter modes.

---

## Project Structure

```text
linkedin-theme-extension/
├── manifest.json              # Manifest V3 specification
├── popup/
│   ├── popup.html             # Glassmorphic control panel interface
│   ├── popup.css              # Dark mode styling and micro-animations
│   └── popup.js               # State handling, dynamic theme cards & sync
├── content/
│   ├── content.js             # Live storage observer & dynamic style injector
│   ├── themes.css             # Semantic token overrides & LinkedIn layouts
│   └── declutter.css          # Selectors for hiding sponsored ads & sidebars
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```
