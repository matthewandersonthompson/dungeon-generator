import { Room, RoomType, Point, CellType } from '../core/Types';
import { Random } from '../core/Random';
import { Geometry } from '../core/Geometry';
import { Grid } from '../core/Grid';

/**
 * Generator for dungeon rooms
 */
export class RoomGenerator {
  private random: Random;
  private minRoomSize: number;
  private maxRoomSize: number;
  private roomSizeVariation: number;
  private roomBuffer: number;
  private specialRoomChance: number;

  /**
   * Create a new room generator
   * @param seed Random seed
   * @param roomSizeVariation 0-1 value controlling variation in room sizes
   * @param specialRoomChance 0-1 chance of creating non-rectangular rooms
   */
  constructor(
    seed?: string | number,
    roomSizeVariation: number = 0.5,
    specialRoomChance: number = 0.2
  ) {
    this.random = new Random(seed);
    this.roomSizeVariation = roomSizeVariation;
    this.specialRoomChance = specialRoomChance;
    
    // Set min and max room sizes based on variation
    this.minRoomSize = 3 + Math.floor(roomSizeVariation * 2);
    this.maxRoomSize = 8 + Math.floor(roomSizeVariation * 7);
    this.roomBuffer = 1; // Base minimum space between rooms
  }

  /**
   * Generate a set of rooms for the dungeon
   * @param width Dungeon width
   * @param height Dungeon height
   * @param numRooms Target number of rooms
   * @param density 0-1 value controlling how densely packed rooms are
   * @returns Array of generated rooms
   */
  generateRooms(width: number, height: number, numRooms: number, density: number): Room[] {
    const rooms: Room[] = [];
    const maxAttempts = numRooms * 10; // Limit attempts to prevent infinite loops
    let attempts = 0;
    
    const grid = new Grid<boolean>(width, height, false);
    
    // Adjust effective buffer so that higher density allows rooms to be closer
    const effectiveBuffer = Math.max(1, Math.ceil(this.roomBuffer * (1.5 - density)));
    
    while (rooms.length < numRooms && attempts < maxAttempts) {
      attempts++;
      
      // Decide room type
      const roomType = this.selectRoomType();
      
      // Generate a room of the selected type; pass density for tighter clustering
      const room = this.createRoom(rooms.length, roomType, width, height, density);
      
      // Check if the room can be placed without overlapping
      if (this.canPlaceRoom(room, grid, rooms, effectiveBuffer)) {
        // Mark room cells as occupied
        this.markRoomCells(room, grid);
        
        // Add room to list
        rooms.push(room);
      }
    }
    
    return rooms;
  }

  /**
   * Select a room type based on configuration
   */
  private selectRoomType(): RoomType {
    if (this.random.nextFloat(0, 1) > this.specialRoomChance) {
      return RoomType.RECTANGULAR;
    }
    
    // Select from special room types
    const specialTypes = [
      RoomType.CIRCULAR,
      RoomType.L_SHAPED,
      RoomType.CAVE
    ];
    
    return this.random.nextElement(specialTypes);
  }

  /**
   * Create a room of the specified type, using density to cluster placement
   * @param id Room identifier
   * @param type Room type
   * @param maxWidth Maximum width of the dungeon
   * @param maxHeight Maximum height of the dungeon
   * @param density Density factor for room placement
   */
  private createRoom(id: number, type: RoomType, maxWidth: number, maxHeight: number, density: number): Room {
    switch (type) {
      case RoomType.RECTANGULAR:
        return this.createRectangularRoom(id, maxWidth, maxHeight, density);
      case RoomType.CIRCULAR:
        return this.createCircularRoom(id, maxWidth, maxHeight, density);
      case RoomType.L_SHAPED:
        return this.createLShapedRoom(id, maxWidth, maxHeight, density);
      case RoomType.CAVE:
        return this.createCaveRoom(id, maxWidth, maxHeight, density);
      default:
        return this.createRectangularRoom(id, maxWidth, maxHeight, density);
    }
  }

