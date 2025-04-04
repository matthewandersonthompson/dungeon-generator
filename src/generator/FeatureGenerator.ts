import { Room, Feature, CellType, Point } from '../core/Types';
import { Random } from '../core/Random';
import { Grid } from '../core/Grid';

/**
 * Generator for dungeon features (treasures, traps, decorations, etc.)
 */
export class FeatureGenerator {
  private random: Random;
  private featureDensity: number;
  private theme: string;

  /**
   * Create a new feature generator
   * @param seed Random seed
   * @param featureDensity Density of features (0-1)
   * @param theme Dungeon theme
   */
  constructor(
    seed?: string | number,
    featureDensity: number = 0.5,
    theme: string = 'standard'
  ) {
    this.random = new Random(seed);
    this.featureDensity = Math.max(0, Math.min(1, featureDensity));
    this.theme = theme;
  }

  /**
   * Generate features for rooms
   * @param rooms Array of rooms to add features to
   * @param grid Dungeon grid
   * @returns Array of generated features
   */
  generateFeatures(rooms: Room[], grid: Grid<CellType>): Feature[] {
    const allFeatures: Feature[] = [];
    
    // Process each room
    for (const room of rooms) {
      const features = this.generateRoomFeatures(room, grid);
      
      // Update the room's features
      room.features = features;
      
      // Add to the global list
      allFeatures.push(...features);
      
      // Update the grid with new features
      for (const feature of features) {
        grid.set(feature.x, feature.y, feature.type);
      }
    }
    
    return allFeatures;
  }

  /**
   * Generate features for a single room
   * @param room Room to add features to
   * @param grid Dungeon grid
   * @returns Array of features for the room
   */
  private generateRoomFeatures(room: Room, grid: Grid<CellType>): Feature[] {
    const features: Feature[] = [];
    
    // Get available floor cells
    const floorCells = this.getAvailableFloorCells(room, grid);
    if (floorCells.length === 0) {
      return features;
    }
    
    // Determine number of features based on room size and density
    const roomSize = floorCells.length;
    const maxFeatures = Math.max(1, Math.ceil(roomSize * this.featureDensity / 10));
    const featureCount = this.random.nextInt(0, maxFeatures);
    
    // Generate the features
    for (let i = 0; i < featureCount; i++) {
      if (floorCells.length === 0) break;
      
      // Pick a random cell
      const cellIndex = this.random.nextInt(0, floorCells.length - 1);
      const cell = floorCells[cellIndex];
      
      // Remove this cell from available cells
      floorCells.splice(cellIndex, 1);
      
      // Generate a feature at this location
      const feature = this.createFeature(room.id, cell, room);
      if (feature) {
        features.push(feature);
        
        // Mark surrounding cells as used to avoid crowding
        this.markSurroundingCellsAsUsed(cell, floorCells);
      }
    }
    
    return features;
  }

  /**
   * Create a feature at the specified location
   * @param roomId ID of the room
   * @param location Location for the feature
   * @param room Room containing the feature
   * @returns Created feature or null
   */
  private createFeature(roomId: number, location: Point, room: Room): Feature | null {
    // Determine the feature type based on room type and theme
    const featureType = this.selectFeatureType(room);
    
    // Generate a description for the feature
    const description = this.getFeatureDescription(featureType);
    
    return {
      x: location.x,
      y: location.y,
      type: featureType,
      description,
      roomId
    };
  }

