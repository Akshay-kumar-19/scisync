function logout() {
    logoutUser();
}

function loadDeleteForm(type) {
    if (type === "student") return deleteStudentForm();
    if (type === "project") return deleteProjectForm();
    if (type === "mentor") return deleteMentorForm();
    if (type === "school") return deleteSchoolForm();
    if (type === "award") return deleteAwardForm();
    if (type === "visitor") return deleteVisitorForm();
}

function deleteStudentForm() {
    apiFetch("/api/students")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((student) => `<option value="${student._id}">${student.name}</option>`).join("");

            document.getElementById("delete-area").innerHTML = `
                <h2>Delete Student</h2>
                <label>Select Student</label>
                <select id="d_student">${options}</select>
                <button class="delete-btn" onclick="deleteStudent()">Delete</button>
            `;
        });
}

function deleteStudent() {
    const id = document.getElementById("d_student").value;
    apiFetch(`/api/students/${id}`, { method: "DELETE" })
        .then(() => alert("Student Deleted"))
        .catch(() => alert("Delete Failed"));
}

function deleteProjectForm() {
    apiFetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((project) => `<option value="${project._id}">${project.title}</option>`).join("");

            document.getElementById("delete-area").innerHTML = `
                <h2>Delete Project</h2>
                <label>Select Project</label>
                <select id="d_project">${options}</select>
                <button class="delete-btn" onclick="deleteProject()">Delete</button>
            `;
        });
}

function deleteProject() {
    const id = document.getElementById("d_project").value;
    apiFetch(`/api/projects/${id}`, { method: "DELETE" })
        .then(() => alert("Project Deleted"))
        .catch(() => alert("Delete Failed"));
}

function deleteMentorForm() {
    apiFetch("/api/mentors")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((mentor) => `<option value="${mentor._id}">${mentor.name}</option>`).join("");

            document.getElementById("delete-area").innerHTML = `
                <h2>Delete Mentor</h2>
                <label>Select Mentor</label>
                <select id="d_mentor">${options}</select>
                <button class="delete-btn" onclick="deleteMentor()">Delete</button>
            `;
        });
}

function deleteMentor() {
    const id = document.getElementById("d_mentor").value;
    apiFetch(`/api/mentors/${id}`, { method: "DELETE" })
        .then(() => alert("Mentor Deleted"))
        .catch(() => alert("Delete Failed"));
}

function deleteSchoolForm() {
    apiFetch("/api/schools")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((school) => `<option value="${school._id}">${school.name}</option>`).join("");

            document.getElementById("delete-area").innerHTML = `
                <h2>Delete School</h2>
                <label>Select School</label>
                <select id="d_school">${options}</select>
                <button class="delete-btn" onclick="deleteSchool()">Delete</button>
            `;
        });
}

function deleteSchool() {
    const id = document.getElementById("d_school").value;
    apiFetch(`/api/schools/${id}`, { method: "DELETE" })
        .then(() => alert("School Deleted"))
        .catch(() => alert("Delete Failed"));
}

function deleteAwardForm() {
    apiFetch("/api/awards")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((award) => `<option value="${award._id}">${award.award_name}</option>`).join("");

            document.getElementById("delete-area").innerHTML = `
                <h2>Delete Award</h2>
                <label>Select Award</label>
                <select id="d_award">${options}</select>
                <button class="delete-btn" onclick="deleteAward()">Delete</button>
            `;
        });
}

function deleteAward() {
    const id = document.getElementById("d_award").value;
    apiFetch(`/api/awards/${id}`, { method: "DELETE" })
        .then(() => alert("Award Deleted"))
        .catch(() => alert("Delete Failed"));
}

function deleteVisitorForm() {
    apiFetch("/api/visitors")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((visitor) => `<option value="${visitor._id}">${visitor.name}</option>`).join("");

            document.getElementById("delete-area").innerHTML = `
                <h2>Delete Visitor</h2>
                <label>Select Visitor</label>
                <select id="d_visitor">${options}</select>
                <button class="delete-btn" onclick="deleteVisitor()">Delete</button>
            `;
        });
}

function deleteVisitor() {
    const id = document.getElementById("d_visitor").value;
    apiFetch(`/api/visitors/${id}`, { method: "DELETE" })
        .then(() => alert("Visitor Deleted"))
        .catch(() => alert("Delete Failed"));
}
