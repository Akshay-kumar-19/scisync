const API_BASE = (window.SCISYNC_CONFIG && window.SCISYNC_CONFIG.API_BASE)
    || localStorage.getItem("scienceFairApiBase")
    || "http://127.0.0.1:5000";
const GET_CACHE_TTL_MS = 2 * 60 * 1000;

function getToken() {
    return localStorage.getItem("token");
}

function getCacheKey(path) {
    return `scisync-cache:${path}`;
}

function readCachedResponse(path) {
    try {
        const raw = sessionStorage.getItem(getCacheKey(path));
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp > GET_CACHE_TTL_MS) {
            sessionStorage.removeItem(getCacheKey(path));
            return null;
        }

        return new Response(JSON.stringify(parsed.data), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch {
        return null;
    }
}

async function writeCachedResponse(path, response) {
    try {
        const cloned = response.clone();
        const contentType = cloned.headers.get("Content-Type") || "";
        if (!contentType.includes("application/json")) return;

        const data = await cloned.json();
        sessionStorage.setItem(getCacheKey(path), JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    } catch {
        // Ignore cache write failures.
    }
}

function invalidateApiCache() {
    try {
        Object.keys(sessionStorage)
            .filter((key) => key.startsWith("scisync-cache:"))
            .forEach((key) => sessionStorage.removeItem(key));
    } catch {
        // Ignore cache cleanup failures.
    }
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const method = (options.method || "GET").toUpperCase();
    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (method === "GET") {
        const cached = readCachedResponse(path);
        if (cached) {
            return cached;
        }
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        if (!window.location.pathname.endsWith("login.html")) {
            window.location.href = "login.html";
        }
        throw new Error("Session expired. Please log in again.");
    }

    if (method === "GET" && response.ok) {
        writeCachedResponse(path, response);
    } else if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && response.ok) {
        invalidateApiCache();
    }

    return response;
}

function logoutUser() {
    localStorage.removeItem("token");
    invalidateApiCache();
    window.location.href = "login.html";
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = "login.html";
    }
}

window.API_BASE = API_BASE;
window.apiFetch = apiFetch;
window.logoutUser = logoutUser;
window.requireAuth = requireAuth;

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.protected === "true") {
        requireAuth();
    }
});
