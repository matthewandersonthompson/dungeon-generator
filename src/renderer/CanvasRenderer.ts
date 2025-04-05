import { Dungeon, CellType, Room, Corridor, Door, Feature, Point, LayerOptions } from '../core/Types';
import { LayerManager } from './LayerManager';
import { Geometry } from '../core/Geometry';

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

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dungeon: Dungeon;
  private layerManager: LayerManager;
  private options: RendererOptions;
  
  constructor(
    canvas: HTMLCanvasElement, 
    dungeon: Dungeon, 
    options: Partial<RendererOptions> = {}
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.dungeon = dungeon;
    this.options = { ...DEFAULT_RENDERER_OPTIONS, ...options };
    this.canvas.width = dungeon.width * this.options.cellSize + this.options.padding * 2;
    this.canvas.height = dungeon.height * this.options.cellSize + this.options.padding * 2;
    this.layerManager = new LayerManager(
      this.canvas.width, 
      this.canvas.height, 
      dungeon.seed
    );
    this.layerManager.generateAllLayers(this.options.layerOptions);
  }
  
  render(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
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
    
    this.renderDungeonBase();
    this.renderWalls();
    this.renderDoors();
    this.renderFeatures();
    if (this.options.showGrid) {
      this.renderGrid();
    }
    if (this.options.showRoomLabels) {
      this.renderRoomLabels();
    }
  }
  
  private renderDungeonBase(): void {
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

  private renderTexturedFloor(floorMask: HTMLCanvasElement): void {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    for (const layerType of ['grid', 'rocks', 'cracks', 'dots']) {
      const layerOptions = this.options.layerOptions[layerType];
      if (!layerOptions || !layerOptions.visible) continue;
      const layer = this.layerManager.getLayer(layerType);
      if (layer) {
        tempCtx.drawImage(layer, 0, 0);
      }
    }
    this.layerManager.applyMask(tempCtx, floorMask);
    this.ctx.drawImage(tempCanvas, 0, 0);
  }
  
  private renderWalls(): void {
    const wallLayer = this.layerManager.createWallLayer(
      this.dungeon,
      this.options.cellSize,
      this.options.padding,
      this.options.wallColor,
      this.options.wallThickness
    );
    
    this.ctx.drawImage(wallLayer, 0, 0);
  }

  private renderDoors(): void {
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
      if (door.type === CellType.DOOR) {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(px + size * 0.2, py + size * 0.2, size * 0.6, size * 0.6);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px + size * 0.2, py + size * 0.2, size * 0.6, size * 0.6);
      } else {
        this.ctx.fillStyle = '#555555'; // Dark gray (looks like wall)
        this.ctx.fillRect(px + size * 0.15, py + size * 0.15, size * 0.7, size * 0.7);
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
  
  private renderFeatures(): void {
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

    for (const feature of this.dungeon.features) {
      const x = feature.x;
      const y = feature.y;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      const halfSize = size / 2;
      const color = featureColors[feature.type] || '#FF00FF';
      this.ctx.fillStyle = color;
      
      switch (feature.type) {
        case CellType.PILLAR:
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case CellType.STATUE:
          this.ctx.beginPath();
          this.ctx.moveTo(px + halfSize, py + size * 0.2);
          this.ctx.lineTo(px + size * 0.2, py + size * 0.8);
          this.ctx.lineTo(px + size * 0.8, py + size * 0.8);
          this.ctx.closePath();
          this.ctx.fill();
          break;
          
        case CellType.FOUNTAIN:
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = '#8888FF';
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.4, 0, Math.PI * 2);
          this.ctx.stroke();
          break;
          
        case CellType.ALTAR:
          this.ctx.fillRect(px + size * 0.2, py + size * 0.3, size * 0.6, size * 0.4);
          break;
          
        case CellType.TRAP:
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
          this.ctx.fillRect(px + size * 0.3, py + size * 0.3, size * 0.4, size * 0.4);
          this.ctx.strokeStyle = '#FF9900';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(px + size * 0.25, py + size * 0.25, size * 0.5, size * 0.5);
          break;
          
        case CellType.MONSTER:
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.fillStyle = '#000000';
          this.ctx.beginPath();
          this.ctx.arc(px + size * 0.4, py + size * 0.4, size * 0.08, 0, Math.PI * 2);
          this.ctx.arc(px + size * 0.6, py + size * 0.4, size * 0.08, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case CellType.WATER:
          this.ctx.fillRect(px + size * 0.1, py + size * 0.1, size * 0.8, size * 0.8);
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
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          break;
      }
    }

    if (this.dungeon.entrance) {
      const { x, y } = this.dungeon.entrance;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
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
      this.ctx.fillStyle = featureColors[CellType.EXIT];
      this.ctx.beginPath();
      this.ctx.moveTo(px + size * 0.5, py + size * 0.8);
      this.ctx.lineTo(px + size * 0.2, py + size * 0.2);
      this.ctx.lineTo(px + size * 0.8, py + size * 0.2);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  private renderGrid(): void {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; 
    this.ctx.lineWidth = 0.5;
    const startX = this.options.padding;
    const startY = this.options.padding;
    const endX = this.options.padding + this.dungeon.width * this.options.cellSize;
    const endY = this.options.padding + this.dungeon.height * this.options.cellSize;
    for (let x = 0; x <= this.dungeon.width; x++) {
      const px = this.options.padding + x * this.options.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(px, startY);
      this.ctx.lineTo(px, endY);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.dungeon.height; y++) {
      const py = this.options.padding + y * this.options.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, py);
      this.ctx.lineTo(endX, py);
      this.ctx.stroke();
    }
  }

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
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.options.cellSize * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillText(label, x, y);
    }
  }
  exportToPNG(): string {
    return this.canvas.toDataURL('image/png');
  }
}