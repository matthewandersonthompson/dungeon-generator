// src/generator/RoomGenerator.ts

import { Room, RoomType, Point } from '../core/Types';
import { Random } from '../core/Random';
import { Grid } from '../core/Grid';
import { RoomTemplateRegistry } from './templates/RoomTemplateRegistry';
import { RectangularRoomTemplate } from './templates/RectangularRoomTemplate';
import { CircularRoomTemplate } from './templates/CircularRoomTemplate';
import { RoomTemplate, RoomTemplateParams } from './templates/RoomTemplate';

export class RoomGenerator {
  private random: Random;
  private templateRegistry: RoomTemplateRegistry;
  private templateParams: Map<RoomType, RoomTemplateParams> = new Map();
  
  constructor(
    seed?: string | number,
    roomSizeVariation = 0.5,
    specialRoomChance = 0.2
  ) {
    this.random = new Random(seed);
    this.templateRegistry = new RoomTemplateRegistry(seed);
    
    // Register default templates
    this.registerDefaultTemplates(roomSizeVariation);
    
    // Set weights based on special room chance
    this.configureTemplateWeights(specialRoomChance);
  }
  
  private registerDefaultTemplates(roomSizeVariation: number): void {
    // Register rectangular room template
    const rectTemplate = new RectangularRoomTemplate();
    this.templateRegistry.registerTemplate(rectTemplate);
    
    // Adjust rectangular room params based on size variation
    const rectParams: RoomTemplateParams = {
      minWidth: 3 + Math.floor(roomSizeVariation * 2),
      maxWidth: 8 + Math.floor(roomSizeVariation * 7),
      minHeight: 3 + Math.floor(roomSizeVariation * 2),
      maxHeight: 8 + Math.floor(roomSizeVariation * 7)
    };
    this.templateParams.set(RoomType.RECTANGULAR, rectParams);
    
    // Register circular room template
    const circTemplate = new CircularRoomTemplate();
    this.templateRegistry.registerTemplate(circTemplate);
    
    // Adjust circular room params based on size variation
    const circParams: RoomTemplateParams = {
      minRadius: 3 + Math.floor(roomSizeVariation),
      maxRadius: 6 + Math.floor(roomSizeVariation * 3)
    };
    this.templateParams.set(RoomType.CIRCULAR, circParams);
  }
  
  private configureTemplateWeights(specialRoomChance: number): void {
    this.templateRegistry.setWeight(RoomType.RECTANGULAR, 1.0 - specialRoomChance);
    
    // Distribute special room chance among special room types
    const specialTemplates = this.templateRegistry.getAllTemplates()
      .filter(template => template.type !== RoomType.RECTANGULAR);
    
    if (specialTemplates.length > 0) {
      const specialWeight = specialRoomChance / specialTemplates.length;
      specialTemplates.forEach(template => {
        this.templateRegistry.setWeight(template.type, specialWeight);
      });
    }
  }
  
  generateRooms(width: number, height: number, numRooms: number, density: number): Room[] {
    const rooms: Room[] = [];
    const maxAttempts = numRooms * 10;
    let attempts = 0;
    
    const grid = new Grid<boolean>(width, height, false);
    const effectiveBuffer = Math.max(1, Math.ceil(1 * (1.5 - density)));
    
    while (rooms.length < numRooms && attempts < maxAttempts) {
      attempts++;
      
      // Select a room template
      const template = this.templateRegistry.selectRandomTemplate();
      
      // Get template-specific parameters
      const templateParams = this.templateParams.get(template.type) || template.getDefaultParams();
      
      // Calculate placement
      const { x, y } = this.calculateRoomPlacement(
        width, height, template, templateParams, density
      );
      
      // Generate room
      const room = template.generateRoom(
        rooms.length, x, y, width, height, this.random, templateParams
      );
      
      if (this.canPlaceRoom(room, grid, rooms, effectiveBuffer)) {
        this.markRoomCells(room, grid);
        rooms.push(room);
      }
    }
    
    return rooms;
  }
  
  private calculateRoomPlacement(
    width: number, 
    height: number, 
    template: RoomTemplate,
    params: RoomTemplateParams,
    density: number
  ): { x: number, y: number } {
    // Calculate room size bounds
    const maxRoomWidth = params.maxWidth || (params.maxRadius ? params.maxRadius * 2 + 1 : 0) || width;
    const maxRoomHeight = params.maxHeight || (params.maxRadius ? params.maxRadius * 2 + 1 : 0) || height;
    
    // Calculate placement area
    const clusterWidth = Math.floor(width * (1 - (density * 0.5)));
    const clusterHeight = Math.floor(height * (1 - (density * 0.5)));
    const offsetX = Math.floor((width - clusterWidth) / 2);
    const offsetY = Math.floor((height - clusterHeight) / 2);
    
    // Determine placement
    const x = this.random.nextInt(offsetX, offsetX + clusterWidth - maxRoomWidth);
    const y = this.random.nextInt(offsetY, offsetY + clusterHeight - maxRoomHeight);
    
    return { x, y };
  }
  
  private canPlaceRoom(room: Room, grid: Grid<boolean>, existingRooms: Room[], buffer: number): boolean {
    // Implementation same as before
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
  
  private markRoomCells(room: Room, grid: Grid<boolean>): void {
    // Implementation same as before
    if (room.cells) {
      room.cells.forEach(cell => {
        if (grid.isInBounds(cell.x, cell.y)) {
          grid.set(cell.x, cell.y, true);
        }
      });
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
  
  // Method to register a new room template
  registerTemplate(template: RoomTemplate, weight: number = 1.0, params?: RoomTemplateParams): void {
    this.templateRegistry.registerTemplate(template, weight);
    
    if (params) {
      this.templateParams.set(template.type, params);
    }
  }
  
  // Method to calculate connection point for a corridor
  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    // Get the appropriate template for this room type
    const template = this.templateRegistry.getTemplate(room.type);
    
    if (template) {
      // Use the template's connection logic
      return template.calculateConnectionPoint(room, targetPoint);
    }
    
    // Fallback to room center if no template is found
    return room.center;
  }
  
  // Update method to generate descriptions
  generateRoomDescriptions(rooms: Room[], theme: string): void {
    // Implementation as before, or enhanced to use template-specific descriptions
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

  /**
   * Get all registered room templates
   * @returns Array of room templates
   */
  getTemplates(): RoomTemplate[] {
    return this.templateRegistry.getAllTemplates();
  }

  /**
   * Get the weight for a specific room template
   * @param type Room type to get weight for
   * @returns Weight value
   */
  getTemplateWeight(type: string): number {
    return this.templateRegistry.getWeight(type as any);
  }

  /**
   * Set the weight for a specific room template
   * @param type Room type to set weight for
   * @param weight New weight value
   */
  setTemplateWeight(type: string, weight: number): void {
    this.templateRegistry.setWeight(type as any, weight);
  }
}