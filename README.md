# Dungeon Generator

## Overview
The Dungeon Generator is a project designed to create procedurally generated dungeons for games and simulations. It utilizes various algorithms and techniques to generate rooms, corridors, and features, providing a rich and dynamic environment for players to explore.

## Features
- **Dungeon Generation**: Generate complex dungeons with rooms, corridors, and features.
- **Customizable Parameters**: Adjust parameters such as dungeon size and room count to create unique layouts.
- **Rendering**: Visualize the generated dungeon using HTML5 canvas with multiple rendering layers.
- **User Interface**: Interactive controls for adjusting generation settings and previewing the dungeon.

## Project Structure
```
dungeon-generator
├── src
│   ├── core
│   │   ├── Grid.ts
│   │   ├── Random.ts
│   │   ├── Vector2D.ts
│   │   ├── Geometry.ts
│   │   └── Types.ts
│   ├── generator
│   │   ├── DungeonParams.ts
│   │   ├── RoomGenerator.ts
│   │   ├── CorridorGenerator.ts
│   │   ├── DoorGenerator.ts
│   │   ├── FeatureGenerator.ts
│   │   └── DungeonGenerator.ts
│   ├── renderer
│   │   ├── BaseRenderer.ts
│   │   ├── CanvasRenderer.ts
│   │   ├── LayerManager.ts
│   │   ├── TextureGenerator.ts
│   │   └── layers
│   │       ├── GridLayer.ts
│   │       ├── RocksLayer.ts
│   │       ├── CracksLayer.ts
│   │       ├── MaskLayer.ts
│   │       ├── WallLayer.ts
│   │       ├── FeatureLayer.ts
│   │       ├── DoorLayer.ts
│   │       └── LabelLayer.ts
│   ├── ui
│   │   ├── ControlPanel.ts
│   │   ├── LayerPreview.ts
│   │   ├── PreviewCanvas.ts
│   │   └── ExportUtils.ts
│   ├── utils
│   │   ├── DelaunayTriangulation.ts
│   │   ├── MinimumSpanningTree.ts
│   │   ├── PathFinding.ts
│   │   └── CellularAutomata.ts
│   └── index.ts
├── public
│   ├── index.html
│   └── styles.css
├── tests
│   ├── TextureGenerator.test.ts
│   ├── RoomGenerator.test.ts
│   ├── generator.test.ts
│   └── utils.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dungeon-generator.git
   ```
2. Navigate to the project directory:
   ```
   cd dungeon-generator
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
1. Run the application:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to view the dungeon generator.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.