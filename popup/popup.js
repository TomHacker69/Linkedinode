/**
 * LinkedIn Theme Studio - Popup Controller
 * Manages theme selection, custom colors, focus toggles, and sync storage.
 */

const THEMES = [
  {
    id: "oled-black",
    name: "OLED Pitch",
    colors: ["#000000", "#0a0a0a", "#1e1e1e", "#38bdf8"],
    defaultAccent: "#38bdf8"
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    colors: ["#070c18", "#0d162b", "#1c2d52", "#38bdf8"],
    defaultAccent: "#38bdf8"
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk",
    colors: ["#0a0614", "#120b24", "#2c1652", "#ec4899"],
    defaultAccent: "#ec4899"
  },
  {
    id: "emerald-teal",
    name: "Emerald Teal",
    colors: ["#041210", "#09201c", "#154239", "#10b981"],
    defaultAccent: "#10b981"
  },
  {
    id: "dracula-nord",
    name: "Dracula Nord",
    colors: ["#1e1e2e", "#252538", "#383857", "#cba6f7"],
    defaultAccent: "#cba6f7"
  },
  {
    id: "minimalist-light",
    name: "Clean Light",
    colors: ["#f8fafc", "#ffffff", "#e2e8f0", "#2563eb"],
    defaultAccent: "#2563eb"
  }
];

const ACCENT_PRESETS = [
  "#38bdf8", // Sky Blue
  "#10b981", // Emerald
  "#ec4899", // Neon Pink
  "#f59e0b", // Amber
  "#a855f7"  // Purple
];

const DEFAULT_STATE = {
  themeEnabled: true,
  activeTheme: "midnight-blue",
  customAccent: "",
  hidePromoted: true,
  hideNews: true,
  hideSuggested: false
};

// Cache DOM elements
const elements = {
  masterToggle: document.getElementById("masterToggle"),
  appContent: document.getElementById("appContent"),
  themeGrid: document.getElementById("themeGrid"),
  accentColorPicker: document.getElementById("accentColorPicker"),
  accentHexLabel: document.getElementById("accentHexLabel"),
  accentSwatches: document.getElementById("accentSwatches"),
  resetAccentBtn: document.getElementById("resetAccentBtn"),
  toggleHidePromoted: document.getElementById("toggleHidePromoted"),
  toggleHideNews: document.getElementById("toggleHideNews"),
  toggleHideSuggested: document.getElementById("toggleHideSuggested"),
  tabStatus: document.getElementById("tabStatus")
};

let currentState = { ...DEFAULT_STATE };

/**
 * Render Theme Selection Grid
 */
function renderThemeCards() {
  elements.themeGrid.innerHTML = "";

  THEMES.forEach((theme) => {
    const card = document.createElement("div");
    card.className = `theme-card ${currentState.activeTheme === theme.id ? "is-active" : ""}`;
    card.dataset.themeId = theme.id;

    // Visual color preview strip
    const strip = document.createElement("div");
    strip.className = "theme-preview-strip";
    theme.colors.forEach((color) => {
      const col = document.createElement("div");
      col.className = "theme-preview-color";
      col.style.backgroundColor = color;
      strip.appendChild(col);
    });

    // Theme Info row
    const info = document.createElement("div");
    info.className = "theme-card-info";

    const name = document.createElement("span");
    name.className = "theme-card-name";
    name.textContent = theme.name;

    const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    check.setAttribute("class", "theme-check-icon");
    check.setAttribute("viewBox", "0 0 24 24");
    check.setAttribute("fill", "none");
    check.setAttribute("stroke", "currentColor");
    check.setAttribute("stroke-width", "3");
    check.setAttribute("stroke-linecap", "round");
    check.setAttribute("stroke-linejoin", "round");

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", "20 6 9 17 4 12");
    check.appendChild(polyline);

    info.appendChild(name);
    info.appendChild(check);

    card.appendChild(strip);
    card.appendChild(info);

    card.addEventListener("click", () => selectTheme(theme.id));
    elements.themeGrid.appendChild(card);
  });
}

