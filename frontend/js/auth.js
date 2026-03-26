const API_BASE = localStorage.getItem("scienceFairApiBase") || "http://127.0.0.1:5000";

function getToken() {
    return localStorage.getItem("token");
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
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

    return response;
}

function logoutUser() {
    localStorage.removeItem("token");
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
