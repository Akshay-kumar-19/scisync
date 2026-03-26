const API_BASE = localStorage.getItem("scienceFairApiBase") || "http://127.0.0.1:5000";

function setStatus(message, type = "") {
    const element = document.getElementById("auth-status");
    element.textContent = message || "";
    element.className = `auth-status ${type}`.trim();
}

function switchMode(mode) {
    document.querySelectorAll(".auth-form").forEach((form) => form.classList.remove("active"));
    document.querySelectorAll(".auth-tab").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.mode === mode);
    });

    document.getElementById(`${mode}-form`).classList.add("active");
    setStatus("");
}

async function handleAuthRequest(path, body) {
    const response = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}

async function submitLogin(event) {
    event.preventDefault();

    try {
        const data = await handleAuthRequest("/api/users/login", {
            email: document.getElementById("login-email").value.trim(),
            password: document.getElementById("login-password").value
        });

        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } catch (error) {
        setStatus(error.message, "error");
    }
}

async function submitRegister(event) {
    event.preventDefault();

    try {
        const data = await handleAuthRequest("/api/users/register", {
            fullName: document.getElementById("register-name").value.trim(),
            email: document.getElementById("register-email").value.trim(),
            password: document.getElementById("register-password").value
        });

        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } catch (error) {
        setStatus(error.message, "error");
    }
}

async function submitForgotPassword(event) {
    event.preventDefault();

    try {
        const data = await handleAuthRequest("/api/users/forgot-password", {
            email: document.getElementById("forgot-email").value.trim()
        });

        const previewText = data.previewResetLink
            ? `\nLocal preview reset link:\n${data.previewResetLink}`
            : "";
        setStatus(`${data.message}${previewText}`, "success");
    } catch (error) {
        setStatus(error.message, "error");
    }
}

async function submitResetPassword(event) {
    event.preventDefault();

    try {
        const data = await handleAuthRequest("/api/users/reset-password", {
            email: document.getElementById("reset-email").value.trim(),
            token: document.getElementById("reset-token").value.trim(),
            password: document.getElementById("reset-password").value
        });

        setStatus(data.message, "success");
        switchMode("login");
    } catch (error) {
        setStatus(error.message, "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const email = params.get("email");
    const token = params.get("token");

    if (email) {
        const forgotInput = document.getElementById("forgot-email");
        const resetEmail = document.getElementById("reset-email");
        forgotInput.value = email;
        resetEmail.value = email;
    }

    if (token) {
        document.getElementById("reset-token").value = token;
    }

    if (mode && ["login", "register", "forgot", "reset"].includes(mode)) {
        switchMode(mode);
    }
});
