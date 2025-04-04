import { Room, Corridor, Door, CellType, Point } from '../core/Types';
import { Random } from '../core/Random';
import { Grid } from '../core/Grid';

/**
 * Generator for doors in the dungeon
 */
export class DoorGenerator {
  private random: Random;
  private doorFrequency: number;
  private secretDoorChance: number;

  /**
   * Create a new door generator
   * @param seed Random seed
   * @param doorFrequency Frequency of doors at corridor entrances (0-1)
   * @param secretDoorChance Chance for a door to be secret (0-1)
   */
  constructor(
    seed?: string | number,
    doorFrequency: number = 0.8,
    secretDoorChance: number = 0.1
  ) {
    this.random = new Random(seed);
    this.doorFrequency = Math.max(0, Math.min(1, doorFrequency));
    this.secretDoorChance = Math.max(0, Math.min(1, secretDoorChance));
  }

  /**
   * Place doors at corridor entrances
   * @param rooms List of rooms
   * @param corridors List of corridors
   * @param grid Dungeon grid
   * @returns Array of door objects
   */
  placeDoors(rooms: Room[], corridors: Corridor[], grid: Grid<CellType>): Door[] {
    const doors: Door[] = [];
    
    // For each corridor, find entrance and exit points
    for (const corridor of corridors) {
      // Get the first and last points of the path
      const path = corridor.path;
      if (path.length < 2) continue;
      
      const roomFromId = corridor.from;
      const roomToId = corridor.to;
      
      // Check the entrance points for possible door locations
      this.checkForDoorLocation(doors, roomFromId, roomToId, path[0], path[1], grid);
      this.checkForDoorLocation(doors, roomToId, roomFromId, path[path.length - 1], path[path.length - 2], grid);
    }
    
    return doors;
  }

  /**
   * Check if a door can be placed at a corridor entrance
   * @param doors List of doors to add to
   * @param roomId ID of the room the door connects to
   * @param otherRoomId ID of the room on the other side
   * @param point Point to check for door placement
   * @param directionPoint Point used to determine door orientation
   * @param grid Dungeon grid
   */
  private checkForDoorLocation(
    doors: Door[], 
    roomId: number, 
    otherRoomId: number, 
    point: Point,
    directionPoint: Point,
    grid: Grid<CellType>
  ): void {
    // Only place a door with the configured frequency
    if (this.random.nextFloat(0, 1) > this.doorFrequency) {
      return;
    }
    
    // Get the wall orientation
    const dx = directionPoint.x - point.x;
    const dy = directionPoint.y - point.y;
    
    // Check if we're at a wall (transition between floor and corridor)
    const pointValue = grid.get(point.x, point.y);
    const directionValue = grid.get(directionPoint.x, directionPoint.y);
    
    if (
      (pointValue === CellType.FLOOR && directionValue === CellType.CORRIDOR) ||
      (pointValue === CellType.CORRIDOR && directionValue === CellType.FLOOR)
    ) {
      // Determine if it should be a regular or secret door
      const doorType = this.random.nextFloat(0, 1) < this.secretDoorChance
        ? CellType.SECRET_DOOR
        : CellType.DOOR;
      
      // Create a new door
      const door: Door = {
        x: point.x,
        y: point.y,
        type: doorType,
        connects: [roomId, otherRoomId]
      };
      
      // Add to the list and update the grid
      doors.push(door);
      grid.set(point.x, point.y, doorType);
    }
  }

  /**
   * Find possible door locations between two rooms
   * @param roomA First room
   * @param roomB Second room
   * @param grid Dungeon grid
   * @returns Array of potential door locations
   */
  private findPotentialDoorLocations(roomA: Room, roomB: Room, grid: Grid<CellType>): Point[] {
    const potentialLocations: Point[] = [];
    
    // Only consider rooms with defined cells
    if (!roomA.cells || !roomB.cells) {
      return potentialLocations;
    }
    
    // Find walls of room A
    const wallsA = this.findRoomWalls(roomA, grid);
    
    // Find walls of room B
    const wallsB = this.findRoomWalls(roomB, grid);
    
    // Find walls that are adjacent
    for (const wallA of wallsA) {
      for (const wallB of wallsB) {
        // Check if walls are directly adjacent
        const dx = Math.abs(wallA.x - wallB.x);
        const dy = Math.abs(wallA.y - wallB.y);
        
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
          // Find the midpoint for door placement
          const doorX = Math.floor((wallA.x + wallB.x) / 2);
          const doorY = Math.floor((wallA.y + wallB.y) / 2);
          
          potentialLocations.push({ x: doorX, y: doorY });
        }
      }
    }
    
    return potentialLocations;
  }

  /**
   * Find all wall cells of a room
   * @param room Room to find walls for
   * @param grid Dungeon grid
   * @returns Array of wall points
   */
  private findRoomWalls(room: Room, grid: Grid<CellType>): Point[] {
    const walls: Point[] = [];
    
    // Without defined cells, use the rectangular boundary
    if (!room.cells) {
      if (!room.width || !room.height) return walls;
      
      // Top and bottom walls
      for (let x = room.x; x < room.x + room.width; x++) {
        walls.push({ x, y: room.y });
        walls.push({ x, y: room.y + room.height - 1 });
      }
      
      // Left and right walls
      for (let y = room.y + 1; y < room.y + room.height - 1; y++) {
        walls.push({ x: room.x, y });
        walls.push({ x: room.x + room.width - 1, y });
      }
      
      return walls;
    }
    
    // For cells-defined rooms, find cells that border empty or wall cells
    for (const cell of room.cells) {
      // Check the 4 adjacent cells
      const neighbors = [
        { x: cell.x - 1, y: cell.y },
        { x: cell.x + 1, y: cell.y },
        { x: cell.x, y: cell.y - 1 },
        { x: cell.x, y: cell.y + 1 }
      ];
      
      for (const neighbor of neighbors) {
        if (!grid.isInBounds(neighbor.x, neighbor.y)) continue;
        
        const value = grid.get(neighbor.x, neighbor.y);
        if (value === CellType.EMPTY || value === CellType.WALL) {
          walls.push(cell);
          break;
        }
      }
    }
    
    return walls;
  }
}