  /**
   * Create a rectangular room with clustered placement
   * @param id Room identifier
   * @param maxWidth Maximum dungeon width
   * @param maxHeight Maximum dungeon height
   * @param density Density factor (0-1) for clustering rooms
   */
  private createRectangularRoom(id: number, maxWidth: number, maxHeight: number, density: number): Room {
    // Determine room dimensions
    const width = this.random.nextInt(this.minRoomSize, this.maxRoomSize);
    const height = this.random.nextInt(this.minRoomSize, this.maxRoomSize);
    
    // Compute cluster bounds based on density.
    // Higher density => smaller cluster region (rooms are closer together)
    const clusterWidth = Math.floor(maxWidth * (1 - (density * 0.5)));
    const clusterHeight = Math.floor(maxHeight * (1 - (density * 0.5)));
    const offsetX = Math.floor((maxWidth - clusterWidth) / 2);
    const offsetY = Math.floor((maxHeight - clusterHeight) / 2);
    
    // Determine room position within the cluster
    const x = this.random.nextInt(offsetX, offsetX + clusterWidth - width);
    const y = this.random.nextInt(offsetY, offsetY + clusterHeight - height);
    
    // Calculate center
    const center = {
      x: x + Math.floor(width / 2),
      y: y + Math.floor(height / 2)
    };
    
    // Generate cell coordinates
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

  /**
   * Create a circular room with clustered placement and smooth curved walls
   * @param id Room identifier
   * @param maxWidth Maximum dungeon width
   * @param maxHeight Maximum dungeon height
   * @param density Density factor for clustering rooms
   */
  private createCircularRoom(id: number, maxWidth: number, maxHeight: number, density: number): Room {
    // Determine room radius
    const radius = Math.floor(this.random.nextInt(this.minRoomSize, this.maxRoomSize) / 2);
    
    // Compute cluster bounds
    const clusterWidth = Math.floor(maxWidth * (1 - (density * 0.5)));
    const clusterHeight = Math.floor(maxHeight * (1 - (density * 0.5)));
    const offsetX = Math.floor((maxWidth - clusterWidth) / 2);
    const offsetY = Math.floor((maxHeight - clusterHeight) / 2);
    
    // Ensure the center is far enough from the edge of the cluster
    const centerX = this.random.nextInt(offsetX + radius + 1, offsetX + clusterWidth - radius - 1);
    const centerY = this.random.nextInt(offsetY + radius + 1, offsetY + clusterHeight - radius - 1);
    
    // Generate floor cells using a filled circle algorithm
    const cells = Geometry.getFilledCirclePoints(centerX, centerY, radius);
    
    // Generate smooth border points using a parametric circle equation
    const borderPoints: Point[] = [];
    const numSamples = 32; // Increase for a smoother curve
    for (let i = 0; i < numSamples; i++) {
      const angle = (2 * Math.PI * i) / numSamples;
      const bx = centerX + radius * Math.cos(angle);
      const by = centerY + radius * Math.sin(angle);
      borderPoints.push({ x: bx, y: by });
    }
    
    // Calculate bounding box and diameter
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
      borderPoints, // New property for smooth border rendering
      features: []
    };
  }

