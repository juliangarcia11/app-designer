# App Designer: An Intelligent Application Design Assistant

This project is an intelligent application design assistant built with Tauri, React, and TypeScript. It helps gather requirements, generate design documents, and export them in markdown format.

## Features

- Requirements gathering with categorized questions
- Real-time progress tracking
- Design document generation and viewing
- Export design documents in markdown format
- Ollama status monitoring

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites/)

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/app-designer.git
   cd app-designer
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run tauri dev
   ```

## Usage

1. Open the application in your browser.
2. Follow the prompts to answer requirement questions.
3. View the generated design document.
4. Export the design document using the export button.

## Project Structure

- `issues/_index.md`: List of ongoing development items
- `src/components`: React components used in the application
- `src/hooks`: Custom hooks for managing state and logic
- `src/lib`: Utility functions and types
- `src/assets`: Static assets like images and icons
- `src/App.tsx`: Main application component
- `src/main.tsx`: Entry point for the React application
- `src-tauri`: Tauri configuration and Rust backend

## License

This project is licensed under the MIT License.
