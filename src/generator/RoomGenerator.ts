import { Room, RoomType, Point, CellType } from '../core/Types';
import { Random } from '../core/Random';
import { Geometry } from '../core/Geometry';
import { Grid } from '../core/Grid';

export class RoomGenerator {
  private random: Random;
  private minRoomSize: number;
  private maxRoomSize: number;
  private roomSizeVariation: number;
  private roomBuffer: number;
  private specialRoomChance: number;

  constructor(
    seed?: string | number,
    roomSizeVariation = 0.5,
    specialRoomChance = 0.2
  ) {
    this.random = new Random(seed);
    this.roomSizeVariation = roomSizeVariation;
    this.specialRoomChance = specialRoomChance;
    
    this.minRoomSize = 3 + Math.floor(roomSizeVariation * 2);
    this.maxRoomSize = 8 + Math.floor(roomSizeVariation * 7);
    this.roomBuffer = 1;
  }

  generateRooms(width: number, height: number, numRooms: number, density: number): Room[] {
    const rooms: Room[] = [];
    const maxAttempts = numRooms * 10;
    let attempts = 0;
    
    const grid = new Grid<boolean>(width, height, false);
    const effectiveBuffer = Math.max(1, Math.ceil(this.roomBuffer * (1.5 - density)));
    
    while (rooms.length < numRooms && attempts < maxAttempts) {
      attempts++;
      
      const roomType = this.selectRoomType();
      const room = this.createRoom(rooms.length, roomType, width, height, density);
      
      if (this.canPlaceRoom(room, grid, rooms, effectiveBuffer)) {
        this.markRoomCells(room, grid);
        rooms.push(room);
      }
    }
    
    return rooms;
  }

  private selectRoomType(): RoomType {
    if (this.random.nextFloat(0, 1) > this.specialRoomChance) {
      return RoomType.RECTANGULAR;
    }
    
    const specialTypes = [
      RoomType.CIRCULAR,
      RoomType.L_SHAPED,
      RoomType.CAVE
    ];
    
    return this.random.nextElement(specialTypes);
  }

  private createRoom(id: number, type: RoomType, maxWidth: number, maxHeight: number, density: number): Room {
    const roomCreators = {
      [RoomType.RECTANGULAR]: this.createRectangularRoom,
      [RoomType.CIRCULAR]: this.createCircularRoom,
      [RoomType.L_SHAPED]: this.createLShapedRoom,
      [RoomType.CAVE]: this.createCaveRoom
    };
    
    const creator = roomCreators[type] || this.createRectangularRoom;
    return creator.call(this, id, maxWidth, maxHeight, density);
  }

