# Angular Nx Monorepo

This is an Nx-based monorepo that contains multiple Angular applications and shared libraries. The current applications in this workspace are:

- **Inventory** (`apps/inventory`)
- **Cron Evaluator** (`apps/cron-evaluator`)
- **Angular Store** (`apps/angular-store`)

---

## 📦 Prerequisites

Ensure the following tools are installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) or `npm`
- [Nx CLI](https://nx.dev/cli) globally (optional but recommended)

npm install -g nx


🛠️ Installation & Setup
Clone the repository and install dependencies:

git clone <repo-url>
cd <repo-folder>
npm install

🚀 Running Applications
You can serve each application individually using:

Inventory App

npx nx run inventory:serve
Cron Evaluator App

npx nx run cron-evaluator:serve
Angular Store App

npx nx run angular-store:serve
To build any of the apps:

nx build <app-name>
# Example:
nx build inventory

🧠 Useful Nx Commands
Run Affected Projects
Useful after making a change to see what apps/libraries are impacted:

nx affected:apps
nx affected:libs
To serve/build/test affected projects:

nx affected:serve
nx affected:build
nx affected:test
View Dependency Graph
This opens a visual graph of the project dependencies in your default browser:

nx graph
