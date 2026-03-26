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

function getDisplayColumns(items) {
    const preferredOrder = [
        "title",
        "name",
        "class",
        "location",
        "theme",
        "specialization",
        "award_name",
        "judgeName",
        "score",
        "feedback",
        "rating",
        "school",
        "schoolName",
        "visitor",
        "project",
        "averageJudgeScore",
        "awardWinningProjects",
        "winningProjectCount",
        "totalScore",
        "feedbackCount",
        "distinctProjects"
    ];

    const available = Array.from(
        items.reduce((set, row) => {
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
        if (value.length === 0) {
            return '<span class="muted-cell">-</span>';
        }

        return escapeHtml(
            value
                .map((item) => {
                    if (typeof item !== "object" || !item) return item;
                    return item.name || item.title || item.theme || JSON.stringify(item);
                })
                .join(", ")
        );
    }

    if (typeof value === "object") {
        if (value.name) return escapeHtml(value.name);
        if (value.title) return escapeHtml(value.title);
        return escapeHtml(JSON.stringify(value));
    }

    return escapeHtml(value);
}

function renderTable(title, rows) {
    const view = document.getElementById("view-area");
    const items = Array.isArray(rows) ? rows : [];

    if (!items.length) {
        view.innerHTML = `
            <h2>${escapeHtml(title)}</h2>
            <div class="empty-state">No records found.</div>
        `;
        return;
    }

    const columns = getDisplayColumns(items);

    const headerHtml = columns
        .map((column) => `<th>${escapeHtml(column.replaceAll("_", " ").replace(/([a-z])([A-Z])/g, "$1 $2"))}</th>`)
        .join("");

    const rowsHtml = items
        .map((row) => {
            const cells = columns
                .map((column) => `<td>${formatValue(row?.[column])}</td>`)
                .join("");
            return `<tr>${cells}</tr>`;
        })
        .join("");

    view.innerHTML = `
        <h2>${escapeHtml(title)}</h2>
        <div class="table-wrap">
            <table class="glass-table">
                <thead>
                    <tr>${headerHtml}</tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;
}

async function viewData(type) {
    const view = document.getElementById("view-area");
    view.innerHTML = '<div class="empty-state">Loading data...</div>';

    try {
        const response = await apiFetch(`/api/${type}`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        renderTable(type.toUpperCase(), data);
    } catch (error) {
        view.innerHTML = `<div class="error-state">${escapeHtml(error.message)}</div>`;
    }
}
