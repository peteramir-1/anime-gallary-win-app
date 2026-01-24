# Anime Gallery (Angular + Electron)

Frontend Angular application bundled with an Electron backend for serving local media and a GraphQL API.

## Overview

This repository contains an Angular front-end app (the UI) and an Electron-based backend (local server, file serving and GraphQL API) packaged together as a desktop application.

- Frontend: Angular (21) app in the repository root `src` folder.
- Backend: Electron app and server code in the `anime-gallery-electron` folder.

## Key Features

- Responsive Angular UI with video playback using `video.js` and playlist UI.
- Local file serving (pictures/videos) through the Electron backend.
- GraphQL API used by the frontend; codegen configured to generate types and services.
- The build outputs are placed into the Electron app views so the app can be packaged and distributed.

## Tech Stack

- Angular 21
- Electron (backend app in `anime-gallery-electron`)
- GraphQL (Apollo client & server)
- TailwindCSS + custom plugins
- Video.js and related plugins

## Repository Structure

- [src](src) — Angular application source (components, modules, assets, styles).
- [anime-gallery-electron](anime-gallery-electron) — Electron app, server, GraphQL schema and view output.
- [codegen.ts](codegen.ts) — GraphQL Code Generator config.
- [package.json](package.json) — top-level scripts for frontend and backend workflows.

See also: `angular.json`, `tsconfig.json`, and Tailwind config `tailwind.config.ts` for build config.

## Prerequisites

- Node.js (recommended LTS).
- npm (or Yarn).

## Quick start (development)

1. Install dependencies:

```bash
npm install
```

2. Run the frontend dev server:

```bash
npm run frontend:start
```

3. Build the frontend for development and start the Electron backend (runs build then starts Electron):

```bash
npm run backend:start:electron
```

Alternatively run the Apollo-backed backend after building the frontend:

```bash
npm run backend:start:apollo
```

## Common scripts

- Start Angular dev server: `npm run frontend:start`
- Build frontend (development): `npm run frontend:dev:build`
- Build frontend (production): `npm run frontend:prod:build`
- Watch builds: `npm run frontend:dev:watch` / `npm run frontend:prod:watch`
- Run tests: `npm run frontend:test`
- Lint & type-check: `npm run frontend:lint`
- Run GraphQL codegen: `npm run frontend:codegen`

Electron packaging and publishing are proxied into the `anime-gallery-electron` package via these scripts:

- `npm run compile` — compile electron app
- `npm run package` — create distributable packages
- `npm run make` — run makers (Electron Forge / makers)
- `npm run publish` — publish packaged app

These commands execute `npm` scripts inside the `anime-gallery-electron` folder; see [anime-gallery-electron/package.json](anime-gallery-electron/package.json) for the backend-specific commands.

## GraphQL Codegen

The repository includes `codegen.ts` configured to generate TypeScript types and Apollo Angular services.

```bash
npm run frontend:codegen
```

Generated files are configured to go into `src/app/core/services/graphql.service.ts` and the introspection JSON under `src/app/core/graphql/schema`.

## Build & Package (production)

1. Build the frontend for production:

```bash
npm run frontend:prod:build
```

2. Package the Electron app (from top-level):

```bash
npm run package
```

Or run the full publish flow which delegates to the Electron package scripts:

```bash
npm run publish
```

## Project notes

- The Angular build output target in `angular.json` is set to `./anime-gallery-electron/app/views`, so builds are copied directly into the Electron app view folder for packaging.
- The Electron backend contains TypeScript sources under `anime-gallery-electron/src` and JS compiled outputs under `anime-gallery-electron/app`.
- Static assets (icons, pictures, scss) are under `src/assets` and `anime-gallery-electron/app/assets` for packaged views.

## Contributing

1. Fork the repo and create a feature branch.
2. Run `npm install` and follow the development steps above.
3. Ensure linting and tests pass before opening a PR.

## License

This project is licensed under the MIT License. See [package.json](package.json) for author details.
