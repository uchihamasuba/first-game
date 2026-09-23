# Fantasy Arena Game

[![CI/CD Pipeline](https://github.com/uchihamasuba/first-game/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/uchihamasuba/first-game/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen.svg)](https://nodejs.org)

> 🎮 **Live Demo:** [https://first-game-client.vercel.app](https://first-game-client.vercel.app)  
> 🔗 **Backend API:** [https://first-game-server-7mz6.onrender.com](https://first-game-server-7mz6.onrender.com)

A turn-based grid battle game built from scratch demonstrating end-to-end modern software engineering, web development, AI integration, and automated CI/CD workflows.

## Architecture Overview
This project uses a strict Monorepo design to guarantee separation of concerns:
- **`packages/core`**: Pure TypeScript. Contains the deterministic game state machine, rules, math, and core logic. Zero external UI/DOM/Database dependencies.
- **`packages/client`**: A lightweight web client built with React, Vite, and Tailwind CSS. It consumes `packages/core` for state management and features a greedy heuristic local AI bot.
- **`packages/server`**: A Node.js API built with Express. Provides a REST API for match result persistence, a leaderboard, and integrates the **Google Gemini API** for dynamic NPC Dungeon Master commentary.

## ⚙️ Environment Variables

### Backend (`packages/server/.env`)
| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google AI Studio API key for NPC battle commentary | Yes | — |
| `PORT` | HTTP port for the backend service | No | `3000` (or `10000` on Render) |
| `NODE_ENV` | Application environment (`development` / `production`) | No | `development` |

### Frontend (`packages/client/.env`)
| Variable | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `VITE_SERVER_URL` | Public backend URL (used by browser API calls) | Yes | `http://localhost:3000` |

## 🧪 Running Tests

The test suite covers the deterministic game engine and backend endpoints:

```bash
# Run tests for core game logic
npm test --workspace=@first-game/core

# Run tests for backend REST APIs
npm test --workspace=@first-game/server
```

## 💻 Running Locally (Natively)
Prerequisites: Node.js >= 20.x

1. Install dependencies from the root directory:
   ```bash
   npm install
   ```
2. Set up the environment variables:
   
   Create a `.env` file in `packages/server/.env`: 
   ```environment
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```
3. Start services concurrently:
   ```bash
   npm run dev -w @first-game/client
   npm run dev -w @first-game/server
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## 🐳 Running with Docker (Production Ready)
Multi-stage, production-optimized Dockerfiles are provided for both client and server containers.

1. Ensure your `packages/server/.env` file contains your `GEMINI_API_KEY`.
2. Start the cluster using Docker Compose:
   ```bash
   docker compose up --build
   ```
3. Access the services:
   - **Frontend Web Game**: `http://localhost:8080`
   - **Backend REST API**: `http://localhost:3000`

## 🔄 CI/CD Pipeline
The repository includes an automated GitHub Actions pipeline (`.github/workflows/ci-cd.yml`):
1. **Continuous Integration (CI)**: 
   - Triggered on every push or pull request to the `main` branch.
   - Executes static typechecking (`tsc --noEmit`) and Vitest test suites.
2. **Continuous Deployment (CD)**: 
   - Runs exclusively upon successful merge to `main`.
   - Builds multi-stage Docker images for both `client` and `server`.
   - Pushes version-tagged images directly to the GitHub Container Registry (ghcr.io).
3. **Automated Cloud Sync:**: 
   - Automatically triggers zero-downtime deployments to hosting providers (Render / Vercel) via secure deploy webhooks.