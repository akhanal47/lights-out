chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab?.url?.startsWith("http")) {
    document.getElementById("main").style.display = "none";
    document.getElementById("unavailable").style.display = "block";
    return;
  }

  const host = new URL(tab.url).hostname.replace(/^www\./, "");

  chrome.storage.local.get("enabled", ({ enabled = [] }) => {
    let isEnabled = enabled.includes(host);
    render(isEnabled);

    function toggle() {
      isEnabled = !isEnabled;
      const updated = isEnabled
        ? [...enabled, host]
        : enabled.filter(h => h !== host);

      chrome.storage.local.set({ enabled: updated }, () => {
        chrome.tabs.reload(tab.id);
        window.close();
      });
    }

    document.getElementById("track").addEventListener("click", toggle);
  });

  function render(isEnabled) {
    const track = document.getElementById("track");
    const sub = document.getElementById("sub");

    track.className = "track " + (isEnabled ? "on" : "");
    sub.textContent = isEnabled ? "Dark mode is on" : "Dark mode is off";
  }
});