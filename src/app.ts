import { DungeonGenerator } from './generator/DungeonGenerator';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import { DungeonParamsBuilder } from './generator/DungeonParams';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('dungeon-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  const dungeonParams = DungeonParamsBuilder.createDefault();
  const dungeonGenerator = new DungeonGenerator(dungeonParams);
  const generatedDungeon = dungeonGenerator.generate();
  const canvasRenderer = new CanvasRenderer(canvas, generatedDungeon);
  canvasRenderer.render();
  console.log('Dungeon generation complete!');
  console.log(`Rooms: ${generatedDungeon.rooms.length}`);
  console.log(`Corridors: ${generatedDungeon.corridors.length}`);
  console.log(`Features: ${generatedDungeon.features.length}`);
});