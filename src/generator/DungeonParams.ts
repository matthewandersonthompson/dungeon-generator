import { DungeonParams } from '../core/Types';

export class DungeonParamsBuilder {
  static createDefault(): DungeonParams {
    return {
      width: 50,
      height: 50,
      numRooms: 15,
      roomDensity: 0.8,
      roomSizeVariation: 0.5,
      specialRoomChance: 0.2,
      corridorWidth: 1,
      createLoops: false,
      loopChance: 0,
      featureDensity: 0.5,
      theme: 'standard',
      hallwayStyle: 'bendy',
      doorFrequency: 0.8,
      secretDoorChance: 0.1
    };
  }

  static createSmall(): DungeonParams {
    return { ...this.createDefault(), width: 30, height: 30, numRooms: 5 };
  }

  static createLarge(): DungeonParams {
    return { ...this.createDefault(), width: 80, height: 80, numRooms: 30 };
  }

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

  static createLoopy(): DungeonParams {
    return {
      ...this.createDefault(),
      createLoops: false,
      loopChance: 0,
      hallwayStyle: 'straight',
      theme: 'loopy'
    };
  }

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

  static customize(customizer: (params: DungeonParams) => DungeonParams): DungeonParams {
    return customizer(this.createDefault());
  }

  static validateAndNormalize(params: Partial<DungeonParams>): DungeonParams {
    const clamp = (value: number, min = 0, max = 1) => 
      Math.min(max, Math.max(min, value));

    const defaults = this.createDefault();
    const normalized: DungeonParams = { ...defaults, ...params };

    // Validate dimensions and room count
    normalized.width = Math.max(10, normalized.width);
    normalized.height = Math.max(10, normalized.height);
    const maxRooms = Math.floor((normalized.width * normalized.height) / 25);
    normalized.numRooms = Math.min(maxRooms, Math.max(1, normalized.numRooms));

    // Clamp probability values
    const probabilityKeys = [
      'roomDensity', 
      'roomSizeVariation', 
      'specialRoomChance', 
      'loopChance', 
      'featureDensity', 
      'doorFrequency', 
      'secretDoorChance'
    ] as const;

    probabilityKeys.forEach(key => {
      const value = normalized[key];
      normalized[key] = clamp(value as number);
    });

    // Validate corridor width
    normalized.corridorWidth = Math.max(1, Math.min(3, normalized.corridorWidth));

    return normalized;
  }
}