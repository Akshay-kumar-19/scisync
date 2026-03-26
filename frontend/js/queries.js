function logout() {
    logoutUser();
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function isHiddenColumn(column) {
    return ["_id", "__v"].includes(column) || column.endsWith("_id") || column.endsWith("_ids");
}

function getDisplayColumns(rows) {
    const preferredOrder = [
        "project",
        "title",
        "school",
        "location",
        "theme",
        "mentor",
        "name",
        "visitor",
        "feedbackCount",
        "distinctProjects",
        "averageJudgeScore",
        "awardWinningProjects",
        "winningProjectCount",
        "totalScore",
        "avgJudge",
        "avgVisitor",
        "count"
    ];

    const available = Array.from(
        rows.reduce((set, row) => {
            Object.keys(row || {}).forEach((key) => {
                if (!isHiddenColumn(key)) {
                    set.add(key);
                }
            });
            return set;
        }, new Set())
    );

    const ordered = preferredOrder.filter((key) => available.includes(key));
    const remaining = available.filter((key) => !ordered.includes(key));
    return [...ordered, ...remaining];
}

function formatValue(value) {
    if (value === null || value === undefined || value === "") {
        return '<span class="muted-cell">-</span>';
    }

    if (Array.isArray(value)) {
        return value.length
            ? escapeHtml(value.map((item) => {
                if (typeof item !== "object" || !item) return item;
                return item.name || item.title || item.theme || JSON.stringify(item);
            }).join(", "))
            : '<span class="muted-cell">-</span>';
    }

    if (typeof value === "object") {
        if (value.name) return escapeHtml(value.name);
        if (value.title) return escapeHtml(value.title);
        return escapeHtml(JSON.stringify(value));
    }

    return escapeHtml(value);
}

function renderRows(title, data) {
    const area = document.getElementById("query-area");
    const rows = Array.isArray(data) ? data : data ? [data] : [];

    if (!rows.length) {
        area.innerHTML = `
            <h2>${escapeHtml(title)}</h2>
            <div class="empty-state">No results found.</div>
        `;
        return;
    }

    const headers = getDisplayColumns(rows);

    const head = headers
        .map((header) => `<th>${escapeHtml(header.replaceAll("_", " ").replace(/([a-z])([A-Z])/g, "$1 $2"))}</th>`)
        .join("");
    const body = rows
        .map((row) => {
            const cells = headers.map((header) => `<td>${formatValue(row?.[header])}</td>`).join("");
            return `<tr>${cells}</tr>`;
        })
        .join("");

    area.innerHTML = `
        <h2>${escapeHtml(title)}</h2>
        <div class="table-wrap">
            <table class="glass-table">
                <thead><tr>${head}</tr></thead>
                <tbody>${body}</tbody>
            </table>
        </div>
    `;
}

async function fetchQuery(path, title) {
    const area = document.getElementById("query-area");
    area.innerHTML = '<div class="empty-state">Running query...</div>';

    try {
        const response = await apiFetch(path);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        renderRows(title, data);
    } catch (error) {
        area.innerHTML = `<div class="error-state">${escapeHtml(error.message)}</div>`;
    }
}

function runQuery(num) {
    fetchQuery(`/api/queries/q${num}`, `Query ${num}`);
}

function loadQuery1() {
    apiFetch("/api/projects/themes")
        .then((res) => res.json())
        .then((themes) => {
            const options = themes.map((theme) => `<option value="${theme}">${theme}</option>`).join("");
            document.getElementById("query-area").innerHTML = `
                <h2>Projects by Theme</h2>
                <label>Select Theme</label>
                <select id="q1_theme">${options}</select>
                <button class="run-btn" onclick="runQuery1Results()">Run Query</button>
            `;
        });
}

function runQuery1Results() {
    const theme = document.getElementById("q1_theme").value;
    fetchQuery(`/api/queries/q1?theme=${encodeURIComponent(theme)}`, `Projects in ${theme}`);
}

function loadQuery7() {
    apiFetch("/api/projects/themes")
        .then((res) => res.json())
        .then((themes) => {
            const options = themes.map((theme) => `<option value="${theme}">${theme}</option>`).join("");

            document.getElementById("query-area").innerHTML = `
                <h2>Schools Participating in All Selected Themes</h2>
                <label>Select Themes</label>
                <select id="q7_themes" multiple>${options}</select>
                <button class="run-btn" onclick="runQuery7Results()">Run Query</button>
            `;
        });
}

function runQuery7Results() {
    const selected = Array.from(document.getElementById("q7_themes").selectedOptions).map((option) => option.value);
    const query = selected.length ? `?themes=${encodeURIComponent(selected.join(","))}` : "";
    fetchQuery(`/api/queries/q7${query}`, "Schools in selected themes");
}

function loadQuery8() {
    document.getElementById("query-area").innerHTML = `
        <h2>Visitors Who Gave Feedback More Than X Times</h2>
        <label>Enter X</label>
        <input type="number" id="q8_count">
        <button class="run-btn" onclick="runQuery8Results()">Run Query</button>
    `;
}

function runQuery8Results() {
    const count = document.getElementById("q8_count").value || "10";
    fetchQuery(`/api/queries/q8?count=${encodeURIComponent(count)}`, `Visitors above ${count}`);
}

function loadQuery9() {
    document.getElementById("query-area").innerHTML = `
        <h2>Projects with Judge and Visitor Ratings Above X</h2>

        <label>Judge Rating ></label>
        <input type="number" id="q9_judge">

        <label>Visitor Rating ></label>
        <input type="number" id="q9_visitor">

        <button class="run-btn" onclick="runQuery9Results()">Run Query</button>
    `;
}

function runQuery9Results() {
    const judge = document.getElementById("q9_judge").value || "9";
    const visitor = document.getElementById("q9_visitor").value || "9";
    fetchQuery(
        `/api/queries/q9?judge=${encodeURIComponent(judge)}&visitor=${encodeURIComponent(visitor)}`,
        `Projects above judge ${judge} and visitor ${visitor}`
    );
}
