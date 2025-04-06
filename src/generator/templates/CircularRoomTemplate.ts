// src/generator/templates/CircularRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';
import { Geometry } from '../../core/Geometry';

export class CircularRoomTemplate implements RoomTemplate {
  readonly type = RoomType.CIRCULAR;
  readonly name = "Circular Room";
  
  generateRoom(
    id: number,
    x: number, 
    y: number, 
    maxWidth: number, 
    maxHeight: number, 
    random: Random,
    params?: RoomTemplateParams
  ): Room {
    const defaultParams = this.getDefaultParams();
    const roomParams = { ...defaultParams, ...params };
    
    const radius = random.nextInt(roomParams.minRadius!, roomParams.maxRadius!);
    const centerX = x + radius;
    const centerY = y + radius;
    
    // Generate cells within the circle
    const cells = Geometry.getFilledCirclePoints(centerX, centerY, radius);
    
    // Generate points around the perimeter for rendering
    const borderPoints: Point[] = [];
    const numSamples = Math.max(32, radius * 4);
    for (let i = 0; i < numSamples; i++) {
      const angle = (2 * Math.PI * i) / numSamples;
      const bx = centerX + radius * Math.cos(angle);
      const by = centerY + radius * Math.sin(angle);
      borderPoints.push({ x: bx, y: by });
    }
    
    const diameter = radius * 2 + 1;
    
    return {
      id,
      type: RoomType.CIRCULAR,
      x: centerX - radius,
      y: centerY - radius,
      width: diameter,
      height: diameter,
      radius,
      center: { x: centerX, y: centerY },
      cells,
      borderPoints,
      features: []
    };
  }
  
  findConnectionPoints(room: Room): Point[] {
    if (!room.cells) return [];
    
    // For circular rooms, find cells on or very near the perimeter
    return room.cells.filter(cell => {
      if (!room.center || !room.radius) return false;
      
      const distanceFromCenter = Geometry.distance(
        cell.x, cell.y, 
        room.center.x, room.center.y
      );
      
      // Cell is near the perimeter
      return Math.abs(distanceFromCenter - room.radius) < 1.5;
    });
  }
  
  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    if (!room.center || !room.radius) return room.center || targetPoint;
    
    const { center, radius } = room;
    
    // Calculate direction vector from center to target
    const dirX = targetPoint.x - center.x;
    const dirY = targetPoint.y - center.y;
    
    // Normalize the direction vector
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    const normalizedX = dirX / length;
    const normalizedY = dirY / length;
    
    // Calculate point on the perimeter
    return {
      x: Math.round(center.x + normalizedX * radius),
      y: Math.round(center.y + normalizedY * radius)
    };
  }
  
  getDefaultParams(): RoomTemplateParams {
    return {
      minRadius: 3,
      maxRadius: 6
    };
  }
}