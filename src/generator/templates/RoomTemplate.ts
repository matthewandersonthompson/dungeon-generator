// src/generator/templates/RoomTemplate.ts

import { Point, Room, RoomType } from '../../core/Types';
import { Random } from '../../core/Random';

export interface RoomTemplateParams {
  minSize?: number;
  maxSize?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  minRadius?: number;
  maxRadius?: number;
  [key: string]: any; // Allow for custom parameters
}

export interface RoomTemplate {
  // Unique identifier for this template
  readonly type: RoomType;
  
  // Display name for debugging/UI
  readonly name: string;
  
  // Generate a room from this template
  generateRoom(
    id: number,
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    random: Random,
    params?: RoomTemplateParams
  ): Room;
  
  // Find valid connection points for corridors
  findConnectionPoints(room: Room): Point[];
  
  // Calculate a connection point for a specific target point
  calculateConnectionPoint(room: Room, targetPoint: Point): Point;
  
  // Get default parameters for this template
  getDefaultParams(): RoomTemplateParams;
}