  private createRectangularRoom(id: number, maxWidth: number, maxHeight: number, density: number): Room {
    const width = this.random.nextInt(this.minRoomSize, this.maxRoomSize);
    const height = this.random.nextInt(this.minRoomSize, this.maxRoomSize);
    
    const clusterWidth = Math.floor(maxWidth * (1 - (density * 0.5)));
    const clusterHeight = Math.floor(maxHeight * (1 - (density * 0.5)));
    const offsetX = Math.floor((maxWidth - clusterWidth) / 2);
    const offsetY = Math.floor((maxHeight - clusterHeight) / 2);
    
    const x = this.random.nextInt(offsetX, offsetX + clusterWidth - width);
    const y = this.random.nextInt(offsetY, offsetY + clusterHeight - height);
    
    const center = {
      x: x + Math.floor(width / 2),
      y: y + Math.floor(height / 2)
    };
    
    const cells: Point[] = [];
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        cells.push({ x: x + dx, y: y + dy });
      }
    }
    
    return {
      id,
      type: RoomType.RECTANGULAR,
      x,
      y,
      width,
      height,
      center,
      cells,
      features: []
    };
  }

  private createCircularRoom(id: number, maxWidth: number, maxHeight: number, density: number): Room {
    const radius = Math.floor(this.random.nextInt(this.minRoomSize, this.maxRoomSize) / 2);
    
    const clusterWidth = Math.floor(maxWidth * (1 - (density * 0.5)));
    const clusterHeight = Math.floor(maxHeight * (1 - (density * 0.5)));
    const offsetX = Math.floor((maxWidth - clusterWidth) / 2);
    const offsetY = Math.floor((maxHeight - clusterHeight) / 2);
    
    const centerX = this.random.nextInt(offsetX + radius + 1, offsetX + clusterWidth - radius - 1);
    const centerY = this.random.nextInt(offsetY + radius + 1, offsetY + clusterHeight - radius - 1);
    
    const cells = Geometry.getFilledCirclePoints(centerX, centerY, radius);
    
    const borderPoints: Point[] = [];
    const numSamples = 32;
    for (let i = 0; i < numSamples; i++) {
      const angle = (2 * Math.PI * i) / numSamples;
      const bx = centerX + radius * Math.cos(angle);
      const by = centerY + radius * Math.sin(angle);
      borderPoints.push({ x: bx, y: by });
    }
    
    const x = centerX - radius;
    const y = centerY - radius;
    const diameter = radius * 2 + 1;
    
    return {
      id,
      type: RoomType.CIRCULAR,
      x,
      y,
      width: diameter,
      height: diameter,
      radius,
      center: { x: centerX, y: centerY },
      cells,
      borderPoints,
      features: []
    };
  }

  private createLShapedRoom(id: number, maxWidth: number, maxHeight: number, density: number): Room {
    const maxRoomSizeLocal = Math.min(this.maxRoomSize + 2, Math.floor(Math.min(maxWidth, maxHeight) / 2));
    
    const mainWidth = this.random.nextInt(this.minRoomSize, maxRoomSizeLocal);
    const mainHeight = this.random.nextInt(this.minRoomSize, maxRoomSizeLocal);
    
    const cutX = this.random.nextInt(this.minRoomSize, mainWidth - 2);
    const cutY = this.random.nextInt(this.minRoomSize, mainHeight - 2);
    
    const clusterWidth = Math.floor(maxWidth * (1 - (density * 0.5)));
    const clusterHeight = Math.floor(maxHeight * (1 - (density * 0.5)));
    const offsetX = Math.floor((maxWidth - clusterWidth) / 2);
    const offsetY = Math.floor((maxHeight - clusterHeight) / 2);
    
    const x = this.random.nextInt(offsetX, offsetX + clusterWidth - mainWidth);
    const y = this.random.nextInt(offsetY, offsetY + clusterHeight - mainHeight);
    
    const cells: Point[] = [];
    for (let dx = 0; dx < mainWidth; dx++) {
      for (let dy = 0; dy < mainHeight; dy++) {
        if (dx >= cutX && dy >= cutY) {
          continue;
        }
        cells.push({ x: x + dx, y: y + dy });
      }
    }
    
    const totalArea = cells.length;
    const centerX = Math.floor(cells.reduce((sum, cell) => sum + cell.x, 0) / totalArea);
    const centerY = Math.floor(cells.reduce((sum, cell) => sum + cell.y, 0) / totalArea);
    
    return {
      id,
      type: RoomType.L_SHAPED,
      x,
      y,
      width: mainWidth,
      height: mainHeight,
      center: { x: centerX, y: centerY },
      cells,
      features: []
    };
  }

  private createCaveRoom(id: number, maxWidth: number, maxHeight: number, density: number): Room {
    const baseRoom = this.random.nextBoolean()
      ? this.createRectangularRoom(id, maxWidth, maxHeight, density)
      : this.createCircularRoom(id, maxWidth, maxHeight, density);
    
    let cells = [...(baseRoom.cells || [])];
    
    const cellGrid = new Grid<boolean>(maxWidth, maxHeight, false);
    for (const cell of cells) {
      cellGrid.set(cell.x, cell.y, true);
    }
    
    const iterations = 2;
    for (let i = 0; i < iterations; i++) {
      const newGrid = cellGrid.clone();
      
      for (let x = baseRoom.x - 1; x <= baseRoom.x + (baseRoom.width || 0) + 1; x++) {
        for (let y = baseRoom.y - 1; y <= baseRoom.y + (baseRoom.height || 0) + 1; y++) {
          if (!cellGrid.isInBounds(x, y)) continue;
          
          const neighbors = cellGrid.getNeighbors(x, y, true);
          const livingNeighbors = neighbors.filter(([_, __, isAlive]) => isAlive).length;
          
          if (cellGrid.get(x, y)) {
            if (livingNeighbors < 4) {
              newGrid.set(x, y, false);
            }
          } else {
            if (livingNeighbors >= 5) {
              newGrid.set(x, y, true);
            }
          }
        }
      }
      
      cells = [];
      for (let x = baseRoom.x - 1; x <= baseRoom.x + (baseRoom.width || 0) + 1; x++) {
        for (let y = baseRoom.y - 1; y <= baseRoom.y + (baseRoom.height || 0) + 1; y++) {
          if (newGrid.isInBounds(x, y) && newGrid.get(x, y)) {
            cells.push({ x, y });
            cellGrid.set(x, y, true);
          } else if (cellGrid.isInBounds(x, y)) {
            cellGrid.set(x, y, false);
          }
        }
      }
    }
    
    if (cells.length === 0) {
      return baseRoom;
    }
    
    const bounds = cells.reduce((acc, cell) => ({
      minX: Math.min(acc.minX, cell.x),
      minY: Math.min(acc.minY, cell.y),
      maxX: Math.max(acc.maxX, cell.x),
      maxY: Math.max(acc.maxY, cell.y)
    }), { minX: cells[0].x, minY: cells[0].y, maxX: cells[0].x, maxY: cells[0].y });
    
    const totalArea = cells.length;
    const centerX = Math.floor(cells.reduce((sum, cell) => sum + cell.x, 0) / totalArea);
    const centerY = Math.floor(cells.reduce((sum, cell) => sum + cell.y, 0) / totalArea);
    
    return {
      id,
      type: RoomType.CAVE,
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX + 1,
      height: bounds.maxY - bounds.minY + 1,
      center: { x: centerX, y: centerY },
      cells,
      features: []
    };
  }

  private canPlaceRoom(room: Room, grid: Grid<boolean>, existingRooms: Room[], buffer: number): boolean {
    const minX = Math.max(0, room.x - buffer);
    const minY = Math.max(0, room.y - buffer);
    const maxX = Math.min(grid.width - 1, room.x + (room.width || 0) + buffer);
    const maxY = Math.min(grid.height - 1, room.y + (room.height || 0) + buffer);
    
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (grid.get(x, y)) {
          return false;
        }
      }
    }
    
    return true;
  }

  private markRoomCells(room: Room, grid: Grid<boolean>): void {
    if (room.cells) {
      room.cells.forEach(cell => {
        if (grid.isInBounds(cell.x, cell.y)) {
          grid.set(cell.x, cell.y, true);
        }
      });
    } else {
      for (let x = room.x; x < room.x + (room.width || 0); x++) {
        for (let y = room.y; y < room.y + (room.height || 0); y++) {
          if (grid.isInBounds(x, y)) {
            grid.set(x, y, true);
          }
        }
      }
    }
  }

  generateRoomDescriptions(rooms: Room[], theme: string): void {
    const roomDescriptors: Record<string, string[]> = {
      standard: [
        "A simple square room with stone walls.",
        "A dusty chamber with cobwebs in the corners.",
        "A room with flickering torches on the walls.",
        "A chamber with a cracked stone floor.",
        "A room with faded murals on the walls."
      ],
      cave: [
        "A natural cave with dripping stalactites.",
        "A damp cavern with glowing fungus.",
        "A rocky chamber with uneven ground.",
        "A wide cave with a small underground stream.",
        "A narrow cave passage that widens into a chamber."
      ],
      temple: [
        "A sacred chamber with ornate pillars.",
        "A room with ceremonial markings on the floor.",
        "A sanctum with religious symbols carved into the walls.",
        "A prayer chamber with stone benches.",
        "A ritual room with a raised dais."
      ],
      maze: [
        "A small chamber at an intersection of passages.",
        "A confusing room with multiple identical doorways.",
        "A chamber with directional markers carved into the floor.",
        "A small room serving as a waypoint in the labyrinth.",
        "A disorienting circular room with many exits."
      ],
      loopy: [
        "A hub room connecting several passages.",
        "A chamber that loops back on itself.",
        "A room with passages that seem to lead in circles.",
        "A crossroads chamber with worn pathways.",
        "A circular room with doorways spaced evenly around the perimeter."
      ]
    };
    
    const descriptors = roomDescriptors[theme] || roomDescriptors.standard;
    
    for (const room of rooms) {
      let specialDescription = "";
      
      if (room.type === RoomType.CIRCULAR) {
        specialDescription = " It has a perfectly circular shape.";
      } else if (room.type === RoomType.L_SHAPED) {
        specialDescription = " It has an unusual L-shaped layout.";
      } else if (room.type === RoomType.CAVE) {
        specialDescription = " It has an irregular, natural formation.";
      }
      
      const baseDescription = this.random.nextElement(descriptors);
      room.description = baseDescription + specialDescription;
    }
  }
}