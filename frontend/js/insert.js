function logout() {
    logoutUser();
}

function showForm(type) {
    if (type === "student") return loadStudentForm();
    if (type === "project") return loadProjectForm();
    if (type === "mentor") return loadMentorForm();
    if (type === "school") return loadSchoolForm();
    if (type === "award") return loadAwardForm();
    if (type === "visitor") return loadVisitorForm();
    if (type === "judge") return loadJudgeForm();
    if (type === "vrating") return loadVisitorRatingForm();
}

function loadStudentForm() {
    apiFetch("/api/schools")
        .then((res) => res.json())
        .then((schools) => {
            const options = schools.map((school) => `<option value="${school._id}">${school.name}</option>`).join("");

            document.getElementById("form-area").innerHTML = `
                <h2>Insert Student</h2>

                <label>Name</label>
                <input id="s_name" type="text">

                <label>Class</label>
                <input id="s_class" type="text">

                <label>Select School</label>
                <select id="s_school">${options}</select>

                <button class="save-btn" onclick="saveStudent()">Save</button>
            `;
        });
}

function saveStudent() {
    sendPost("/api/students", {
        name: document.getElementById("s_name").value,
        class: document.getElementById("s_class").value,
        school_id: document.getElementById("s_school").value
    });
}

function loadProjectForm() {
    Promise.all([
        apiFetch("/api/mentors").then((res) => res.json()),
        apiFetch("/api/students").then((res) => res.json()),
        apiFetch("/api/schools").then((res) => res.json())
    ]).then(([mentors, students, schools]) => {
        const mentorOptions = mentors.map((mentor) => `<option value="${mentor._id}">${mentor.name}</option>`).join("");
        const studentOptions = students.map((student) => `<option value="${student._id}">${student.name}</option>`).join("");
        const schoolOptions = schools.map((school) => `<option value="${school._id}">${school.name}</option>`).join("");

        document.getElementById("form-area").innerHTML = `
            <h2>Insert Project</h2>

            <label>Title</label>
            <input id="p_title" type="text">

            <label>Theme</label>
            <input id="p_theme" type="text">

            <label>Select School</label>
            <select id="p_school">${schoolOptions}</select>

            <label>Select Mentor</label>
            <select id="p_mentor">${mentorOptions}</select>

            <label>Select Student</label>
            <select id="p_student">${studentOptions}</select>

            <button class="save-btn" onclick="saveProject()">Save</button>
        `;
    });
}

function saveProject() {
    sendPost("/api/projects", {
        title: document.getElementById("p_title").value,
        theme: document.getElementById("p_theme").value,
        school_id: document.getElementById("p_school").value,
        mentor_ids: [document.getElementById("p_mentor").value],
        student_ids: [document.getElementById("p_student").value]
    });
}

function loadMentorForm() {
    document.getElementById("form-area").innerHTML = `
        <h2>Insert Mentor</h2>

        <label>Name</label>
        <input id="m_name" type="text">

        <label>Specialization</label>
        <input id="m_specialization" type="text">

        <button class="save-btn" onclick="saveMentor()">Save</button>
    `;
}

function saveMentor() {
    sendPost("/api/mentors", {
        name: document.getElementById("m_name").value,
        specialization: document.getElementById("m_specialization").value
    });
}

function loadSchoolForm() {
    document.getElementById("form-area").innerHTML = `
        <h2>Insert School</h2>

        <label>Name</label>
        <input id="sc_name" type="text">

        <label>Location</label>
        <input id="sc_location" type="text">

        <button class="save-btn" onclick="saveSchool()">Save</button>
    `;
}

function saveSchool() {
    sendPost("/api/schools", {
        name: document.getElementById("sc_name").value,
        location: document.getElementById("sc_location").value
    });
}

function loadAwardForm() {
    apiFetch("/api/projects")
        .then((res) => res.json())
        .then((projects) => {
            const options = projects.map((project) => `<option value="${project._id}">${project.title}</option>`).join("");

            document.getElementById("form-area").innerHTML = `
                <h2>Insert Award</h2>

                <label>Award Name</label>
                <input id="a_title" type="text">

                <label>Select Project</label>
                <select id="a_project">${options}</select>

                <button class="save-btn" onclick="saveAward()">Save</button>
            `;
        });
}

function saveAward() {
    sendPost("/api/awards", {
        award_name: document.getElementById("a_title").value,
        project_id: document.getElementById("a_project").value
    });
}

function loadVisitorForm() {
    document.getElementById("form-area").innerHTML = `
        <h2>Insert Visitor</h2>

        <label>Name</label>
        <input id="v_name" type="text">

        <label>Feedback</label>
        <input id="v_fb" type="text">

        <button class="save-btn" onclick="saveVisitor()">Save</button>
    `;
}

function saveVisitor() {
    sendPost("/api/visitors", {
        name: document.getElementById("v_name").value,
        feedback: document.getElementById("v_fb").value
    });
}

function loadJudgeForm() {
    apiFetch("/api/projects")
        .then((res) => res.json())
        .then((projects) => {
            const options = projects.map((project) => `<option value="${project._id}">${project.title}</option>`).join("");

            document.getElementById("form-area").innerHTML = `
                <h2>Insert Judge Score</h2>

                <label>Select Project</label>
                <select id="j_project">${options}</select>

                <label>Judge Name</label>
                <input id="j_name" type="text">

                <label>Score (0-10)</label>
                <input id="j_score" type="number" min="0" max="10">

                <button class="save-btn" onclick="saveJudge()">Save</button>
            `;
        });
}

function saveJudge() {
    sendPost("/api/judges", {
        projectId: document.getElementById("j_project").value,
        judgeName: document.getElementById("j_name").value,
        score: document.getElementById("j_score").value
    });
}

function loadVisitorRatingForm() {
    apiFetch("/api/projects")
        .then((res) => res.json())
        .then((projects) => {
            const options = projects.map((project) => `<option value="${project._id}">${project.title}</option>`).join("");

            document.getElementById("form-area").innerHTML = `
                <h2>Insert Visitor Rating</h2>

                <label>Select Project</label>
                <select id="vr_project">${options}</select>

                <label>Visitor Name</label>
                <input id="vr_name" type="text">

                <label>Feedback</label>
                <input id="vr_feedback" type="text">

                <label>Rating (0-10)</label>
                <input id="vr_rating" type="number" min="0" max="10">

                <button class="save-btn" onclick="saveVisitorRating()">Save</button>
            `;
        });
}

function saveVisitorRating() {
    sendPost("/api/visitors", {
        projectId: document.getElementById("vr_project").value,
        name: document.getElementById("vr_name").value,
        feedback: document.getElementById("vr_feedback").value,
        rating: document.getElementById("vr_rating").value
    });
}

function sendPost(route, body) {
    apiFetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(async (response) => {
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || error.message || "Insert failed");
            }

            alert("Inserted successfully");
        })
        .catch((error) => alert(error.message));
}
