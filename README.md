# ProjectCalc

ProjectCalc is a Progressive Web App (PWA) designed for freelancer developers. It is a tool that helps create precise project quotations using Artificial Intelligence and improving estimation accuracy.

## Project Overview

ProjectCalc aims to simplify project estimation by combining manual inputs with AI-powered suggestions. It allows users to create, edit, and manage project functionalities and tasks while offering features like PDF export, configuration import/export, and dynamic project editing.

## Architecture

- **Frontend:** The app is built using React and Redux Toolkit. It follows a component-based architecture with modular and reusable UI components.
- **User Interface:** TailwindCSS is used for styling, ensuring a responsive design that works seamlessly on both desktop and mobile devices. The app also leverages Radix UI and Lucide React for accessible components and icons.
- **State Management:** Redux Toolkit manages the global state, which includes project details, configurations, and user interactions.
- **Local Persistence:** Project state is persisted using local storage and cookies. This ensures continuity of user settings such as sidebar states and recent projects.
- **PWA Features:** The application supports offline capabilities, providing a native-app-like experience with improved performance and reliability.

## Technologies Used

- **React:** For building the user interface.
- **Redux Toolkit:** For efficient state management.
- **TailwindCSS:** For rapid and customizable UI styling.
- **PWA Standards:** For offline support and native feel.
- **Additional Libraries:**
  - React Toastify for notifications.
  - Radix UI for accessible component design.
  - Lucide React for vector icons.
  - Tailwindcss-animate for smooth UI animations.
  - Vite (or a similar bundler) for fast build performance.

## Setup and Development

1. Install dependencies:
   - `npm install` or `yarn install`
2. Run development server:
   - `npm run dev` or `yarn dev`
3. Build the application:
   - `npm run build` or `yarn build`
4. Deploy as a PWA to your chosen hosting environment.

## Additional Information

- The app supports dynamic project creation with configuration management.
- Users can benefit from AI-powered suggestions for project estimations.
- The design ensures ease of use for managing project functionalities and tasks.


