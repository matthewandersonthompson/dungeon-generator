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
      secretDoorChance: 0.1,
      roomTemplateWeights: {
        'rectangular': 0.6,
        'circular': 0.1,
        'l-shaped': 0.08,
        'star-shaped': 0.08,
        'cross-shaped': 0.08,
        'north-star-shaped': 0.06, // Add these new types
        'octagon-shaped': 0.06     // Add these new types
      }
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
      theme: 'cave',
      roomTemplateWeights: {
        'rectangular': 0.3,
        'circular': 0.2,
        'l-shaped': 0.1,
        'star-shaped': 0.1,
        'cross-shaped': 0.05,
        'north-star-shaped': 0.05,
        'octagon-shaped': 0.1,
        'cave': 0.3
      }
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
      theme: 'maze',
      roomTemplateWeights: {
        'rectangular': 0.7,
        'circular': 0.1,
        'l-shaped': 0.1,
        'octagon-shaped': 0.1
      }
    };
  }

  static createLoopy(): DungeonParams {
    return {
      ...this.createDefault(),
      createLoops: true,
      loopChance: 0.5,
      hallwayStyle: 'straight',
      theme: 'loopy',
      roomTemplateWeights: {
        'rectangular': 0.5,
        'circular': 0.2,
        'cross-shaped': 0.1,
        'star-shaped': 0.1,
        'north-star-shaped': 0.1
      }
    };
  }

  static createTemple(): DungeonParams {
    return {
      ...this.createDefault(),
      specialRoomChance: 0.4,
      featureDensity: 0.8,
      doorFrequency: 1.0,
      secretDoorChance: 0.2,
      theme: 'temple',
      roomTemplateWeights: {
        'rectangular': 0.3,
        'circular': 0.2,
        'cross-shaped': 0.2,
        'star-shaped': 0.15,
        'octagon-shaped': 0.15
      }
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

    // Ensure room template weights are present
    if (!normalized.roomTemplateWeights) {
      normalized.roomTemplateWeights = defaults.roomTemplateWeights;
    }

    return normalized;
  }
}