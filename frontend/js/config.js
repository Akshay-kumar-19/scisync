(function setSciSyncConfig() {
    const host = window.location.hostname;
    const isLocal = ["127.0.0.1", "localhost", ""].includes(host);
    const storedApiBase = localStorage.getItem("scienceFairApiBase");
    const configuredApiBase = window.__SCISYNC_API_BASE__ || storedApiBase;

    window.SCISYNC_CONFIG = {
        API_BASE: configuredApiBase || (isLocal ? "http://127.0.0.1:5000" : "https://scisync.vercel.app")
    };
})();
