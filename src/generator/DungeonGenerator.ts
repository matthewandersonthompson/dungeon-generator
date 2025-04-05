import { Dungeon, DungeonParams, CellType, Room, Corridor, Door, Feature, Point } from '../core/Types';
import { Grid } from '../core/Grid';
import { Random } from '../core/Random';
import { RoomGenerator } from './RoomGenerator';
import { CorridorGenerator } from './CorridorGenerator';
import { DoorGenerator } from './DoorGenerator';
import { FeatureGenerator } from './FeatureGenerator';
import { DungeonParamsBuilder } from './DungeonParams';

export class DungeonGenerator {
  private params: DungeonParams;
  private random: Random;
  private grid: Grid<CellType>;
  private generators: {
    room: RoomGenerator;
    corridor: CorridorGenerator;
    door: DoorGenerator;
    feature: FeatureGenerator;
  };

  constructor(params: Partial<DungeonParams> = {}) {
    this.params = DungeonParamsBuilder.validateAndNormalize(params);
    this.random = new Random(this.params.seed);
    this.grid = new Grid<CellType>(this.params.width, this.params.height, CellType.EMPTY);
    
    const { seed, theme } = this.params;
    this.generators = {
      room: new RoomGenerator(seed, this.params.roomSizeVariation, this.params.specialRoomChance),
      corridor: new CorridorGenerator(
        seed, 
        this.params.corridorWidth, 
        this.params.createLoops, 
        this.params.loopChance, 
        this.params.hallwayStyle
      ),
      door: new DoorGenerator(seed, this.params.doorFrequency, this.params.secretDoorChance),
      feature: new FeatureGenerator(seed, this.params.featureDensity, theme)
    };
  }

  generate(): Dungeon {
    const { width, height, numRooms, roomDensity, theme } = this.params;
    const { room: roomGen, corridor: corridorGen, door: doorGen, feature: featureGen } = this.generators;

    // Generate rooms and descriptions
    const rooms = roomGen.generateRooms(width, height, numRooms, roomDensity);
    roomGen.generateRoomDescriptions(rooms, theme);

    // Generate corridors
    const corridors = corridorGen.generateCorridors(rooms, width, height);

    // Build grid with rooms and corridors
    this.buildGrid(rooms, corridors);

    // Place doors, features, and entry/exit points
    const doors = doorGen.placeDoors(rooms, corridors, this.grid);
    const features = featureGen.generateFeatures(rooms, this.grid);
    const { entrance, exit } = featureGen.placeEntranceAndExit(rooms, this.grid);

    return {
      width,
      height,
      grid: this.grid.getData(),
      rooms,
      corridors,
      doors,
      features,
      entrance,
      exit,
      seed: this.params.seed || this.random.next(),
      theme
    };
  }

  private buildGrid(rooms: Room[], corridors: Corridor[]): void {
    const { width, height } = this.params;

    // Fill grid with walls
    this.grid.fill(CellType.WALL);

    // Place rooms
    rooms.forEach(room => {
      if (room.cells) {
        room.cells.forEach(cell => this.grid.set(cell.x, cell.y, CellType.FLOOR));
      } else if (room.width && room.height) {
        for (let x = room.x; x < room.x + room.width; x++) {
          for (let y = room.y; y < room.y + room.height; y++) {
            this.grid.set(x, y, CellType.FLOOR);
          }
        }
      } else if (room.radius) {
        const { center: { x: centerX, y: centerY }, radius } = room;
        
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
    });

    // Place corridors
    corridors.forEach(corridor => {
      corridor.path.forEach(point => {
        this.grid.set(point.x, point.y, CellType.CORRIDOR);
        
        if (corridor.width > 1) {
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            const nx = point.x + dx;
            const ny = point.y + dy;
            
            if (this.grid.isInBounds(nx, ny) && 
                this.grid.get(nx, ny) === CellType.WALL) {
              this.grid.set(nx, ny, CellType.CORRIDOR);
            }
          });
        }
      });
    });
  }

  static createDefault(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createDefault());
  }

  static createSmall(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createSmall());
  }

  static createLarge(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createLarge());
  }

  static createCave(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createCave());
  }

  static createMaze(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createMaze());
  }

  static createLoopy(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createLoopy());
  }

  static createTemple(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createTemple());
  }
}