/**
 * Render Accent Swatches
 */
function renderAccentSwatches() {
  elements.accentSwatches.innerHTML = "";

  ACCENT_PRESETS.forEach((hex) => {
    const btn = document.createElement("button");
    btn.className = `swatch-btn ${currentState.customAccent.toLowerCase() === hex.toLowerCase() ? "is-active" : ""}`;
    btn.style.backgroundColor = hex;
    btn.title = hex;

    btn.addEventListener("click", () => {
      setAccentColor(hex);
    });

    elements.accentSwatches.appendChild(btn);
  });
}

/**
 * Update UI controls according to state
 */
function updateUI() {
  elements.masterToggle.checked = currentState.themeEnabled;
  elements.appContent.classList.toggle("is-disabled", !currentState.themeEnabled);

  // Update theme cards
  document.querySelectorAll(".theme-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.themeId === currentState.activeTheme);
  });

  // Current theme config
  const activeThemeConfig = THEMES.find((t) => t.id === currentState.activeTheme) || THEMES[0];
  const effectiveAccent = currentState.customAccent || activeThemeConfig.defaultAccent;

  // Update color picker & label
  elements.accentColorPicker.value = effectiveAccent;
  elements.accentHexLabel.textContent = effectiveAccent.toUpperCase();

  // Root CSS accent preview in popup
  document.documentElement.style.setProperty("--accent-color", effectiveAccent);

  // Update Declutter toggles
  elements.toggleHidePromoted.checked = currentState.hidePromoted;
  elements.toggleHideNews.checked = currentState.hideNews;
  elements.toggleHideSuggested.checked = currentState.hideSuggested;

  renderAccentSwatches();
}

/**
 * Save state changes to Chrome Storage Sync
 */
function saveState(updates) {
  currentState = { ...currentState, ...updates };
  updateUI();

  if (chrome?.storage?.sync) {
    chrome.storage.sync.set(currentState);
  }
}

/**
 * Select active theme
 */
function selectTheme(themeId) {
  saveState({ activeTheme: themeId });
}

/**
 * Set custom accent color
 */
function setAccentColor(hex) {
  saveState({ customAccent: hex });
}

/**
 * Check if the active tab is LinkedIn and update status badge
 */
function verifyActiveTab() {
  if (!chrome?.tabs?.query) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab && tab.url && tab.url.includes("linkedin.com")) {
      elements.tabStatus.textContent = "LinkedIn Active";
      elements.tabStatus.style.color = "#10b981";
      elements.tabStatus.style.background = "rgba(16, 185, 129, 0.12)";
    } else {
      elements.tabStatus.textContent = "Global Mode";
      elements.tabStatus.style.color = "#38bdf8";
      elements.tabStatus.style.background = "rgba(56, 189, 248, 0.12)";
    }
  });
}

/**
 * Bind DOM Event Listeners
 */
function bindEvents() {
  elements.masterToggle.addEventListener("change", (e) => {
    saveState({ themeEnabled: e.target.checked });
  });

  elements.accentColorPicker.addEventListener("input", (e) => {
    setAccentColor(e.target.value);
  });

  elements.resetAccentBtn.addEventListener("click", () => {
    saveState({ customAccent: "" });
  });

  elements.toggleHidePromoted.addEventListener("change", (e) => {
    saveState({ hidePromoted: e.target.checked });
  });

  elements.toggleHideNews.addEventListener("change", (e) => {
    saveState({ hideNews: e.target.checked });
  });

  elements.toggleHideSuggested.addEventListener("change", (e) => {
    saveState({ hideSuggested: e.target.checked });
  });
}

/**
 * Initializer
 */
function init() {
  renderThemeCards();
  renderAccentSwatches();
  bindEvents();
  verifyActiveTab();

  if (chrome?.storage?.sync) {
    chrome.storage.sync.get(DEFAULT_STATE, (stored) => {
      currentState = { ...DEFAULT_STATE, ...stored };
      updateUI();
    });
  } else {
    updateUI();
  }
}

document.addEventListener("DOMContentLoaded", init);
