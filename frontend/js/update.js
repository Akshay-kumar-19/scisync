function logout() {
    logoutUser();
}

function loadForm(type) {
    if (type === "student") loadStudentForm();
    if (type === "project") loadProjectForm();
    if (type === "mentor") loadMentorForm();
    if (type === "school") loadSchoolForm();
    if (type === "award") loadAwardForm();
    if (type === "visitor") loadVisitorForm();
}

function loadStudentForm() {
    apiFetch("/api/students")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((student) => `<option value="${student._id}">${student.name}</option>`).join("");

            document.getElementById("update-area").innerHTML = `
                <h2>Update Student</h2>

                <label>Select Student</label>
                <select id="u_id">${options}</select>

                <label>New Name</label>
                <input id="u_name" type="text">

                <label>New Class</label>
                <input id="u_class" type="text">

                <label>New School ID</label>
                <input id="u_school" type="text">

                <button class="save-btn" onclick="updateStudent()">Update</button>
            `;
        });
}

function updateStudent() {
    const id = document.getElementById("u_id").value;
    const body = {
        name: document.getElementById("u_name").value,
        class: document.getElementById("u_class").value,
        school_id: document.getElementById("u_school").value
    };

    apiFetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(() => alert("Student Updated"))
        .catch(() => alert("Update Failed"));
}

function loadProjectForm() {
    apiFetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((project) => `<option value="${project._id}">${project.title}</option>`).join("");

            document.getElementById("update-area").innerHTML = `
                <h2>Update Project</h2>

                <label>Select Project</label>
                <select id="p_id">${options}</select>

                <label>New Title</label>
                <input id="p_title" type="text">

                <label>New Theme</label>
                <input id="p_theme" type="text">

                <button class="save-btn" onclick="updateProject()">Update</button>
            `;
        });
}

function updateProject() {
    const id = document.getElementById("p_id").value;
    const body = {
        title: document.getElementById("p_title").value,
        theme: document.getElementById("p_theme").value
    };

    apiFetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(() => alert("Project Updated"))
        .catch(() => alert("Update Failed"));
}

function loadMentorForm() {
    apiFetch("/api/mentors")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((mentor) => `<option value="${mentor._id}">${mentor.name}</option>`).join("");

            document.getElementById("update-area").innerHTML = `
                <h2>Update Mentor</h2>

                <label>Select Mentor</label>
                <select id="m_id">${options}</select>

                <label>New Name</label>
                <input id="m_name" type="text">

                <label>New Specialization</label>
                <input id="m_specialization" type="text">

                <button class="save-btn" onclick="updateMentor()">Update</button>
            `;
        });
}

function updateMentor() {
    const id = document.getElementById("m_id").value;
    const body = {
        name: document.getElementById("m_name").value,
        specialization: document.getElementById("m_specialization").value
    };

    apiFetch(`/api/mentors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(() => alert("Mentor Updated"))
        .catch(() => alert("Update Failed"));
}

function loadSchoolForm() {
    apiFetch("/api/schools")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((school) => `<option value="${school._id}">${school.name}</option>`).join("");

            document.getElementById("update-area").innerHTML = `
                <h2>Update School</h2>

                <label>Select School</label>
                <select id="sc_id">${options}</select>

                <label>New Name</label>
                <input id="sc_name" type="text">

                <label>New Location</label>
                <input id="sc_location" type="text">

                <button class="save-btn" onclick="updateSchool()">Update</button>
            `;
        });
}

function updateSchool() {
    const id = document.getElementById("sc_id").value;
    const body = {
        name: document.getElementById("sc_name").value,
        location: document.getElementById("sc_location").value
    };

    apiFetch(`/api/schools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(() => alert("School Updated"))
        .catch(() => alert("Update Failed"));
}

function loadAwardForm() {
    apiFetch("/api/awards")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((award) => `<option value="${award._id}">${award.award_name}</option>`).join("");

            document.getElementById("update-area").innerHTML = `
                <h2>Update Award</h2>

                <label>Select Award</label>
                <select id="a_id">${options}</select>

                <label>New Award Name</label>
                <input id="a_title" type="text">

                <button class="save-btn" onclick="updateAward()">Update</button>
            `;
        });
}

function updateAward() {
    const id = document.getElementById("a_id").value;
    const body = {
        award_name: document.getElementById("a_title").value
    };

    apiFetch(`/api/awards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(() => alert("Award Updated"))
        .catch(() => alert("Update Failed"));
}

function loadVisitorForm() {
    apiFetch("/api/visitors")
        .then((res) => res.json())
        .then((data) => {
            const options = data.map((visitor) => `<option value="${visitor._id}">${visitor.name}</option>`).join("");

            document.getElementById("update-area").innerHTML = `
                <h2>Update Visitor</h2>

                <label>Select Visitor</label>
                <select id="v_id">${options}</select>

                <label>New Name</label>
                <input id="v_name" type="text">

                <label>New Feedback</label>
                <input id="v_fb" type="text">

                <button class="save-btn" onclick="updateVisitor()">Update</button>
            `;
        });
}

function updateVisitor() {
    const id = document.getElementById("v_id").value;
    const body = {
        name: document.getElementById("v_name").value,
        feedback: document.getElementById("v_fb").value
    };

    apiFetch(`/api/visitors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(() => alert("Visitor Updated"))
        .catch(() => alert("Update Failed"));
}
