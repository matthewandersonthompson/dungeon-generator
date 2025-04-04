import { Random } from '../core/Random';
import { Dungeon, LayerOptions, CellType } from '../core/Types';
import { TextureGenerator, TextureGeneratorFactory } from './TextureGenerator';

/**
 * Manager for texture layers
 */
export class LayerManager {
  private canvasWidth: number;
  private canvasHeight: number;
  private textureGenerators: Map<string, TextureGenerator>;
  private textureLayers: Map<string, HTMLCanvasElement>;
  private random: Random;
  
  /**
   * Create a new layer manager
   * @param width Canvas width
   * @param height Canvas height
   * @param seed Random seed
   */
  constructor(width: number, height: number, seed?: string | number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.random = new Random(seed);
    this.textureGenerators = new Map();
    this.textureLayers = new Map();
    
    this.initializeGenerators();
  }
  
  /**
   * Initialize texture generators
   */
  private initializeGenerators() {
    this.textureGenerators.set('grid', TextureGeneratorFactory.createGenerator('grid'));
    this.textureGenerators.set('rocks', TextureGeneratorFactory.createGenerator('rocks'));
    this.textureGenerators.set('cracks', TextureGeneratorFactory.createGenerator('cracks'));
    this.textureGenerators.set('dots', TextureGeneratorFactory.createGenerator('dots'));
    // Add more texture generators as needed
  }
  
  /**
   * Generate a texture layer
   * @param layerType Type of layer to generate
   * @param options Layer options
   * @returns Canvas element with the generated texture
   */
  generateLayer(layerType: string, options: LayerOptions): HTMLCanvasElement {
    const generator = this.textureGenerators.get(layerType);
    if (!generator) {
      throw new Error(`Unknown layer type: ${layerType}`);
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    generator.generate(ctx, this.canvasWidth, this.canvasHeight, this.random, options);
    
    this.textureLayers.set(layerType, canvas);
    return canvas;
  }
  
  /**
   * Get a previously generated layer
   * @param layerType Type of layer to retrieve
   * @returns Canvas element with the layer texture or undefined if not found
   */
  getLayer(layerType: string): HTMLCanvasElement | undefined {
    return this.textureLayers.get(layerType);
  }
  
  /**
   * Generate all layers
   * @param options Map of layer types to their options
   */
  generateAllLayers(options: Record<string, LayerOptions>) {
    for (const [layerType, layerOptions] of Object.entries(options)) {
      if (layerOptions.visible) {
        this.generateLayer(layerType, layerOptions);
      }
    }
  }
  
  /**
   * Create a mask from the dungeon floor and corridors
   * @param dungeon Dungeon to create mask from
   * @param cellSize Size of each cell in pixels
   * @param padding Padding around the dungeon in pixels
   * @returns Canvas element with the mask
   */
  createFloorMask(dungeon: Dungeon, cellSize: number, padding: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    
    // Fill black (transparent) background
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Fill white where floor/corridors exist
    ctx.fillStyle = 'white';
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        const cellType = dungeon.grid[x][y];
        if (
          cellType === CellType.FLOOR || 
          cellType === CellType.CORRIDOR ||
          cellType === CellType.DOOR ||
          cellType === CellType.SECRET_DOOR ||
          cellType === CellType.ENTRANCE ||
          cellType === CellType.EXIT ||
          cellType === CellType.WATER ||
          cellType === CellType.PILLAR ||
          cellType === CellType.STATUE ||
          cellType === CellType.ALTAR ||
          cellType === CellType.FOUNTAIN ||
          cellType === CellType.TRAP ||
          cellType === CellType.TREASURE ||
          cellType === CellType.MONSTER
        ) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      }
    }
    
    return canvas;
  }
  
  /**
   * Apply a mask to a context
   * @param ctx Canvas context to apply mask to
   * @param mask Mask canvas element
   */
  applyMask(ctx: CanvasRenderingContext2D, mask: HTMLCanvasElement) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(mask, 0, 0);
    ctx.restore();
  }
  
  /**
   * Create a wall mask
   * @param dungeon Dungeon to create mask from
   * @param cellSize Size of each cell in pixels
   * @param padding Padding around the dungeon in pixels
   * @returns Canvas element with the mask
   */
  createWallMask(dungeon: Dungeon, cellSize: number, padding: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    
    // Fill black (transparent) background
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Fill white where walls exist
    ctx.fillStyle = 'white';
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        const cellType = dungeon.grid[x][y];
        if (cellType === CellType.WALL) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      }
    }
    
    return canvas;
  }

  /**
   * Create layer specifically for room walls
   * @param dungeon Dungeon to create wall layer for
   * @param cellSize Size of each cell in pixels
   * @param padding Padding around the dungeon in pixels
   * @param color Wall color
   * @param thickness Wall thickness in pixels
   * @returns Canvas with wall rendering
   */
  createWallLayer(dungeon: Dungeon, cellSize: number, padding: number, color: string, thickness: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set wall style
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'square';
    
    // Function to check if a cell is a wall
    const isWall = (x: number, y: number): boolean => {
      if (x < 0 || y < 0 || x >= dungeon.width || y >= dungeon.height) {
        return false;
      }
      return dungeon.grid[x][y] === CellType.WALL;
    };
    
    // Function to check if a cell is empty space (not floor or corridor)
    const isEmpty = (x: number, y: number): boolean => {
      if (x < 0 || y < 0 || x >= dungeon.width || y >= dungeon.height) {
        return true;
      }
      const cell = dungeon.grid[x][y];
      return cell === CellType.EMPTY;
    };
    
    // Draw lines for wall boundaries
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (dungeon.grid[x][y] === CellType.WALL) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          
          // Check adjacent cells to see if we should draw a wall edge
          
          // Top edge
          if (!isWall(x, y - 1) && !isEmpty(x, y - 1)) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + cellSize, py);
            ctx.stroke();
          }
          
          // Bottom edge
          if (!isWall(x, y + 1) && !isEmpty(x, y + 1)) {
            ctx.beginPath();
            ctx.moveTo(px, py + cellSize);
            ctx.lineTo(px + cellSize, py + cellSize);
            ctx.stroke();
          }
          
          // Left edge
          if (!isWall(x - 1, y) && !isEmpty(x - 1, y)) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py + cellSize);
            ctx.stroke();
          }
          
          // Right edge
          if (!isWall(x + 1, y) && !isEmpty(x + 1, y)) {
            ctx.beginPath();
            ctx.moveTo(px + cellSize, py);
            ctx.lineTo(px + cellSize, py + cellSize);
            ctx.stroke();
          }
        }
      }
    }
    
    return canvas;
  }
}