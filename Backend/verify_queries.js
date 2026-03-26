const http = require('http');

const queries = [
    { id: 1, path: '/api/queries/q1', desc: 'Projects under Renewable Energy' },
    { id: 2, path: '/api/queries/q2', desc: 'School with most awards' },
    { id: 3, path: '/api/queries/q3', desc: 'Mentors guiding > 3 projects' },
    { id: 4, path: '/api/queries/q4', desc: 'Average judge score per theme' },
    { id: 5, path: '/api/queries/q5', desc: 'Projects with Best Innovation and Best Presentation' },
    { id: 6, path: '/api/queries/q6', desc: 'Projects with students under multiple mentors' },
    { id: 7, path: '/api/queries/q7', desc: 'Schools in all themes' },
    { id: 8, path: '/api/queries/q8', desc: 'Visitors feedback > 10 projects' },
    { id: 9, path: '/api/queries/q9', desc: 'Projects with Judge & Visitor ratings > 9' },
    { id: 10, path: '/api/queries/q10', desc: 'Most common theme among winners' },
    { id: 11, path: '/api/queries/q11', desc: 'Highest combined score' },
    { id: 12, path: '/api/queries/q12', desc: 'Schools with no awards' }
];

const runQuery = (q) => {
    return new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:5000${q.path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`\n--- Q${q.id}: ${q.desc} ---`);
                try {
                    const parsed = JSON.parse(data);
                    console.log(JSON.stringify(parsed, null, 2));
                    resolve();
                } catch (e) {
                    console.log("Error parsing JSON:", data);
                    resolve();
                }
            });
        }).on('error', (err) => {
            console.log(`Error calling ${q.path}:`, err.message);
            resolve();
        });
    });
};

const runAll = async () => {
    console.log("Starting Verification...");
    for (const q of queries) {
        await runQuery(q);
    }
    console.log("\nVerification Complete.");
};

runAll();
