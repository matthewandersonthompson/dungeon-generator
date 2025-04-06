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
    // Clear canvas with background color
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Create masks for floor and wall areas
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
    
    // Render in proper order for clean visuals
    this.renderCorridors();  // First render corridors
    this.renderRoomInteriors(); // Then room interiors
    this.renderWalls();  // Then walls on top
    this.renderDoors();  // Then doors
    this.renderFeatures(); // Then features
    
    // Optional rendering elements
    if (this.options.showGrid) {
      this.renderGrid();
    }
    if (this.options.showRoomLabels) {
      this.renderRoomLabels();
    }
  }
  
  private renderCorridors(): void {
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
  
  private renderRoomInteriors(): void {
    // Render all room interiors first
    for (const room of this.dungeon.rooms) {
      this.renderRoomInterior(room);
    }
  }
  
  private renderRoomInterior(room: Room): void {
    const { cellSize, padding, floorColor } = this.options;
    this.ctx.fillStyle = floorColor;
    
    if (room.borderPoints && room.borderPoints.length > 0) {
      // For rooms with defined border points (stars, circles, etc.)
      this.ctx.beginPath();
      
      // Draw a path following the exact same border points used for walls
      const firstPoint = room.borderPoints[0];
      const startX = padding + firstPoint.x * cellSize;
      const startY = padding + firstPoint.y * cellSize;
      this.ctx.moveTo(startX, startY);
      
      for (let i = 1; i < room.borderPoints.length; i++) {
        const point = room.borderPoints[i];
        const x = padding + point.x * cellSize;
        const y = padding + point.y * cellSize;
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.closePath();
      this.ctx.fill(); // Fill the interior
    } else if (room.cells) {
      // For rooms with explicit cell lists, render each cell
      for (const cell of room.cells) {
        const px = padding + cell.x * cellSize;
        const py = padding + cell.y * cellSize;
        this.ctx.fillRect(px, py, cellSize, cellSize);
      }
    } else if (room.width && room.height) {
      // For standard rectangular rooms
      const px = padding + room.x * cellSize;
      const py = padding + room.y * cellSize;
      this.ctx.fillRect(px, py, room.width * cellSize, room.height * cellSize);
    }
  }

  private renderWalls(): void {
    // Process each room for walls
    for (const room of this.dungeon.rooms) {
      this.renderRoomWalls(room);
    }
    
    // Also render corridor walls
    this.renderCorridorWalls();
  }
  
  private renderRoomWalls(room: Room): void {
    const { cellSize, padding, wallColor, wallThickness } = this.options;
    
    this.ctx.strokeStyle = wallColor;
    this.ctx.lineWidth = wallThickness;
    this.ctx.lineCap = 'square';
    
    if (room.borderPoints && room.borderPoints.length > 0) {
      // For rooms with defined border points (stars, circles, etc.)
      this.renderShapedRoomWalls(room);
    } else if (room.cells) {
      // For rooms with explicit cell lists, find the perimeter
      this.renderCellBasedRoomWalls(room);
    } else if (room.width && room.height) {
      // For standard rectangular rooms
      this.renderRectangularRoomWalls(room);
    }
  }
  
  private renderShapedRoomWalls(room: Room): void {
    if (!room.borderPoints || room.borderPoints.length === 0) return;
    
    const { cellSize, padding, wallColor, wallThickness } = this.options;
    const doorways = this.findRoomDoorways(room);

    this.ctx.strokeStyle = wallColor;
    this.ctx.lineWidth = wallThickness;
    
    // Draw room walls as segments so we can skip door segments
    for (let i = 0; i < room.borderPoints.length; i++) {
      const startPoint = room.borderPoints[i];
      const endPoint = room.borderPoints[(i + 1) % room.borderPoints.length];
      
      const startX = padding + startPoint.x * cellSize;
      const startY = padding + startPoint.y * cellSize;
      const endX = padding + endPoint.x * cellSize;
      const endY = padding + endPoint.y * cellSize;
      
      // Check if this wall segment contains a doorway
      const hasDoorway = doorways.some(door => {
        // Simple line segment intersection check (simplified for grid alignment)
        const doorX = padding + door.x * cellSize;
        const doorY = padding + door.y * cellSize;
        
        // This is simplified for grid-aligned walls
        const isOnSegment = (
          (Math.abs(startX - endX) < 0.1 && Math.abs(doorX - startX) < 0.1 && doorY >= Math.min(startY, endY) && doorY <= Math.max(startY, endY)) ||
          (Math.abs(startY - endY) < 0.1 && Math.abs(doorY - startY) < 0.1 && doorX >= Math.min(startX, endX) && doorX <= Math.max(startX, endX))
        );
        
        return isOnSegment;
      });
      
      if (!hasDoorway) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
      }
    }
  }
  
  private renderRectangularRoomWalls(room: Room): void {
    if (!room.width || !room.height) return;
    
    const { cellSize, padding, wallColor, wallThickness } = this.options;
    const doorways = this.findRoomDoorways(room);
    
    this.ctx.strokeStyle = wallColor;
    this.ctx.lineWidth = wallThickness;
    
    const px = padding + room.x * cellSize;
    const py = padding + room.y * cellSize;
    const width = room.width * cellSize;
    const height = room.height * cellSize;
    
    // Draw each wall segment separately to skip doorways
    const walls = [
      { start: { x: px, y: py }, end: { x: px + width, y: py }, edge: 'top' },
      { start: { x: px + width, y: py }, end: { x: px + width, y: py + height }, edge: 'right' },
      { start: { x: px + width, y: py + height }, end: { x: px, y: py + height }, edge: 'bottom' },
      { start: { x: px, y: py + height }, end: { x: px, y: py }, edge: 'left' }
    ];
    
    for (const wall of walls) {
      // Check for doorways on this wall
      const hasDoorway = doorways.some(door => {
        const doorX = padding + door.x * cellSize;
        const doorY = padding + door.y * cellSize;
        
        // Determine if door is on this wall segment
        if (wall.edge === 'top' && Math.abs(doorY - py) < 0.1) {
          return doorX >= px && doorX <= px + width;
        } else if (wall.edge === 'right' && Math.abs(doorX - (px + width)) < 0.1) {
          return doorY >= py && doorY <= py + height;
        } else if (wall.edge === 'bottom' && Math.abs(doorY - (py + height)) < 0.1) {
          return doorX >= px && doorX <= px + width;
        } else if (wall.edge === 'left' && Math.abs(doorX - px) < 0.1) {
          return doorY >= py && doorY <= py + height;
        }
        return false;
      });
      
      if (!hasDoorway) {
        this.ctx.beginPath();
        this.ctx.moveTo(wall.start.x, wall.start.y);
        this.ctx.lineTo(wall.end.x, wall.end.y);
        this.ctx.stroke();
      } else {
        // Draw wall segments on either side of the doorway
        const doorCells = doorways.filter(door => {
          const doorX = padding + door.x * cellSize;
          const doorY = padding + door.y * cellSize;
          
          if (wall.edge === 'top' && Math.abs(doorY - py) < 0.1) {
            return doorX >= px && doorX <= px + width;
          } else if (wall.edge === 'right' && Math.abs(doorX - (px + width)) < 0.1) {
            return doorY >= py && doorY <= py + height;
          } else if (wall.edge === 'bottom' && Math.abs(doorY - (py + height)) < 0.1) {
            return doorX >= px && doorX <= px + width;
          } else if (wall.edge === 'left' && Math.abs(doorX - px) < 0.1) {
            return doorY >= py && doorY <= py + height;
          }
          return false;
        });
        
        // Sort door cells to draw wall segments between them
        if (doorCells.length > 0) {
          if (wall.edge === 'top' || wall.edge === 'bottom') {
            doorCells.sort((a, b) => a.x - b.x);
            
            // Draw wall before first door
            if (doorCells[0].x > room.x) {
              this.ctx.beginPath();
              this.ctx.moveTo(wall.start.x, wall.start.y);
              this.ctx.lineTo(padding + doorCells[0].x * cellSize - cellSize/2, wall.start.y);
              this.ctx.stroke();
            }
            
            // Draw walls between doors
            for (let i = 0; i < doorCells.length - 1; i++) {
              if (doorCells[i+1].x - doorCells[i].x > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(padding + doorCells[i].x * cellSize + cellSize/2, wall.start.y);
                this.ctx.lineTo(padding + doorCells[i+1].x * cellSize - cellSize/2, wall.start.y);
                this.ctx.stroke();
              }
            }
            
            // Draw wall after last door
            if (doorCells[doorCells.length-1].x < room.x + room.width - 1) {
              this.ctx.beginPath();
              this.ctx.moveTo(padding + doorCells[doorCells.length-1].x * cellSize + cellSize/2, wall.start.y);
              this.ctx.lineTo(wall.end.x, wall.end.y);
              this.ctx.stroke();
            }
          } else if (wall.edge === 'left' || wall.edge === 'right') {
            doorCells.sort((a, b) => a.y - b.y);
            
            // Draw wall before first door
            if (doorCells[0].y > room.y) {
              this.ctx.beginPath();
              this.ctx.moveTo(wall.start.x, wall.start.y);
              this.ctx.lineTo(wall.start.x, padding + doorCells[0].y * cellSize - cellSize/2);
              this.ctx.stroke();
            }
            
            // Draw walls between doors
            for (let i = 0; i < doorCells.length - 1; i++) {
              if (doorCells[i+1].y - doorCells[i].y > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(wall.start.x, padding + doorCells[i].y * cellSize + cellSize/2);
                this.ctx.lineTo(wall.start.x, padding + doorCells[i+1].y * cellSize - cellSize/2);
                this.ctx.stroke();
              }
            }
            
            // Draw wall after last door
            if (doorCells[doorCells.length-1].y < room.y + room.height - 1) {
              this.ctx.beginPath();
              this.ctx.moveTo(wall.start.x, padding + doorCells[doorCells.length-1].y * cellSize + cellSize/2);
              this.ctx.lineTo(wall.end.x, wall.end.y);
              this.ctx.stroke();
            }
          }
        }
      }
    }
  }
  
  private renderCellBasedRoomWalls(room: Room): void {
    if (!room.cells) return;
    
    const { cellSize, padding } = this.options;
    const cellMap = new Map<string, Point>();
    const doorways = this.findRoomDoorways(room);
    
    // Create a map of all cells in the room
    for (const cell of room.cells) {
      cellMap.set(`${cell.x},${cell.y}`, cell);
    }
    
    // Check each direction for each cell
    for (const cell of room.cells) {
      const directions = [
        { dx: 0, dy: -1, edge: 'top' },
        { dx: 1, dy: 0, edge: 'right' },
        { dx: 0, dy: 1, edge: 'bottom' },
        { dx: -1, dy: 0, edge: 'left' }
      ];
      
      for (const { dx, dy, edge } of directions) {
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        const neighborKey = `${nx},${ny}`;
        
        // If neighbor cell is not part of the room, draw a wall (unless it's a doorway)
        if (!cellMap.has(neighborKey)) {
          // Check if this edge is a doorway
          const isDoorway = doorways.some(door => {
            if (edge === 'top') {
              return door.x === cell.x && door.y === cell.y - 1;
            } else if (edge === 'right') {
              return door.x === cell.x + 1 && door.y === cell.y;
            } else if (edge === 'bottom') {
              return door.x === cell.x && door.y === cell.y + 1;
            } else if (edge === 'left') {
              return door.x === cell.x - 1 && door.y === cell.y;
            }
            return false;
          });
          
          if (!isDoorway) {
            const px = padding + cell.x * cellSize;
            const py = padding + cell.y * cellSize;
            
            this.ctx.beginPath();
            
            if (edge === 'top') {
              this.ctx.moveTo(px, py);
              this.ctx.lineTo(px + cellSize, py);
            } else if (edge === 'right') {
              this.ctx.moveTo(px + cellSize, py);
              this.ctx.lineTo(px + cellSize, py + cellSize);
            } else if (edge === 'bottom') {
              this.ctx.moveTo(px, py + cellSize);
              this.ctx.lineTo(px + cellSize, py + cellSize);
            } else if (edge === 'left') {
              this.ctx.moveTo(px, py);
              this.ctx.lineTo(px, py + cellSize);
            }
            
            this.ctx.stroke();
          }
        }
      }
    }
  }
  
  /**
   * Find cells where corridors connect to a room to create doorways
   */
  private findRoomDoorways(room: Room): Point[] {
    const doorways: Point[] = [];
    
    // Get the room cell coordinates
    let roomCells: Point[] = [];
    
    if (room.cells) {
      // If room has explicit cells
      roomCells = room.cells;
    } else if (room.width && room.height) {
      // If room is rectangular
      roomCells = [];
      for (let x = room.x; x < room.x + room.width; x++) {
        for (let y = room.y; y < room.y + room.height; y++) {
          roomCells.push({ x, y });
        }
      }
    } else if (room.borderPoints) {
      // For rooms with border points, use the rendered cells or center
      roomCells = room.cells || [room.center];
    }
    
    // Create a set of room cell keys for quick checking
    const roomCellSet = new Set(roomCells.map(cell => `${cell.x},${cell.y}`));
    
    // Find corridor cells that are adjacent to room cells
    for (const cell of roomCells) {
      // Check in all 4 directions
      const directions = [
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }
      ];
      
      for (const { dx, dy } of directions) {
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        
        // Check if this adjacent cell is a corridor
        if (
          nx >= 0 && nx < this.dungeon.width &&
          ny >= 0 && ny < this.dungeon.height &&
          this.dungeon.grid[nx][ny] === CellType.CORRIDOR &&
          !roomCellSet.has(`${nx},${ny}`)
        ) {
          // This is a doorway position
          doorways.push({ x: nx, y: ny });
        }
      }
    }
    
    // If there are doors, also add them as doorways
    if (this.dungeon.doors) {
      for (const door of this.dungeon.doors) {
        if (door.connects && door.connects.includes(room.id)) {
          doorways.push({ x: door.x, y: door.y });
        }
      }
    }
    
    return doorways;
  }
  
  private renderCorridorWalls(): void {
    const { cellSize, padding, wallColor, wallThickness } = this.options;
    this.ctx.strokeStyle = wallColor;
    this.ctx.lineWidth = wallThickness;
    
    // Find corridor cells and check their neighbors
    for (let x = 0; x < this.dungeon.width; x++) {
      for (let y = 0; y < this.dungeon.height; y++) {
        if (this.dungeon.grid[x][y] === CellType.CORRIDOR) {
          const directions = [
            { dx: 0, dy: -1, edge: 'top' },
            { dx: 1, dy: 0, edge: 'right' },
            { dx: 0, dy: 1, edge: 'bottom' },
            { dx: -1, dy: 0, edge: 'left' }
          ];
          
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          
          for (const { dx, dy, edge } of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            // Check if neighbor is wall or empty
            if (nx < 0 || ny < 0 || nx >= this.dungeon.width || ny >= this.dungeon.height ||
                this.dungeon.grid[nx][ny] === CellType.WALL || 
                this.dungeon.grid[nx][ny] === CellType.EMPTY) {
              
              this.ctx.beginPath();
              
              if (edge === 'top') {
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(px + cellSize, py);
              } else if (edge === 'right') {
                this.ctx.moveTo(px + cellSize, py);
                this.ctx.lineTo(px + cellSize, py + cellSize);
              } else if (edge === 'bottom') {
                this.ctx.moveTo(px, py + cellSize);
                this.ctx.lineTo(px + cellSize, py + cellSize);
              } else if (edge === 'left') {
                this.ctx.moveTo(px, py);
                this.ctx.lineTo(px, py + cellSize);
              }
              
              this.ctx.stroke();
            }
          }
        }
      }
    }
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
}