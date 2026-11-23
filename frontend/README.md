# SAARTHI AI frontend

Responsive React + Vite frontend for the SAARTHI AI campus assistant. It includes a dashboard, campus AI chat, group list, expense tracker placeholder, bus tracking preview, and login/signup screens.

## Run locally

```sh
npm install
npm run dev
```

The chat page sends `POST /chat/` requests to `http://localhost:8000` by default. Set `VITE_API_URL` in a frontend `.env` file to use another backend origin:

```sh
VITE_API_URL=http://localhost:8000
```

Tailwind CSS v4 is enabled through the Vite plugin. Authentication, group management, expenses, and live bus data are UI scaffolds and need service integrations before production use.
