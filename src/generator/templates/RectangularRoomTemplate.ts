// src/generator/templates/RectangularRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';
import { Geometry } from '../../core/Geometry';

export class RectangularRoomTemplate implements RoomTemplate {
  readonly type = RoomType.RECTANGULAR;
  readonly name = "Rectangular Room";
  
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
    
    const width = random.nextInt(roomParams.minWidth!, roomParams.maxWidth!);
    const height = random.nextInt(roomParams.minHeight!, roomParams.maxHeight!);
    
    const cells: Point[] = [];
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        cells.push({ x: x + dx, y: y + dy });
      }
    }
    
    const center = {
      x: x + Math.floor(width / 2),
      y: y + Math.floor(height / 2)
    };
    
    return {
      id,
      type: RoomType.RECTANGULAR,
      x,
      y,
      width,
      height,
      center,
      cells,
      features: []
    };
  }
  
  findConnectionPoints(room: Room): Point[] {
    if (!room.cells) return [];
    
    // Find all cells on the perimeter
    return room.cells.filter(cell => {
      // Check if any adjacent cell is not part of the room
      const adjacentCells = [
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x, y: cell.y - 1 }
      ];
      
      return adjacentCells.some(adjCell => 
        !room.cells!.some(roomCell => 
          roomCell.x === adjCell.x && roomCell.y === adjCell.y
        )
      );
    });
  }
  
  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    if (!room.width || !room.height) return room.center;
    
    const { x, y, width, height, center } = room;
    
    // Find closest wall to the target point
    const distToLeft = Math.abs(targetPoint.x - x);
    const distToRight = Math.abs(targetPoint.x - (x + width));
    const distToTop = Math.abs(targetPoint.y - y);
    const distToBottom = Math.abs(targetPoint.y - (y + height));
    
    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
    
    let connectionPoint: Point;
    
    if (minDist === distToLeft) {
      // Connect to left wall
      connectionPoint = { x, y: Math.min(y + height - 1, Math.max(y, targetPoint.y)) };
    } else if (minDist === distToRight) {
      // Connect to right wall
      connectionPoint = { x: x + width - 1, y: Math.min(y + height - 1, Math.max(y, targetPoint.y)) };
    } else if (minDist === distToTop) {
      // Connect to top wall
      connectionPoint = { x: Math.min(x + width - 1, Math.max(x, targetPoint.x)), y };
    } else {
      // Connect to bottom wall
      connectionPoint = { x: Math.min(x + width - 1, Math.max(x, targetPoint.x)), y: y + height - 1 };
    }
    
    return connectionPoint;
  }
  
  getDefaultParams(): RoomTemplateParams {
    return {
      minWidth: 3,
      maxWidth: 8,
      minHeight: 3,
      maxHeight: 8
    };
  }
}