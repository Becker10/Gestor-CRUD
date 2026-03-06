# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Project setup

This repository contains a **Vite/React frontend** and an **Express + Prisma backend**.

### Development

1. Install dependencies in both packages:
   ```bash
   # from workspace root
   npm install        # frontend
   cd backend
   npm install        # backend
   ```
2. Prepare the database.  You can either push the schema directly or run a
   migration:
   ```bash
   cd backend
   npm run db:push     # creates tables without migration history
   # or to create and record a migration:
   npm run migrate
   ```
   After the first time this step, the database will already contain the
   `Product` table and the API will no longer throw the "table does not exist"
   error.
3. Start the backend API (with hot reload):
   ```bash
   cd backend
   npm run dev        # nodemon index.js listens on http://localhost:4000
   ```
4. In another terminal run the frontend dev server:
   ```bash
   cd ..              # back to workspace root
   npm run dev        # Vite starts on http://localhost:5173
   ```

   The React code uses a Vite proxy so requests to `/api/*` are forwarded
   to the backend automatically.  You can therefore fetch `/api/products`
   from your components without specifying the host.

### Production build

- Run `npm run build` from the workspace root.  The output will be placed
  in `backend/public` (configured via `vite.config.js`).
- Start the backend with `npm start` from the `backend` directory.  Express
  will serve the static frontend files as well as the API.

### Notes

- The backend uses SQLite via Prisma.  The database file lives in `backend`
  and migrations are stored under `backend/prisma/migrations`.
- CORS is enabled on the API, but the Vite proxy eliminates the need for it
  during development.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
