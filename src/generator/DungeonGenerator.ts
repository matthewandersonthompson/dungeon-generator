import { Dungeon, DungeonParams, CellType, Room, Corridor, Door, Feature, Point } from '../core/Types';
import { Grid } from '../core/Grid';
import { Random } from '../core/Random';
import { RoomGenerator } from './RoomGenerator';
import { CorridorGenerator } from './CorridorGenerator';
import { DoorGenerator } from './DoorGenerator';
import { FeatureGenerator } from './FeatureGenerator';
import { DungeonParamsBuilder } from './DungeonParams';

/**
 * Main dungeon generator that uses all other components
 */
export class DungeonGenerator {
  private params: DungeonParams;
  private random: Random;
  private grid: Grid<CellType>;
  private roomGenerator: RoomGenerator;
  private corridorGenerator: CorridorGenerator;
  private doorGenerator: DoorGenerator;
  private featureGenerator: FeatureGenerator;

  /**
   * Create a new dungeon generator
   * @param params Parameters for dungeon generation
   */
  constructor(params: Partial<DungeonParams> = {}) {
    // Validate and normalize parameters
    this.params = DungeonParamsBuilder.validateAndNormalize(params);
    
    // Create a random number generator
    this.random = new Random(this.params.seed);
    
    // Create the grid
    this.grid = new Grid<CellType>(this.params.width, this.params.height, CellType.EMPTY);
    
    // Initialize component generators
    this.roomGenerator = new RoomGenerator(
      this.params.seed,
      this.params.roomSizeVariation,
      this.params.specialRoomChance
    );
    
    this.corridorGenerator = new CorridorGenerator(
      this.params.seed,
      this.params.corridorWidth,
      this.params.createLoops,
      this.params.loopChance,
      this.params.hallwayStyle
    );
    
    this.doorGenerator = new DoorGenerator(
      this.params.seed,
      this.params.doorFrequency,
      this.params.secretDoorChance
    );
    
    this.featureGenerator = new FeatureGenerator(
      this.params.seed,
      this.params.featureDensity,
      this.params.theme
    );
  }

  /**
   * Generate a complete dungeon
   * @returns Generated dungeon
   */
  generate(): Dungeon {
    // Step 1: Generate rooms
    const rooms = this.roomGenerator.generateRooms(
      this.params.width,
      this.params.height,
      this.params.numRooms,
      this.params.roomDensity
    );
    
    // Add room descriptions
    this.roomGenerator.generateRoomDescriptions(rooms, this.params.theme);
    
    // Step 2: Generate corridors
    const corridors = this.corridorGenerator.generateCorridors(
      rooms,
      this.params.width,
      this.params.height
    );
    
    // Step 3: Build the grid
    this.buildGrid(rooms, corridors);
    
    // Step 4: Place doors
    const doors = this.doorGenerator.placeDoors(rooms, corridors, this.grid);
    
    // Step 5: Add features
    const features = this.featureGenerator.generateFeatures(rooms, this.grid);
    
    // Step 6: Place entrance and exit
    const { entrance, exit } = this.featureGenerator.placeEntranceAndExit(rooms, this.grid);
    
    // Create the dungeon object
    const dungeon: Dungeon = {
      width: this.params.width,
      height: this.params.height,
      grid: this.grid.getData(),
      rooms,
      corridors,
      doors,
      features,
      entrance,
      exit,
      seed: this.params.seed || this.random.next(), // Use the actual seed
      theme: this.params.theme
    };
    
    return dungeon;
  }

  /**
   * Build the grid based on rooms and corridors
   * @param rooms Array of rooms
   * @param corridors Array of corridors
   */
  private buildGrid(rooms: Room[], corridors: Corridor[]): void {
    // Start with an empty grid
    this.grid.fill(CellType.EMPTY);
    
    // Place walls everywhere initially
    for (let x = 0; x < this.params.width; x++) {
      for (let y = 0; y < this.params.height; y++) {
        this.grid.set(x, y, CellType.WALL);
      }
    }
    
    // Add rooms to the grid
    for (const room of rooms) {
      if (room.cells) {
        // For rooms with defined cells
        for (const cell of room.cells) {
          this.grid.set(cell.x, cell.y, CellType.FLOOR);
        }
      } else if (room.width && room.height) {
        // For rectangular rooms
        for (let x = room.x; x < room.x + room.width; x++) {
          for (let y = room.y; y < room.y + room.height; y++) {
            this.grid.set(x, y, CellType.FLOOR);
          }
        }
      } else if (room.radius) {
        // For circular rooms
        const centerX = room.center.x;
        const centerY = room.center.y;
        const radius = room.radius;
        
        for (let x = centerX - radius; x <= centerX + radius; x++) {
          for (let y = centerY - radius; y <= centerY + radius; y++) {
            if (this.grid.isInBounds(x, y)) {
              const dx = x - centerX;
              const dy = y - centerY;
              if (dx * dx + dy * dy <= radius * radius) {
                this.grid.set(x, y, CellType.FLOOR);
              }
            }
          }
        }
      }
    }
    
    // Add corridors to the grid
    for (const corridor of corridors) {
      const path = corridor.path;
      
      for (const point of path) {
        this.grid.set(point.x, point.y, CellType.CORRIDOR);
        
        // For wider corridors, also set adjacent cells
        if (corridor.width > 1) {
          const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          
          for (const [dx, dy] of offsets) {
            const nx = point.x + dx;
            const ny = point.y + dy;
            
            if (this.grid.isInBounds(nx, ny) && 
                this.grid.get(nx, ny) === CellType.WALL) {
              this.grid.set(nx, ny, CellType.CORRIDOR);
            }
          }
        }
      }
    }
  }

  /**
   * Create a new dungeon generator with default parameters
   */
  static createDefault(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createDefault());
  }

  /**
   * Create a new dungeon generator for a small dungeon
   */
  static createSmall(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createSmall());
  }

  /**
   * Create a new dungeon generator for a large dungeon
   */
  static createLarge(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createLarge());
  }

  /**
   * Create a new dungeon generator for a cave-like dungeon
   */
  static createCave(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createCave());
  }

  /**
   * Create a new dungeon generator for a maze-like dungeon
   */
  static createMaze(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createMaze());
  }

  /**
   * Create a new dungeon generator for a loopy dungeon
   */
  static createLoopy(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createLoopy());
  }

  /**
   * Create a new dungeon generator for a temple-like dungeon
   */
  static createTemple(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createTemple());
  }
}