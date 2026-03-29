const host = location.hostname.replace(/^www\./, "");

chrome.storage.local.get(["enabled", "simple"], ({ enabled = [], simple = [] }) => {
  if (!enabled.includes(host)) return;

  const style = document.createElement("style");
  style.textContent = simple.includes(host) ? partialDark() : fullDark();
  document.documentElement.appendChild(style);
});

function partialDark() {
  return `
    html, body {
      background-color: #121212 !important;
      color: #e8e8e8 !important;
    }
    a { color: #8ab4f8 !important; }

    [class*="dark-grey"], [class*="graphite"], [class*="text-module"], [class*="title"] {
      color: #e8e8e8 !important;
    }
    
    [class*="context-widget-module"], [class*="summary-module"], [data-testid="ContextWidget"], [data-testid="TabContainer"] {
      background-color: #1d1d1d !important;
      background-image: none !important;
    }

  `;
}

function fullDark() {
  return `
    html, body, body * {
      background-color: #121212 !important;
      color: #e8e8e8 !important;
      border-color: #444 !important;
      box-shadow: none !important;
    }
    a { color: #8ab4f8 !important; }
    img, video, picture, canvas, svg {
      background-color: transparent !important;
    }
  `;
}