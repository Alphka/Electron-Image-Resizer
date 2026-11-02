# Image Resizer

A small desktop app, built with Electron, for resizing a single image to a width and height you choose.

## Features

- Pick an image through a file dialog (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.tif`, `.tiff`).
- Width and height fields are pre-filled with the dimensions of the selected image and can be edited.
- Resizing is done with [sharp](https://sharp.pixelplumbing.com/), keeping the image's EXIF data and metadata.
- The result is written to an `image-resizer` folder inside the system temporary directory. Existing files are never overwritten: a numeric suffix is added, e.g. `photo (1).jpg`.
- The resized image opens automatically in the system's default application.
- Input is validated in the main process: absolute local path, supported extension, regular file up to 256 MiB, integer width/height from 1 to 16383.
- Success and error feedback through toast notifications.
- Application menu with `File > Quit` and `Help > About` (opens a small About window).

> [!NOTE]
> The image is resized to fit inside the given width x height box (sharp `fit: "inside"`): the aspect ratio is preserved and the image is never cropped, so one side can end up smaller than the value entered.

## Tech stack

- [Electron](https://www.electronjs.org/) 31 with [Electron Forge](https://www.electronforge.io/) 8 and its Vite plugin
- [Vite](https://vitejs.dev/) 5
- [React](https://react.dev/) 18, [React Router](https://reactrouter.com/) 6 (hash router) and [React Toastify](https://fkhadra.github.io/react-toastify/)
- [Tailwind CSS](https://tailwindcss.com/) 3 and [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [sharp](https://sharp.pixelplumbing.com/) for image processing
- [TypeScript](https://www.typescriptlang.org/) 5

## Requirements

- [Node.js](https://nodejs.org/) `>=22.18.0` and npm.
  - The Electron Forge 8 packages alone need Node.js 22.13.0.
- Git.
- To build installers, the tooling required by each Electron Forge maker used here: Squirrel (Windows), ZIP (macOS), RPM and DEB (Linux).

## Installation

```sh
git clone https://github.com/Alphka/Electron-Image-Resizer.git
cd Electron-Image-Resizer
npm install
```

## Usage

Start the app in development mode (Vite dev server with DevTools open):

```sh
npm start
```

Package the app for your current platform (output goes to `out/`):

```sh
npm run package
```

Create the distributable installers/archives for your platform:

```sh
npm run make
```

## Scripts

| Script            | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `npm start`       | Runs the app in development mode (`electron-forge start`). |
| `npm run package` | Packages the app without creating installers.              |
| `npm run make`    | Builds platform-specific distributables.                   |
| `npm run publish` | Runs `electron-forge publish`.                             |

There is no test script. To lint (ESLint and cspell) and type-check the project:

```sh
npm run lint
npx tsc --noEmit
```

## Security

The renderer runs with `contextIsolation` and `sandbox` enabled and `nodeIntegration` disabled. It can only call the three functions exposed by the preload script. The main process accepts resize requests only from the main window and re-validates the path and dimensions on every request.

## Project structure

```
src/
  main.ts            Electron main process: window, menu and the validated IPC handlers
  preload.ts         Exposes a minimal `window.imageResizer` API through contextBridge
  shared.ts          Constants, types and validation shared by main, preload and renderer
  index.tsx, App.tsx Renderer entry point and routes (/home, /about)
  pages/             Homepage (resize form) and About
forge.config.ts      Electron Forge config (makers, Vite plugin, fuses)
vite.*.config.ts     Vite configs for main, preload and renderer
```

## License

[ISC](LICENSE.md) © 2024 Kayo Souza
