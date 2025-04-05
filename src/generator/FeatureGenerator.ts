import { Room, Feature, CellType, Point } from '../core/Types';
import { Random } from '../core/Random';
import { Grid } from '../core/Grid';

export class FeatureGenerator {
  private random: Random;
  private featureDensity: number;
  private theme: string;

  constructor(
    seed?: string | number,
    featureDensity = 0.5,
    theme = 'standard'
  ) {
    this.random = new Random(seed);
    this.featureDensity = Math.min(Math.max(0, featureDensity), 1);
    this.theme = theme;
  }

  generateFeatures(rooms: Room[], grid: Grid<CellType>): Feature[] {
    const allFeatures: Feature[] = [];
    
    rooms.forEach(room => {
      const features = this.generateRoomFeatures(room, grid);
      room.features = features;
      allFeatures.push(...features);
      
      features.forEach(feature => {
        grid.set(feature.x, feature.y, feature.type);
      });
    });
    
    return allFeatures;
  }

  private generateRoomFeatures(room: Room, grid: Grid<CellType>): Feature[] {
    const floorCells = this.getAvailableFloorCells(room, grid);
    if (floorCells.length === 0) return [];
    
    const roomSize = floorCells.length;
    const maxFeatures = Math.max(1, Math.ceil(roomSize * this.featureDensity / 10));
    const featureCount = this.random.nextInt(0, maxFeatures);
    
    const features: Feature[] = [];
    
    for (let i = 0; i < featureCount; i++) {
      if (floorCells.length === 0) break;
      
      const cellIndex = this.random.nextInt(0, floorCells.length - 1);
      const cell = floorCells[cellIndex];
      floorCells.splice(cellIndex, 1);
      
      const feature = this.createFeature(room.id, cell, room);
      if (feature) {
        features.push(feature);
        this.markSurroundingCellsAsUsed(cell, floorCells);
      }
    }
    
    return features;
  }

  private createFeature(roomId: number, location: Point, room: Room): Feature | null {
    const featureType = this.selectFeatureType(room);
    const description = this.getFeatureDescription(featureType);
    
    return {
      x: location.x,
      y: location.y,
      type: featureType,
      description,
      roomId
    };
  }

  private getAvailableFloorCells(room: Room, grid: Grid<CellType>): Point[] {
    if (room.cells) {
      return room.cells.filter(cell => 
        grid.get(cell.x, cell.y) === CellType.FLOOR
      );
    }
    
    if (!room.width || !room.height) return [];
    
    const floorCells: Point[] = [];
    
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        if (grid.get(x, y) === CellType.FLOOR) {
          floorCells.push({ x, y });
        }
      }
    }
    
    return floorCells;
  }

  private markSurroundingCellsAsUsed(center: Point, availableCells: Point[]): void {
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

  private selectFeatureType(room: Room): CellType {
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
    
    const themeProbs = featureProbabilities[this.theme] || featureProbabilities.standard;
    const rand = this.random.nextFloat(0, 1);
    
    let cumulativeProbability = 0;
    for (const [typeStr, probability] of Object.entries(themeProbs)) {
      cumulativeProbability += probability;
      if (rand <= cumulativeProbability) {
        return parseInt(typeStr);
      }
    }
    
    return CellType.MONSTER;
  }

  private getFeatureDescription(featureType: CellType): string {
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
    
    const options = descriptions[featureType] || ["An unknown feature."];
    return this.random.nextElement(options);
  }

  placeEntranceAndExit(rooms: Room[], grid: Grid<CellType>): { 
    entrance?: Point & { roomId: number },
    exit?: Point & { roomId: number }
  } {
    if (rooms.length < 2) return {};
    
    let maxDistance = 0;
    let entranceRoom = rooms[0];
    let exitRoom = rooms[1];
    
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const roomA = rooms[i];
        const roomB = rooms[j];
        
        const distance = Math.hypot(
          roomA.center.x - roomB.center.x,
          roomA.center.y - roomB.center.y
        );
        
        if (distance > maxDistance) {
          maxDistance = distance;
          entranceRoom = roomA;
          exitRoom = roomB;
        }
      }
    }
    
    const entranceFloorCells = this.getAvailableFloorCells(entranceRoom, grid);
    const exitFloorCells = this.getAvailableFloorCells(exitRoom, grid);
    
    if (entranceFloorCells.length === 0 || exitFloorCells.length === 0) {
      return {};
    }
    
    const entranceCell = this.random.nextElement(entranceFloorCells);
    const exitCell = this.random.nextElement(exitFloorCells);
    
    grid.set(entranceCell.x, entranceCell.y, CellType.ENTRANCE);
    grid.set(exitCell.x, exitCell.y, CellType.EXIT);
    
    return {
      entrance: { ...entranceCell, roomId: entranceRoom.id },
      exit: { ...exitCell, roomId: exitRoom.id }
    };
  }
}