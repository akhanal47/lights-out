chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab?.url?.startsWith("http")) {
    document.getElementById("main").style.display = "none";
    document.getElementById("unavailable").style.display = "block";
    return;
  }

  const host = new URL(tab.url).hostname.replace(/^www\./, "");

  chrome.storage.local.get(["enabled", "simple"], ({ enabled = [], simple = [] }) => {
    let isEnabled = enabled.includes(host);
    let isSimple = simple.includes(host);

    render(isEnabled, isSimple);

    function toggle() {
      isEnabled = !isEnabled;
      const updatedEnabled = isEnabled
        ? [...enabled, host]
        : enabled.filter(h => h !== host);

      chrome.storage.local.set({ enabled: updatedEnabled }, () => {
        chrome.tabs.reload(tab.id);
        window.close();
      });
    }

    function toggleSimple() {
      isSimple = !isSimple;
      const updatedSimple = isSimple
        ? [...simple, host]
        : simple.filter(h => h !== host);

      chrome.storage.local.set({ simple: updatedSimple }, () => {
        chrome.tabs.reload(tab.id);
        window.close();
      });
    }

    document.getElementById("track").addEventListener("click", toggle);
    document.getElementById("broken-track").addEventListener("click", toggleSimple);
  });

  function render(isEnabled, isSimple) {
    const track = document.getElementById("track");
    const sub = document.getElementById("sub");
    const brokenRow = document.getElementById("broken-row");
    const brokenTrack = document.getElementById("broken-track");

    track.className = "track " + (isEnabled ? "on" : "");
    sub.textContent = isEnabled ? "Dark mode is on" : "Dark mode is off";

    brokenRow.style.display = isEnabled ? "flex" : "none";
    brokenTrack.className = "track " + (isSimple ? "on" : "");
  }
});