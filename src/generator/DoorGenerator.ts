import { Room, Corridor, Door, CellType, Point } from '../core/Types';
import { Random } from '../core/Random';
import { Grid } from '../core/Grid';

export class DoorGenerator {
  private random: Random;
  private doorFrequency: number;
  private secretDoorChance: number;

  constructor(
    seed?: string | number,
    doorFrequency = 0.8,
    secretDoorChance = 0.1
  ) {
    this.random = new Random(seed);
    this.doorFrequency = Math.min(Math.max(0, doorFrequency), 1);
    this.secretDoorChance = Math.min(Math.max(0, secretDoorChance), 1);
  }

  placeDoors(rooms: Room[], corridors: Corridor[], grid: Grid<CellType>): Door[] {
    const doors: Door[] = [];
    
    for (const corridor of corridors) {
      const path = corridor.path;
      if (path.length < 2) continue;
      
      this.checkCorridorEntrances(doors, corridor, grid);
    }
    
    return doors;
  }

  private checkCorridorEntrances(
    doors: Door[], 
    corridor: Corridor, 
    grid: Grid<CellType>
  ): void {
    const path = corridor.path;
    const checkPoints = [
      { entrance: path[0], reference: path[1] },
      { entrance: path[path.length - 1], reference: path[path.length - 2] }
    ];

    checkPoints.forEach(({ entrance, reference }) => {
      this.tryPlaceDoor(
        doors, 
        corridor.from, 
        corridor.to, 
        entrance, 
        reference, 
        grid
      );
    });
  }

  private tryPlaceDoor(
    doors: Door[], 
    roomId: number, 
    otherRoomId: number, 
    point: Point,
    directionPoint: Point,
    grid: Grid<CellType>
  ): void {
    if (this.random.nextFloat(0, 1) > this.doorFrequency) return;
    
    // Safely get cell types with a default value
    const pointValue = grid.get(point.x, point.y) ?? CellType.EMPTY;
    const directionValue = grid.get(directionPoint.x, directionPoint.y) ?? CellType.EMPTY;
    
    // Check if this is a valid door location (transition between floor and corridor)
    const isDoorLocation = 
      (pointValue === CellType.FLOOR && directionValue === CellType.CORRIDOR) ||
      (pointValue === CellType.CORRIDOR && directionValue === CellType.FLOOR);

    if (!isDoorLocation) return;

    // Determine if it should be a secret door
    const doorType = this.random.nextFloat(0, 1) < this.secretDoorChance
      ? CellType.SECRET_DOOR
      : CellType.DOOR;
    
    const door: Door = {
      x: point.x,
      y: point.y,
      type: doorType,
      connects: [roomId, otherRoomId]
    };
    
    doors.push(door);
    grid.set(point.x, point.y, doorType);
  }

  /**
   * Find potential door locations between two rooms
   * @param roomA First room
   * @param roomB Second room
   * @param grid Dungeon grid
   * @returns Array of potential door positions
   */
  private findPotentialDoorLocations(roomA: Room, roomB: Room, grid: Grid<CellType>): Point[] {
    if (!roomA.cells || !roomB.cells) return [];
    
    const wallsA = this.findRoomWalls(roomA, grid);
    const wallsB = this.findRoomWalls(roomB, grid);
    
    // Find pairs of walls that are adjacent
    return wallsA.flatMap(wallA => 
      wallsB.filter(wallB => {
        const dx = Math.abs(wallA.x - wallB.x);
        const dy = Math.abs(wallA.y - wallB.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
      }).map(wallB => ({
        x: Math.floor((wallA.x + wallB.x) / 2),
        y: Math.floor((wallA.y + wallB.y) / 2)
      }))
    );
  }

  /**
   * Find wall cells for a room
   * @param room Room to find walls for
   * @param grid Dungeon grid
   * @returns Array of wall cell positions
   */
  private findRoomWalls(room: Room, grid: Grid<CellType>): Point[] {
    if (!room.cells) {
      if (!room.width || !room.height) return [];
      
      // For rectangular rooms without explicit cells
      const walls: Point[] = [];
      const { x, y, width, height } = room;
      
      for (let i = x; i < x + width; i++) {
        walls.push({ x: i, y }, { x: i, y: y + height - 1 });
      }
      
      for (let j = y + 1; j < y + height - 1; j++) {
        walls.push({ x, y: j }, { x: x + width - 1, y: j });
      }
      
      return walls;
    }
    
    // For rooms with explicit cells
    return room.cells.filter(cell => {
      // Check if this cell has at least one non-room neighbor
      const adjacentCells = [
        { x: cell.x - 1, y: cell.y },
        { x: cell.x + 1, y: cell.y },
        { x: cell.x, y: cell.y - 1 },
        { x: cell.x, y: cell.y + 1 }
      ];
      
      return adjacentCells.some(neighbor => 
        grid.isInBounds(neighbor.x, neighbor.y) && 
        [CellType.EMPTY, CellType.WALL].includes(grid.get(neighbor.x, neighbor.y) ?? CellType.EMPTY)
      );
    });
  }
}