  /**
   * Get available floor cells in a room
   * @param room Room to check
   * @param grid Dungeon grid
   * @returns Array of floor cells
   */
  private getAvailableFloorCells(room: Room, grid: Grid<CellType>): Point[] {
    const floorCells: Point[] = [];
    
    // Use room cells if defined
    if (room.cells) {
      for (const cell of room.cells) {
        const cellType = grid.get(cell.x, cell.y);
        if (cellType === CellType.FLOOR) {
          floorCells.push(cell);
        }
      }
      return floorCells;
    }
    
    // Otherwise use rectangular area
    if (!room.width || !room.height) {
      return floorCells;
    }
    
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        const cellType = grid.get(x, y);
        if (cellType === CellType.FLOOR) {
          floorCells.push({ x, y });
        }
      }
    }
    
    return floorCells;
  }

  /**
   * Mark surrounding cells as used to prevent crowding
   * @param center Central cell
   * @param availableCells List of available cells to update
   */
  private markSurroundingCellsAsUsed(center: Point, availableCells: Point[]): void {
    // Remove cells in a small radius around the feature
    const bufferSize = 1;
    
    for (let i = availableCells.length - 1; i >= 0; i--) {
      const cell = availableCells[i];
      const dx = Math.abs(cell.x - center.x);
      const dy = Math.abs(cell.y - center.y);
      
      if (dx <= bufferSize && dy <= bufferSize) {
        availableCells.splice(i, 1);
      }
    }
  }

  /**
   * Select a feature type based on room and theme
   * @param room Room to place feature in
   * @returns Feature type
   */
  private selectFeatureType(room: Room): CellType {
    // Define feature type probabilities based on theme
    const featureProbabilities: Record<string, Partial<Record<CellType, number>>> = {
      'standard': {
        [CellType.PILLAR]: 0.25,
        [CellType.STATUE]: 0.10,
        [CellType.FOUNTAIN]: 0.05,
        [CellType.ALTAR]: 0.05,
        [CellType.TRAP]: 0.15,
        [CellType.TREASURE]: 0.15,
        [CellType.MONSTER]: 0.25
      },
      'cave': {
        [CellType.PILLAR]: 0.05,
        [CellType.STATUE]: 0.05,
        [CellType.FOUNTAIN]: 0.15,
        [CellType.ALTAR]: 0.05,
        [CellType.TRAP]: 0.20,
        [CellType.TREASURE]: 0.20,
        [CellType.MONSTER]: 0.30,
        [CellType.WATER]: 0.20
      },
      'temple': {
        [CellType.PILLAR]: 0.30,
        [CellType.STATUE]: 0.25,
        [CellType.FOUNTAIN]: 0.10,
        [CellType.ALTAR]: 0.20,
        [CellType.TRAP]: 0.05,
        [CellType.TREASURE]: 0.05,
        [CellType.MONSTER]: 0.05
      },
      'maze': {
        [CellType.PILLAR]: 0.10,
        [CellType.STATUE]: 0.05,
        [CellType.FOUNTAIN]: 0.05,
        [CellType.ALTAR]: 0.05,
        [CellType.TRAP]: 0.30,
        [CellType.TREASURE]: 0.15,
        [CellType.MONSTER]: 0.30
      },
      'loopy': {
        [CellType.PILLAR]: 0.20,
        [CellType.STATUE]: 0.15,
        [CellType.FOUNTAIN]: 0.10,
        [CellType.ALTAR]: 0.10,
        [CellType.TRAP]: 0.15,
        [CellType.TREASURE]: 0.15,
        [CellType.MONSTER]: 0.15
      }
    };
    
    // Default to standard if theme not found
    const themeProbs = featureProbabilities[this.theme] || featureProbabilities.standard;
    
    // Use probabilities to select type
    const rand = this.random.nextFloat(0, 1);
    let cumulativeProbability = 0;
    
    for (const [typeStr, probability] of Object.entries(themeProbs)) {
      cumulativeProbability += probability;
      if (rand <= cumulativeProbability) {
        return parseInt(typeStr);
      }
    }
    
    // Default to monster if something goes wrong
    return CellType.MONSTER;
  }

  /**
   * Get a description for a feature
   * @param featureType Type of the feature
   * @returns Description text
   */
  private getFeatureDescription(featureType: CellType): string {
    // Feature descriptions by type and theme
    const descriptions: Partial<Record<CellType, string[]>> = {
      [CellType.PILLAR]: [
        "A sturdy stone pillar supporting the ceiling.",
        "A tall column decorated with intricate carvings.",
        "A cracked pillar that looks like it might collapse.",
        "A pillar with strange symbols etched into its surface."
      ],
      [CellType.STATUE]: [
        "A stone statue of a warrior with a stern expression.",
        "A weathered statue of an unknown deity.",
        "A small statuette on a pedestal.",
        "A life-sized statue of a robed figure."
      ],
      [CellType.FOUNTAIN]: [
        "A small fountain with clear water bubbling up.",
        "A dry fountain basin with intricate stonework.",
        "A fountain with strange colored water.",
        "An ornate fountain with a creature sculpture at its center."
      ],
      [CellType.ALTAR]: [
        "A stone altar with dark stains on its surface.",
        "A small shrine with candles and offerings.",
        "An altar carved with religious symbols.",
        "A raised dais with an altar at its center."
      ],
      [CellType.TRAP]: [
        "A suspicious section of floor.",
        "A wire stretched across the path.",
        "A pressure plate barely visible in the floor.",
        "A ceiling with small holes that might release darts."
      ],
      [CellType.TREASURE]: [
        "A small chest partially buried in the floor.",
        "A pile of coins glinting in the darkness.",
        "A gemstone embedded in the wall.",
        "A collection of valuable-looking objects."
      ],
      [CellType.MONSTER]: [
        "Something lurks in the shadows here.",
        "Strange scratches on the floor suggest a creature's lair.",
        "The remnants of a recent meal indicate a predator.",
        "An area where a creature appears to have made its home."
      ],
      [CellType.WATER]: [
        "A small pool of clear water.",
        "A puddle of stagnant water.",
        "A narrow stream flowing across the floor.",
        "A deep pool of dark water."
      ]
    };
    
    // Get descriptions for this feature type
    const options = descriptions[featureType] || ["An unknown feature."];
    
    // Return a random description
    return this.random.nextElement(options);
  }

  /**
   * Place entrance and exit in the dungeon
   * @param rooms Rooms in the dungeon
   * @param grid Dungeon grid
   * @returns Object with entrance and exit locations
   */
  placeEntranceAndExit(rooms: Room[], grid: Grid<CellType>): { 
    entrance?: Point & { roomId: number },
    exit?: Point & { roomId: number }
  } {
    // Need at least two rooms
    if (rooms.length < 2) {
      return {};
    }
    
    // Find two rooms that are far apart
    let maxDistance = 0;
    let entranceRoom = rooms[0];
    let exitRoom = rooms[1];
    
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const roomA = rooms[i];
        const roomB = rooms[j];
        
        const distance = Math.sqrt(
          Math.pow(roomA.center.x - roomB.center.x, 2) +
          Math.pow(roomA.center.y - roomB.center.y, 2)
        );
        
        if (distance > maxDistance) {
          maxDistance = distance;
          entranceRoom = roomA;
          exitRoom = roomB;
        }
      }
    }
    
    // Get floor cells for both rooms
    const entranceFloorCells = this.getAvailableFloorCells(entranceRoom, grid);
    const exitFloorCells = this.getAvailableFloorCells(exitRoom, grid);
    
    if (entranceFloorCells.length === 0 || exitFloorCells.length === 0) {
      return {};
    }
    
    // Select random cells for entrance and exit
    const entranceCell = this.random.nextElement(entranceFloorCells);
    const exitCell = this.random.nextElement(exitFloorCells);
    
    // Update the grid
    grid.set(entranceCell.x, entranceCell.y, CellType.ENTRANCE);
    grid.set(exitCell.x, exitCell.y, CellType.EXIT);
    
    return {
      entrance: { ...entranceCell, roomId: entranceRoom.id },
      exit: { ...exitCell, roomId: exitRoom.id }
    };
  }
}