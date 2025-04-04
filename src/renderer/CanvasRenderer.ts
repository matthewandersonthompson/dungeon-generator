import { Dungeon, CellType, Room, Corridor, Door, Feature, Point, LayerOptions } from '../core/Types';
import { LayerManager } from './LayerManager';
import { Geometry } from '../core/Geometry';

/**
 * Renderer configuration options
 */
export interface RendererOptions {
  cellSize: number;
  padding: number;
  backgroundColor: string;
  layerOptions: Record<string, LayerOptions>;
  showGrid: boolean;
  showRoomLabels: boolean;
  wallColor: string;
  wallThickness: number;
  floorColor: string;
  corridorColor: string;
  roomLabelsFont: string;
}

/**
 * Default renderer options
 */
export const DEFAULT_RENDERER_OPTIONS: RendererOptions = {
  cellSize: 24,
  padding: 10,
  backgroundColor: 'white',
  layerOptions: {
    grid: {
      opacity: 0.2,
      density: 1.0,
      scale: 1.0,
      color: '#000000',
      visible: true
    },
    rocks: {
      opacity: 0.3,
      density: 0.7,
      scale: 1.0,
      color: '#000000',
      visible: true
    },
    cracks: {
      opacity: 0.25,
      density: 0.5,
      scale: 1.0,
      color: '#000000',
      visible: true
    },
    dots: {
      opacity: 0.2,
      density: 0.3,
      scale: 1.0,
      color: '#000000',
      visible: true
    }
  },
  showGrid: true,
  showRoomLabels: true,
  wallColor: '#333333',
  wallThickness: 2,
  floorColor: '#f0f0f0',
  corridorColor: '#e0e0e0',
  roomLabelsFont: '12px Arial'
};

/**
 * Canvas renderer for dungeon visualization
 */
