import { DungeonParams } from '../core/Types';

/**
 * Default parameters for dungeon generation with methods to create and customize them
 */
export class DungeonParamsBuilder {
  /**
   * Create a default set of dungeon parameters
   */
  static createDefault(): DungeonParams {
    return {
      width: 50,
      height: 50,
      numRooms: 15,
      roomDensity: 0.8, // Increased density for closer rooms
      roomSizeVariation: 0.5,
      specialRoomChance: 0.2,
      corridorWidth: 1,
      createLoops: false, // Disable additional loop corridors to ensure one hallway per room pair
      loopChance: 0,      // No extra loops
      featureDensity: 0.5,
      theme: 'standard',
      hallwayStyle: 'bendy',
      doorFrequency: 0.8,
      secretDoorChance: 0.1
    };
  }

  /**
   * Create a set of parameters for a small dungeon
   */
  static createSmall(): DungeonParams {
    return {
      ...this.createDefault(),
      width: 30,
      height: 30,
      numRooms: 5,
      roomDensity: 0.8
    };
  }

  /**
   * Create a set of parameters for a large dungeon
   */
  static createLarge(): DungeonParams {
    return {
      ...this.createDefault(),
      width: 80,
      height: 80,
      numRooms: 30,
      roomDensity: 0.8
    };
  }

  /**
   * Create a set of parameters for a cave-like dungeon
   */
  static createCave(): DungeonParams {
    return {
      ...this.createDefault(),
      roomDensity: 0.7,
      roomSizeVariation: 0.8,
      specialRoomChance: 0.4,
      hallwayStyle: 'organic',
      theme: 'cave'
    };
  }

  /**
   * Create a set of parameters for a maze-like dungeon
   */
  static createMaze(): DungeonParams {
    return {
      ...this.createDefault(),
      numRooms: 10,
      roomDensity: 0.3,
      roomSizeVariation: 0.3,
      createLoops: false,
      hallwayStyle: 'bendy',
      theme: 'maze'
    };
  }

  /**
   * Create a set of parameters for a dungeon with many loops
   */
  static createLoopy(): DungeonParams {
    return {
      ...this.createDefault(),
      createLoops: false, // Still ensuring only one hallway per room
      loopChance: 0,
      hallwayStyle: 'straight',
      theme: 'loopy'
    };
  }

  /**
   * Create a set of parameters for a temple-like dungeon with many features
   */
  static createTemple(): DungeonParams {
    return {
      ...this.createDefault(),
      specialRoomChance: 0.4,
      featureDensity: 0.8,
      doorFrequency: 1.0,
      secretDoorChance: 0.2,
      theme: 'temple'
    };
  }

  /**
   * Create a custom set of parameters by modifying the default ones
   * @param customizer Function that takes the default parameters and returns modified ones
   */
  static customize(customizer: (params: DungeonParams) => DungeonParams): DungeonParams {
    return customizer(this.createDefault());
  }

  /**
   * Validate and normalize dungeon parameters
   * @param params Parameters to validate
   * @returns Validated and normalized parameters
   */
  static validateAndNormalize(params: Partial<DungeonParams>): DungeonParams {
    const defaults = this.createDefault();
    const normalized: DungeonParams = { ...defaults, ...params };

    // Ensure minimum dimensions
    normalized.width = Math.max(10, normalized.width);
    normalized.height = Math.max(10, normalized.height);

    // Ensure a reasonable room count
    const maxRooms = Math.floor((normalized.width * normalized.height) / 25);
    normalized.numRooms = Math.min(maxRooms, Math.max(1, normalized.numRooms));

    // Clamp probability values between 0 and 1
    normalized.roomDensity = Math.min(1, Math.max(0, normalized.roomDensity));
    normalized.roomSizeVariation = Math.min(1, Math.max(0, normalized.roomSizeVariation));
    normalized.specialRoomChance = Math.min(1, Math.max(0, normalized.specialRoomChance));
    normalized.loopChance = Math.min(1, Math.max(0, normalized.loopChance));
    normalized.featureDensity = Math.min(1, Math.max(0, normalized.featureDensity));
    normalized.doorFrequency = Math.min(1, Math.max(0, normalized.doorFrequency));
    normalized.secretDoorChance = Math.min(1, Math.max(0, normalized.secretDoorChance));

    // Ensure valid corridor width
    normalized.corridorWidth = Math.max(1, Math.min(3, normalized.corridorWidth));

    return normalized;
  }
}