  /**
   * Create an L-shaped room with clustered placement
   * @param id Room identifier
   * @param maxWidth Maximum dungeon width
   * @param maxHeight Maximum dungeon height
   * @param density Density factor for clustering rooms
   */
  private createLShapedRoom(id: number, maxWidth: number, maxHeight: number, density: number): Room {
    // Determine the maximum dimensions (adjusted for dungeon size)
    const maxRoomSizeLocal = Math.min(this.maxRoomSize + 2, Math.floor(Math.min(maxWidth, maxHeight) / 2));
    
    // Determine width and height of the main rectangle
    const mainWidth = this.random.nextInt(this.minRoomSize, maxRoomSizeLocal);
    const mainHeight = this.random.nextInt(this.minRoomSize, maxRoomSizeLocal);
    
    // Determine the position of the cut (to form the L shape)
    const cutX = this.random.nextInt(this.minRoomSize, mainWidth - 2);
    const cutY = this.random.nextInt(this.minRoomSize, mainHeight - 2);
    
    // Compute cluster bounds
    const clusterWidth = Math.floor(maxWidth * (1 - (density * 0.5)));
    const clusterHeight = Math.floor(maxHeight * (1 - (density * 0.5)));
    const offsetX = Math.floor((maxWidth - clusterWidth) / 2);
    const offsetY = Math.floor((maxHeight - clusterHeight) / 2);
    
    // Determine room position within the cluster
    const x = this.random.nextInt(offsetX, offsetX + clusterWidth - mainWidth);
    const y = this.random.nextInt(offsetY, offsetY + clusterHeight - mainHeight);
    
    // Generate cell coordinates, skipping the cut corner
    const cells: Point[] = [];
    for (let dx = 0; dx < mainWidth; dx++) {
      for (let dy = 0; dy < mainHeight; dy++) {
        if (dx >= cutX && dy >= cutY) {
          continue;
        }
        cells.push({ x: x + dx, y: y + dy });
      }
    }
    
    // Approximate center for the L-shaped room
    const totalArea = cells.length;
    let centerX = 0;
    let centerY = 0;
    for (const cell of cells) {
      centerX += cell.x;
      centerY += cell.y;
    }
    centerX = Math.floor(centerX / totalArea);
    centerY = Math.floor(centerY / totalArea);
    
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

  /**
   * Create a cave-like room with irregular shape and clustered placement
   * @param id Room identifier
   * @param maxWidth Maximum dungeon width
   * @param maxHeight Maximum dungeon height
   * @param density Density factor for clustering rooms
   */
  private createCaveRoom(id: number, maxWidth: number, maxHeight: number, density: number): Room {
    // Start with a rectangular or circular base using clustered placement
    const baseRoom = this.random.nextBoolean()
      ? this.createRectangularRoom(id, maxWidth, maxHeight, density)
      : this.createCircularRoom(id, maxWidth, maxHeight, density);
    
    let cells = [...(baseRoom.cells || [])];
    
    // Apply cellular automata rules to create a more organic cave shape
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
      
      // Update grid and recalc cells
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
    
    let minX = cells[0].x;
    let minY = cells[0].y;
    let maxX = cells[0].x;
    let maxY = cells[0].y;
    
    for (const cell of cells) {
      minX = Math.min(minX, cell.x);
      minY = Math.min(minY, cell.y);
      maxX = Math.max(maxX, cell.x);
      maxY = Math.max(maxY, cell.y);
    }
    
    const totalArea = cells.length;
    let centerX = 0;
    let centerY = 0;
    for (const cell of cells) {
      centerX += cell.x;
      centerY += cell.y;
    }
    centerX = Math.floor(centerX / totalArea);
    centerY = Math.floor(centerY / totalArea);
    
    return {
      id,
      type: RoomType.CAVE,
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
      center: { x: centerX, y: centerY },
      cells,
      features: []
    };
  }

  /**
   * Check if a room can be placed without overlapping existing rooms
   * @param room Room to check
   * @param grid Grid of occupied cells
   * @param existingRooms List of existing rooms
   * @param buffer Minimum distance between rooms
   */
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

  /**
   * Mark room cells as occupied in the grid
   * @param room Room to mark
   * @param grid Grid to update
   */
  private markRoomCells(room: Room, grid: Grid<boolean>): void {
    if (room.cells) {
      for (const cell of room.cells) {
        if (grid.isInBounds(cell.x, cell.y)) {
          grid.set(cell.x, cell.y, true);
        }
      }
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

  /**
   * Generate descriptions for rooms
   * @param rooms Rooms to describe
   * @param theme Dungeon theme
   */
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
