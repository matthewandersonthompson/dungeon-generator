// This file serves as the entry point for the dungeon generator application.
// It initializes the dungeon generator and renderer, setting up the necessary components for the application to run.

import { DungeonGenerator } from './generator/DungeonGenerator';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import { DungeonParamsBuilder } from './generator/DungeonParams';

document.addEventListener('DOMContentLoaded', () => {
  // Get the canvas element
  const canvas = document.getElementById('dungeon-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  // Initialize the dungeon generator with default parameters
  const dungeonParams = DungeonParamsBuilder.createDefault();
  const dungeonGenerator = new DungeonGenerator(dungeonParams);

  // Generate the dungeon
  const generatedDungeon = dungeonGenerator.generate();

  // Initialize the renderer with the canvas and dungeon
  const canvasRenderer = new CanvasRenderer(canvas, generatedDungeon);
  
  // Render the dungeon
  canvasRenderer.render();

  console.log('Dungeon generation complete!');
  console.log(`Rooms: ${generatedDungeon.rooms.length}`);
  console.log(`Corridors: ${generatedDungeon.corridors.length}`);
  console.log(`Features: ${generatedDungeon.features.length}`);
});