Dungeon Generator
=================

The Dungeon Generator is a TypeScript-based procedural dungeon creation tool that
generates random dungeon layouts with multiple room types, corridors, doors, and additional
features. The project has evolved to improve both the algorithmic generation of rooms and
the visual rendering of the dungeon.

Overview
--------
This project generates dungeon maps using several core components:

  - RoomGenerator:
      Creates rooms of various types (rectangular, circular, L-shaped, cave-like)
      and clusters them to mimic a building-like layout.
  - CorridorGenerator:
      Connects rooms using a Minimum Spanning Tree (MST) approach to ensure exactly
      one corridor per room connection (with optional loop creation).
  - CanvasRenderer:
      Draws the generated dungeon onto an HTML5 canvas. 

What Has Been Done
------------------
1. Room Generation Improvements:
   - Room Clustering: Rooms are now placed closer together to simulate a building-like structure.
   - Multiple Room Types: The generator supports rectangular, circular, L-shaped, and cave-like rooms.

What I WANT to do 
------------------------
1. Add Smooth curved circular rooms
2. Add voroni-like rock borders around the walls of rooms and hallways
3. Add 45 degree walls on cell corners of abnormally shaped rooms
4. Add fun minor cosmetics like cracks in walls, rocks on the floor, water, etc.
5. Add simple UI dropdown options on the side for easy customization


Setup & Usage
-------------
Installation:
  1. Clone the Repository:
       git clone https://github.com/matthewandersonthompson/dungeon-generator.git
       cd dungeon-generator

  2. Install Dependencies:
       npm install

Build and Run:
  1. Build the Project:
       npm run build
       (This compiles the TypeScript files.)

  2. Run the Application:
       Open the generated HTML file in your browser or run your development server to view the dungeon.

Configuration:
  - Room and Corridor Settings:
       Modify parameters in the generator configuration files to adjust room density, corridor width,
       and the chance of special room types.
  - Renderer Options:
       Adjust visual settings (e.g., cell size, padding, wall colors) in the CanvasRenderer.ts file.

License
-------
  MIT License

Acknowledgements
----------------
  Special thanks to the creators of similar dungeon generator projects who inspired me (gridmapper, watabou, etc.)
