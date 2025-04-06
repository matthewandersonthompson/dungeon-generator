Dungeon Generator
=================

Welcome to the Dungeon Generator—a TypeScript-powered tool for creating random dungeon layouts that are as unpredictable as your next D&D session! Whether you're a DM looking to spice up your campaign or a developer wanting a robust generator for your Pathfinder-inspired games, this project is for you.

Overview
--------
This generator builds dungeons with:
  • RoomGenerator: Crafts rooms (rectangular, circular, L-shaped, cave-like) and clusters them together like a sketchy, ancient building.
  • CorridorGenerator: Connects rooms using a minimum spanning tree (MST) so that each connection is unique—no extra hallways allowed (unless you want them!).
  • CanvasRenderer: Renders your dungeon on an HTML5 canvas, with plans for smooth curves, funky rock borders, and 45° chamfered corners to keep things visually interesting.

Current Status
--------------
- Rooms are clustered for a compact layout.
- Multiple room types are generated(weird list of stuff, but I was just messing around).
- Corridors reliably connect rooms.

Future (Epic) Goals
-------------------
- Cool cosmetic touches (cracks, rocks, water effects, etc.).
- A simple UI for tweaking settings without needing to recompile code.

Setup & Usage
-------------
1. Clone the repo:
   git clone https://github.com/matthewandersonthompson/dungeon-generator.git
   cd dungeon-generator
2. Install dependencies:
   npm install
3. Build and run:
   npm run build
   Open the generated HTML file in your browser or run your dev server.

License
-------
MIT License

Acknowledgements
----------------
Big thanks to all the dungeon delvers, DM gurus, and open-source wizards who inspired this project.
