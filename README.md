# Fantasy Arena Game

A turn-based grid battle game built from scratch using an advanced modular architecture.

## Architecture Overview
This project uses a strict Monorepo design to guarantee separation of concerns:
- **`packages/core`**: Pure TypeScript. Contains the deterministic game state machine, rules, math, and core logic. Zero external UI/DOM/Database dependencies.
- **`packages/client`**: A lightweight web client built with React, Vite, and Tailwind CSS. It consumes `packages/core` for state management and features a greedy heuristic local AI bot.
- **`packages/server`**: A Node.js API built with Express. Provides a REST API for match result persistence, a leaderboard, and integrates the **Google Gemini API** for dynamic NPC Dungeon Master commentary.

## Running Locally (Natively)
Prerequisites: Node.js >= 20.x

1. Install dependencies from the root directory:
   ```bash
   npm install
   ```
2. Set up the environment variables:
   - Copy or create `.env` in `packages/server/.env` and add: `GEMINI_API_KEY=your_api_key_here`
3. Run the development servers in parallel:
   ```bash
   npm run dev -w @first-game/client
   npm run dev -w @first-game/server
   ```
4. Access the game at `http://localhost:5173`.

## Running with Docker (Production Ready)
We provide multi-stage, production-optimized Dockerfiles and a Compose file.

1. Create the `packages/server/.env` file with your `GEMINI_API_KEY`.
2. Spin up the cluster:
   ```bash
   docker compose up --build
   ```
3. Access the application:
   - **Frontend**: `http://localhost:8080`
   - **Backend API**: `http://localhost:3000`

## CI/CD Pipeline
This repository includes a fully configured **GitHub Actions** CI/CD pipeline (`.github/workflows/ci-cd.yml`):
- **Continuous Integration (CI)**: On every push or pull request to `main`, it runs TypeScript typechecking and native Vitest test suites.
- **Continuous Deployment (CD)**: On merge to `main`, if tests pass, it builds optimized Docker images for both `client` and `server` and pushes them to the **GitHub Container Registry (ghcr.io)**.
- **Automated Deployments**: It supports zero-cost deployments by pinging a `DEPLOY_HOOK_URL` (e.g., Render, Cloudflare) upon successful image push.
