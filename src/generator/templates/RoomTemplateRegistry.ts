// src/generator/templates/RoomTemplateRegistry.ts

import { RoomTemplate } from './RoomTemplate';
import { RoomType } from '../../core/Types';
import { Random } from '../../core/Random';

export class RoomTemplateRegistry {
  private templates: Map<RoomType, RoomTemplate> = new Map();
  private weights: Map<RoomType, number> = new Map();
  private random: Random;
  
  constructor(seed?: string | number) {
    this.random = new Random(seed);
  }
  
  // Register a new room template with a weight
  registerTemplate(template: RoomTemplate, weight: number = 1.0): void {
    this.templates.set(template.type, template);
    this.weights.set(template.type, weight);
  }
  
  // Remove a template
  unregisterTemplate(type: RoomType): boolean {
    if (this.templates.has(type)) {
      this.templates.delete(type);
      this.weights.delete(type);
      return true;
    }
    return false;
  }
  
  // Get a template by type
  getTemplate(type: RoomType): RoomTemplate | undefined {
    return this.templates.get(type);
  }
  
  // Get all registered templates
  getAllTemplates(): RoomTemplate[] {
    return Array.from(this.templates.values());
  }
  
  // Select a random template based on weights
  selectRandomTemplate(): RoomTemplate {
    const totalWeight = Array.from(this.weights.values())
      .reduce((sum, weight) => sum + weight, 0);
    
    let roll = this.random.nextFloat(0, totalWeight);
    
    for (const [type, weight] of this.weights.entries()) {
      roll -= weight;
      if (roll <= 0) {
        return this.templates.get(type)!;
      }
    }
    
    // Fallback to first template
    const firstTemplate = this.templates.values().next().value;
    if (!firstTemplate) {
    throw new Error("No room templates registered");
    }
    return firstTemplate;
}
  
  // Set a new weight for a template
  setWeight(type: RoomType, weight: number): void {
    if (this.templates.has(type)) {
      this.weights.set(type, weight);
    }
  }
  
  // Get current weight for a template
  getWeight(type: RoomType): number {
    return this.weights.get(type) || 0;
  }
}