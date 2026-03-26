// Load dropdown data
async function loadDropdowns() {
  const schools = await apiFetch(`/api/schools`).then(r => r.json());
  const mentors = await apiFetch(`/api/mentors`).then(r => r.json());
  const projects = await apiFetch(`/api/projects`).then(r => r.json());

  let schoolDD = document.getElementById("schoolDropdown");
  let mentorDD = document.getElementById("mentorDropdown");
  let updateDD = document.getElementById("projectDropdownUpdate");
  let deleteDD = document.getElementById("projectDropdownDelete");

  schoolDD.innerHTML = `<option value="">Select School</option>`;
  schools.forEach(s => schoolDD.innerHTML += `<option value="${s._id}">${s.name}</option>`);

  mentorDD.innerHTML = "";
  mentors.forEach(m => mentorDD.innerHTML += `<option value="${m._id}">${m.name}</option>`);

  updateDD.innerHTML = "";
  deleteDD.innerHTML = "";
  projects.forEach(p => {
    updateDD.innerHTML += `<option value="${p._id}">${p.title}</option>`;
    deleteDD.innerHTML += `<option value="${p._id}">${p.title}</option>`;
  });
}

// Switch tabs
function openTab(event, tabId) {
  document.querySelectorAll(".tabContent").forEach(t => t.style.display = "none");
  document.getElementById(tabId).style.display = "block";

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  event.target.classList.add("active");

  loadDropdowns();
}

// Insert Project
async function insertProject() {
  let data = {
    title: document.getElementById("projectTitle").value,
    theme: document.getElementById("theme").value,
    school_id: document.getElementById("schoolDropdown").value,
    mentor_ids: Array.from(document.getElementById("mentorDropdown").selectedOptions).map(o => o.value)
  };

  await apiFetch(`/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("Inserted!");
  loadDropdowns();
}

// Update Project
async function updateProject() {
  let id = document.getElementById("projectDropdownUpdate").value;

  let data = {
    title: document.getElementById("updateTitle").value,
    theme: document.getElementById("updateTheme").value
  };

  await apiFetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("Updated!");
  loadDropdowns();
}

// Delete Project
async function deleteProject() {
  let id = document.getElementById("projectDropdownDelete").value;

  await apiFetch(`/api/projects/${id}`, { method: "DELETE" });

  alert("Deleted!");
  loadDropdowns();
}

// Initial load
loadDropdowns();