export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dungeon: Dungeon;
  private layerManager: LayerManager;
  private options: RendererOptions;
  
  /**
   * Create a new canvas renderer
   * @param canvas Canvas element to render to
   * @param dungeon Dungeon to render
   * @param options Rendering options
   */
  constructor(
    canvas: HTMLCanvasElement, 
    dungeon: Dungeon, 
    options: Partial<RendererOptions> = {}
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.dungeon = dungeon;
    this.options = { ...DEFAULT_RENDERER_OPTIONS, ...options };
    
    // Setup canvas dimensions
    this.canvas.width = dungeon.width * this.options.cellSize + this.options.padding * 2;
    this.canvas.height = dungeon.height * this.options.cellSize + this.options.padding * 2;
    
    // Initialize layer manager
    this.layerManager = new LayerManager(
      this.canvas.width, 
      this.canvas.height, 
      dungeon.seed
    );
    
    // Generate all texture layers
    this.layerManager.generateAllLayers(this.options.layerOptions);
  }
  
  /**
   * Render the dungeon
   */
  render(): void {
    // Clear canvas with pure white background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create masks
    const floorMask = this.layerManager.createFloorMask(
      this.dungeon, 
      this.options.cellSize, 
      this.options.padding
    );
    
    const wallMask = this.layerManager.createWallMask(
      this.dungeon,
      this.options.cellSize,
      this.options.padding
    );
    
    // Render layers
    this.renderDungeonBase();
    
    // Don't render textured floor - we want a clean grid
    // this.renderTexturedFloor(floorMask);
    
    this.renderWalls();
    this.renderDoors();
    this.renderFeatures();
    
    // Optionally render grid and labels
    if (this.options.showGrid) {
      this.renderGrid();
    }
    
    if (this.options.showRoomLabels) {
      this.renderRoomLabels();
    }
  }
  
  /**
   * Render the base dungeon (floors and corridors)
   */
  private renderDungeonBase(): void {
    // Render floors
    this.ctx.fillStyle = this.options.floorColor;
    
    for (let x = 0; x < this.dungeon.width; x++) {
      for (let y = 0; y < this.dungeon.height; y++) {
        const cellType = this.dungeon.grid[x][y];
        
        if (cellType === CellType.FLOOR) {
          const px = this.options.padding + x * this.options.cellSize;
          const py = this.options.padding + y * this.options.cellSize;
          this.ctx.fillRect(px, py, this.options.cellSize, this.options.cellSize);
        }
      }
    }
    
    // Render corridors
    this.ctx.fillStyle = this.options.corridorColor;
    
    for (let x = 0; x < this.dungeon.width; x++) {
      for (let y = 0; y < this.dungeon.height; y++) {
        const cellType = this.dungeon.grid[x][y];
        
        if (cellType === CellType.CORRIDOR) {
          const px = this.options.padding + x * this.options.cellSize;
          const py = this.options.padding + y * this.options.cellSize;
          this.ctx.fillRect(px, py, this.options.cellSize, this.options.cellSize);
        }
      }
    }
  }

  /**
   * Render textured floor using the layer system
   * @param floorMask Mask for floor areas
   */
  private renderTexturedFloor(floorMask: HTMLCanvasElement): void {
    // Create a temporary canvas for compositing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    // Draw each texture layer
    for (const layerType of ['grid', 'rocks', 'cracks', 'dots']) {
      const layerOptions = this.options.layerOptions[layerType];
      if (!layerOptions || !layerOptions.visible) continue;
      
      const layer = this.layerManager.getLayer(layerType);
      if (layer) {
        tempCtx.drawImage(layer, 0, 0);
      }
    }
    
    // Apply floor mask to reveal textures only in floor areas
    this.layerManager.applyMask(tempCtx, floorMask);
    
    // Draw the masked textures to the main canvas
    this.ctx.drawImage(tempCanvas, 0, 0);
  }
  
  /**
   * Render wall boundaries
   */
  private renderWalls(): void {
    // Create a wall layer
    const wallLayer = this.layerManager.createWallLayer(
      this.dungeon,
      this.options.cellSize,
      this.options.padding,
      this.options.wallColor,
      this.options.wallThickness
    );
    
    // Draw the wall layer
    this.ctx.drawImage(wallLayer, 0, 0);
  }

  /**
   * Render doors
   */
  private renderDoors(): void {
    // Define feature colors
    const featureColors: Record<number, string> = {
      [CellType.PILLAR]: '#999999',
      [CellType.STATUE]: '#CCCCCC',
      [CellType.FOUNTAIN]: '#4444FF',
      [CellType.ALTAR]: '#AA8866',
      [CellType.TRAP]: '#FF4444',
      [CellType.TREASURE]: '#FFFF00',
      [CellType.MONSTER]: '#FF6600',
      [CellType.WATER]: '#6666FF',
      [CellType.ENTRANCE]: '#00FF00',
      [CellType.EXIT]: '#FF00FF'
    };

    if (!this.dungeon.doors) {
      return;
    }

    for (const door of this.dungeon.doors) {
      const x = door.x;
      const y = door.y;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      
      // Draw different styles for regular vs secret doors
      if (door.type === CellType.DOOR) {
        // Regular door
        this.ctx.fillStyle = '#8B4513'; // Brown
        this.ctx.fillRect(px + size * 0.2, py + size * 0.2, size * 0.6, size * 0.6);
        
        // Door frame
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px + size * 0.2, py + size * 0.2, size * 0.6, size * 0.6);
      } else {
        // Secret door
        this.ctx.fillStyle = '#555555'; // Dark gray (looks like wall)
        this.ctx.fillRect(px + size * 0.15, py + size * 0.15, size * 0.7, size * 0.7);
        
        // Subtle hint
        this.ctx.strokeStyle = '#777777';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(px + size * 0.3, py + size * 0.3);
        this.ctx.lineTo(px + size * 0.7, py + size * 0.7);
        this.ctx.moveTo(px + size * 0.3, py + size * 0.7);
        this.ctx.lineTo(px + size * 0.7, py + size * 0.3);
        this.ctx.stroke();
      }
    }
  }
  
  /**
   * Render features
   */
  private renderFeatures(): void {
    // Define colors for different feature types
    const featureColors: Record<number, string> = {
      [CellType.PILLAR]: '#999999',
      [CellType.STATUE]: '#CCCCCC',
      [CellType.FOUNTAIN]: '#4444FF',
      [CellType.ALTAR]: '#AA8866',
      [CellType.TRAP]: '#FF4444',
      [CellType.TREASURE]: '#FFFF00',
      [CellType.MONSTER]: '#FF6600',
      [CellType.WATER]: '#6666FF',
      [CellType.ENTRANCE]: '#00FF00',
      [CellType.EXIT]: '#FF00FF'
    };
    
    if (!this.dungeon.features) {
      return;
    }

    // Draw all features
    for (const feature of this.dungeon.features) {
      const x = feature.x;
      const y = feature.y;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      const halfSize = size / 2;
      
      // Get color for this feature type
      const color = featureColors[feature.type] || '#FF00FF';
      
      // Draw based on feature type
      this.ctx.fillStyle = color;
      
      switch (feature.type) {
        case CellType.PILLAR:
          // Draw a circle
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case CellType.STATUE:
          // Draw a triangle
          this.ctx.beginPath();
          this.ctx.moveTo(px + halfSize, py + size * 0.2);
          this.ctx.lineTo(px + size * 0.2, py + size * 0.8);
          this.ctx.lineTo(px + size * 0.8, py + size * 0.8);
          this.ctx.closePath();
          this.ctx.fill();
          break;
          
        case CellType.FOUNTAIN:
          // Draw a circle with ripples
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Ripples
          this.ctx.strokeStyle = '#8888FF';
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.4, 0, Math.PI * 2);
          this.ctx.stroke();
          break;
          
        case CellType.ALTAR:
          // Draw a rectangle
          this.ctx.fillRect(px + size * 0.2, py + size * 0.3, size * 0.6, size * 0.4);
          break;
          
        case CellType.TRAP:
          // Draw an X
          this.ctx.lineWidth = 2;
          this.ctx.strokeStyle = color;
          this.ctx.beginPath();
          this.ctx.moveTo(px + size * 0.2, py + size * 0.2);
          this.ctx.lineTo(px + size * 0.8, py + size * 0.8);
          this.ctx.moveTo(px + size * 0.8, py + size * 0.2);
          this.ctx.lineTo(px + size * 0.2, py + size * 0.8);
          this.ctx.stroke();
          break;
          
        case CellType.TREASURE:
          // Draw a small square
          this.ctx.fillRect(px + size * 0.3, py + size * 0.3, size * 0.4, size * 0.4);
          
          // Highlight
          this.ctx.strokeStyle = '#FF9900';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(px + size * 0.25, py + size * 0.25, size * 0.5, size * 0.5);
          break;
          
        case CellType.MONSTER:
          // Draw a scary symbol
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Eyes
          this.ctx.fillStyle = '#000000';
          this.ctx.beginPath();
          this.ctx.arc(px + size * 0.4, py + size * 0.4, size * 0.08, 0, Math.PI * 2);
          this.ctx.arc(px + size * 0.6, py + size * 0.4, size * 0.08, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case CellType.WATER:
          // Draw a wavy pattern
          this.ctx.fillRect(px + size * 0.1, py + size * 0.1, size * 0.8, size * 0.8);
          
          // Waves
          this.ctx.strokeStyle = '#9999FF';
          this.ctx.beginPath();
          this.ctx.moveTo(px + size * 0.2, py + size * 0.5);
          this.ctx.bezierCurveTo(
            px + size * 0.3, py + size * 0.4,
            px + size * 0.5, py + size * 0.6,
            px + size * 0.8, py + size * 0.5
          );
          this.ctx.stroke();
          break;
          
        default:
          // Default circle for other features
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          break;
      }
    }
    
    // Draw entrance and exit separately if they exist
    if (this.dungeon.entrance) {
      const { x, y } = this.dungeon.entrance;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      
      // Draw entrance as a green up arrow
      this.ctx.fillStyle = featureColors[CellType.ENTRANCE];
      this.ctx.beginPath();
      this.ctx.moveTo(px + size * 0.5, py + size * 0.2);
      this.ctx.lineTo(px + size * 0.2, py + size * 0.8);
      this.ctx.lineTo(px + size * 0.8, py + size * 0.8);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    if (this.dungeon.exit) {
      const { x, y } = this.dungeon.exit;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      
      // Draw exit as a purple down arrow
      this.ctx.fillStyle = featureColors[CellType.EXIT];
      this.ctx.beginPath();
      this.ctx.moveTo(px + size * 0.5, py + size * 0.8);
      this.ctx.lineTo(px + size * 0.2, py + size * 0.2);
      this.ctx.lineTo(px + size * 0.8, py + size * 0.2);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
  
  /**
   * Render grid
   */
  private renderGrid(): void {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; // Lighter grid
    this.ctx.lineWidth = 0.5;
    
    // Calculate dungeon boundaries with padding
    const startX = this.options.padding;
    const startY = this.options.padding;
    const endX = this.options.padding + this.dungeon.width * this.options.cellSize;
    const endY = this.options.padding + this.dungeon.height * this.options.cellSize;
    
    // Draw vertical grid lines
    for (let x = 0; x <= this.dungeon.width; x++) {
      const px = this.options.padding + x * this.options.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(px, startY);
      this.ctx.lineTo(px, endY);
      this.ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= this.dungeon.height; y++) {
      const py = this.options.padding + y * this.options.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, py);
      this.ctx.lineTo(endX, py);
      this.ctx.stroke();
    }
  }
  
  /**
   * Render room labels
   */
  private renderRoomLabels(): void {
    this.ctx.font = this.options.roomLabelsFont;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    for (let i = 0; i < this.dungeon.rooms.length; i++) {
      const room = this.dungeon.rooms[i];
      const label = (i + 1).toString();
      
      const x = this.options.padding + room.center.x * this.options.cellSize;
      const y = this.options.padding + room.center.y * this.options.cellSize;
      
      // Draw a background circle for better visibility
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.options.cellSize * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw the room number
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillText(label, x, y);
    }
  }
  
  /**
   * Export the dungeon as a PNG image
   * @returns Data URL of the PNG image
   */
  exportToPNG(): string {
    return this.canvas.toDataURL('image/png');
  }
}