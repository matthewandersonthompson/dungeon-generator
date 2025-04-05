import { Random } from '../core/Random';
import { Dungeon, LayerOptions, CellType } from '../core/Types';
import { TextureGenerator, TextureGeneratorFactory } from './TextureGenerator';

export class LayerManager {
  private canvasWidth: number;
  private canvasHeight: number;
  private textureGenerators: Map<string, TextureGenerator>;
  private textureLayers: Map<string, HTMLCanvasElement>;
  private random: Random;
  
  constructor(width: number, height: number, seed?: string | number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.random = new Random(seed);
    this.textureGenerators = new Map();
    this.textureLayers = new Map();
    
    this.initializeGenerators();
  }
  
  private initializeGenerators() {
    const generators = ['grid', 'rocks', 'cracks', 'dots'];
    generators.forEach(type => 
      this.textureGenerators.set(type, TextureGeneratorFactory.createGenerator(type))
    );
  }
  
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
  
  getLayer(layerType: string): HTMLCanvasElement | undefined {
    return this.textureLayers.get(layerType);
  }
  
  generateAllLayers(options: Record<string, LayerOptions>) {
    Object.entries(options)
      .filter(([, layerOptions]) => layerOptions.visible)
      .forEach(([layerType, layerOptions]) => 
        this.generateLayer(layerType, layerOptions)
      );
  }
  
  createFloorMask(dungeon: Dungeon, cellSize: number, padding: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const walkableCellTypes = [
      CellType.FLOOR, 
      CellType.CORRIDOR,
      CellType.DOOR,
      CellType.SECRET_DOOR,
      CellType.ENTRANCE,
      CellType.EXIT,
      CellType.WATER,
      CellType.PILLAR,
      CellType.STATUE,
      CellType.ALTAR,
      CellType.FOUNTAIN,
      CellType.TRAP,
      CellType.TREASURE,
      CellType.MONSTER
    ];
    
    ctx.fillStyle = 'white';
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (walkableCellTypes.includes(dungeon.grid[x][y])) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      }
    }
    
    return canvas;
  }
  
  applyMask(ctx: CanvasRenderingContext2D, mask: HTMLCanvasElement) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(mask, 0, 0);
    ctx.restore();
  }
  
  createWallMask(dungeon: Dungeon, cellSize: number, padding: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (dungeon.grid[x][y] === CellType.WALL) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      }
    }
    
    return canvas;
  }

  createWallLayer(dungeon: Dungeon, cellSize: number, padding: number, color: string, thickness: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'square';
    
    const isWall = (x: number, y: number): boolean => 
      x >= 0 && y >= 0 && x < dungeon.width && y < dungeon.height && 
      dungeon.grid[x][y] === CellType.WALL;
    
    const isEmpty = (x: number, y: number): boolean => 
      x < 0 || y < 0 || x >= dungeon.width || y >= dungeon.height || 
      dungeon.grid[x][y] === CellType.EMPTY;
    
    const drawEdge = (x: number, y: number, px: number, py: number, edge: 'top' | 'bottom' | 'left' | 'right') => {
      const edgeChecks = {
        'top': () => !isWall(x, y - 1) && !isEmpty(x, y - 1),
        'bottom': () => !isWall(x, y + 1) && !isEmpty(x, y + 1),
        'left': () => !isWall(x - 1, y) && !isEmpty(x - 1, y),
        'right': () => !isWall(x + 1, y) && !isEmpty(x + 1, y)
      };
      
      const edgeDrawings = {
        'top': () => {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + cellSize, py);
          ctx.stroke();
        },
        'bottom': () => {
          ctx.beginPath();
          ctx.moveTo(px, py + cellSize);
          ctx.lineTo(px + cellSize, py + cellSize);
          ctx.stroke();
        },
        'left': () => {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + cellSize);
          ctx.stroke();
        },
        'right': () => {
          ctx.beginPath();
          ctx.moveTo(px + cellSize, py);
          ctx.lineTo(px + cellSize, py + cellSize);
          ctx.stroke();
        }
      };
      
      if (edgeChecks[edge]()) {
        edgeDrawings[edge]();
      }
    };
    
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (dungeon.grid[x][y] === CellType.WALL) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          
          drawEdge(x, y, px, py, 'top');
          drawEdge(x, y, px, py, 'bottom');
          drawEdge(x, y, px, py, 'left');
          drawEdge(x, y, px, py, 'right');
        }
      }
    }
    
    return canvas;
  }
}