## React App Readme
This React application is a portfolio management tool built using React and MUI. Below is an overview of the project structure and functionality:

## Project Structure
Portfolio.tsx: Entry point of the application. It wraps the main component Page with DndProvider to enable drag-and-drop 
## functionality.
Page.tsx: Main component representing the portfolio page. It renders a grid layout and manages the positioning of modules.
Module.tsx: Component representing individual modules in the portfolio. It handles drag-and-drop functionality and collision detection.
Grid.tsx: Component responsible for rendering the grid layout.
Functionality
Drag-and-Drop: Users can drag and drop modules within the portfolio page to rearrange their positions.
Grid Layout: The portfolio page utilizes a grid layout for organizing modules.
Collision Detection: The application detects collisions between modules to prevent overlap.

## Usage
To run the application locally:

## Commands to tun
Install dependencies using yarn install.
Start the development server with yarn start.

## Dependencies
react: A JavaScript library for building user interfaces.
@mui/material: React components for faster and easier web development.
react-dnd-html5-backend: HTML5 backend for React Drag and Drop.
react-use: Collection of essential hooks for React.
typescript: A superset of JavaScript that adds static typing to the language.
