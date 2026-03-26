# SciSync Vercel Deployment

This project is prepared to deploy as two Vercel projects:

1. `Backend`
2. `frontend`

## 1. Deploy MongoDB first

Use MongoDB Atlas and create a database connection string.

Example:

`mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority`

## 2. Deploy the Backend project

Create a new Vercel project and set:

- Root Directory: `Backend`
- Framework Preset: `Other`

Add these environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `APP_BASE_URL`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SMTP_HOST` optional
- `SMTP_PORT` optional
- `SMTP_SECURE` optional
- `SMTP_USER` optional
- `SMTP_PASS` optional
- `SMTP_FROM` optional

Set `APP_BASE_URL` to your frontend production URL plus `/login`.

Deploy the backend and copy the production URL.

Example:

`https://scisync-api.vercel.app`

## 3. Update the frontend API base

Open:

`frontend/js/config.js`

Replace:

`https://replace-with-your-backend-url.vercel.app`

with your real backend URL, for example:

`https://scisync-api.vercel.app`

## 4. Deploy the Frontend project

Create another Vercel project and set:

- Root Directory: `frontend`
- Framework Preset: `Other`

Deploy it.

The frontend routes are already configured in:

`frontend/vercel.json`

You will get routes like:

- `/login`
- `/dashboard`
- `/insert`
- `/update`
- `/delete`
- `/queries`

## 5. Bootstrap the admin account

After backend deploy, open the backend once so it starts with the configured env vars.

Then register from the frontend UI, or keep using the configured admin values.

## Notes

- Backend and frontend are separate Vercel projects
- Frontend talks to backend using the URL in `frontend/js/config.js`
- If you change backend URL later, update `frontend/js/config.js` and redeploy frontend
- If you change backend env vars, redeploy backend
