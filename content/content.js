/**
 * LinkedIn Theme Studio - Content Script
 * Applies theme variables, custom accents, and handles decluttering in real-time.
 */

(() => {
  const DEFAULT_CONFIG = {
    themeEnabled: true,
    activeTheme: "midnight-blue",
    customAccent: "",
    hidePromoted: true,
    hideNews: true,
    hideSuggested: false,
  };

  /**
   * Apply settings directly to <html> element
   */
  function applySettings(settings) {
    const root = document.documentElement;
    if (!root) return;

    const enabled = settings.themeEnabled ?? DEFAULT_CONFIG.themeEnabled;
    root.setAttribute("data-theme-enabled", String(enabled));

    const theme = settings.activeTheme || DEFAULT_CONFIG.activeTheme;
    root.setAttribute("data-linkedin-theme", theme);

    const hidePromoted = settings.hidePromoted ?? DEFAULT_CONFIG.hidePromoted;
    root.setAttribute("data-hide-promoted", String(hidePromoted));

    const hideNews = settings.hideNews ?? DEFAULT_CONFIG.hideNews;
    root.setAttribute("data-hide-news", String(hideNews));

    const hideSuggested = settings.hideSuggested ?? DEFAULT_CONFIG.hideSuggested;
    root.setAttribute("data-hide-suggested", String(hideSuggested));

    const accent = settings.customAccent || "";
    if (accent) {
      root.style.setProperty("--lts-custom-accent", accent);
    } else {
      root.style.removeProperty("--lts-custom-accent");
    }
  }

  /**
   * Initialize settings from browser storage
   */
  function init() {
    if (!chrome?.storage?.sync) return;

    chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
      applySettings(items);
    });

    // Real-time listener for popup adjustments without page reload
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "sync") return;

      chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
        applySettings(items);
      });
    });

    observeSponsoredFeed();
  }

  /**
   * Non-destructive observer to mark sponsored/promoted feed items dynamically
   */
  function observeSponsoredFeed() {
    const markSponsored = (container) => {
      if (!container || typeof container.querySelectorAll !== "function") return;
      const updates = container.querySelectorAll(
        ".feed-shared-update-v2:not([data-lts-sponsored])"
      );
      updates.forEach((el) => {
        const text = el.innerText || "";
        const isPromoted =
          /promoted|sponsored|advertisement/i.test(text.slice(0, 400)) ||
          el.querySelector('[aria-label*="Promoted"], [aria-label*="Sponsored"]');

        if (isPromoted) {
          el.setAttribute("data-lts-sponsored", "true");
        }
      });
    };

    const startObserver = () => {
      markSponsored(document.body);

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              markSponsored(node);
            }
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    };

    if (document.body) {
      startObserver();
    } else {
      document.addEventListener("DOMContentLoaded", startObserver);
    }
  }

  init();
})();
