const API = "http://127.0.0.1:5000/api";

/* Utility: Set section title */
function setTitle(text) {
  document.getElementById("section-title").innerText = text;
}

/* Utility: Clear content area */
function clearContent() {
  document.getElementById("content-area").innerHTML = "";
}

/* Utility: Render HTML inside content */
function render(html) {
  document.getElementById("content-area").innerHTML = html;
}

/* ============================
async function loadProjects() {
  setTitle("Projects");
  clearContent();

  let projects = await fetch(`${API}/projects`).then(r => r.json());
  let mentors = await fetch(`${API}/mentors`).then(r => r.json());
  let schools = await fetch(`${API}/schools`).then(r => r.json());
  let awards = await fetch(`${API}/awards`).then(r => r.json());

  // Convert ID → Name
  const getSchool = id => schools.find(s => s._id === id)?.name || "Unknown";
  const getMentors = arr =>
    arr.map(id => mentors.find(m => m._id === id)?.name || "Unknown").join(", ");
  const getAwards = pid =>
    awards.filter(a => a.project_id === pid).map(a => a.award_type).join(", ");

  let table = `
    <table class="glass-table">
      <tr>
        <th>Title</th>
        <th>Theme</th>
        <th>School</th>
        <th>Mentors</th>
        <th>Awards</th>
      </tr>
  `;

  projects.forEach(p => {
    table += `
      <tr>
        <td>${p.title}</td>
        <td>${p.theme}</td>
        <td>${getSchool(p.school_id)}</td>
        <td>${getMentors(p.mentor_ids)}</td>
        <td>${getAwards(p._id)}</td>
      </tr>
    `;
  });

  table += `</table>`;
  render(table);
}

/* ============================
   GENERIC SIMPLE TABLE LOADER
============================ */
function buildTable(headers, rows) {
  let table = `<table class="glass-table"><tr>`;
  headers.forEach(h => table += `<th>${h}</th>`);
  table += `</tr>`;

  rows.forEach(r => {
    table += `<tr>`;
    r.forEach(col => table += `<td>${col}</td>`);
    table += `</tr>`;
  });

  table += `</table>`;
  return table;
}

/* ============================
   LOAD MENTORS
============================ */
async function loadMentors() {
  setTitle("Mentors");
  clearContent();

  let data = await fetch(`${API}/mentors`).then(r => r.json());
  let rows = data.map(m => [m.name, m.qualification, m.email, m.phone, m.school]);

  render(buildTable(["Name", "Qualification", "Email", "Phone", "School"], rows));
}

/* ============================
   LOAD SCHOOLS
============================ */
async function loadSchools() {
  setTitle("Schools");
  clearContent();

  let data = await fetch(`${API}/schools`).then(r => r.json());
  let rows = data.map(s => [s.name, s.city, s.email, s.phone, s.address]);

  render(buildTable(["Name", "City", "Email", "Phone", "Address"], rows));
}

/* ============================
   LOAD STUDENTS
============================ */
async function loadStudents() {
  setTitle("Students");
  clearContent();

  let data = await fetch(`${API}/students`).then(r => r.json());
  let rows = data.map(s => [s.name, s.class, s.school]);

  render(buildTable(["Name", "Class", "School"], rows));
}

/* ============================
   LOAD VISITORS
============================ */
async function loadVisitors() {
  setTitle("Visitors");
  clearContent();

  let data = await fetch(`${API}/visitors`).then(r => r.json());
  let rows = data.map(v => [v.name, v.email, v.phone, v.feedback_given]);

  render(buildTable(["Name", "Email", "Phone", "Feedback Count"], rows));
}

/* ============================
   LOAD AWARDS
============================ */
async function loadAwards() {
  setTitle("Awards");
  clearContent();

  let data = await fetch(`${API}/awards`).then(r => r.json());
  let rows = data.map(a => [a.project_id, a.award_type, a.theme]);

  render(buildTable(["Project ID", "Award Type", "Theme"], rows));
}

/* ============================
   LOAD JUDGES
============================ */
async function loadJudges() {
  setTitle("Judges");
  clearContent();

  let data = await fetch(`${API}/judges`).then(r => r.json());
  let rows = data.map(j => [j.name, j.theme, j.email, j.phone]);

  render(buildTable(["Name", "Theme", "Email", "Phone"], rows));
}
