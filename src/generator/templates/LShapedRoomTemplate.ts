// src/generator/templates/LShapedRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';

export class LShapedRoomTemplate implements RoomTemplate {
  readonly type = RoomType.L_SHAPED;
  readonly name = "L-Shaped Room";
  
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
    
    const mainWidth = random.nextInt(roomParams.minWidth!, roomParams.maxWidth!);
    const mainHeight = random.nextInt(roomParams.minHeight!, roomParams.maxHeight!);
    
    const cutX = random.nextInt(Math.floor(mainWidth * 0.3), Math.floor(mainWidth * 0.7));
    const cutY = random.nextInt(Math.floor(mainHeight * 0.3), Math.floor(mainHeight * 0.7));
    
    const cells: Point[] = [];
    for (let dx = 0; dx < mainWidth; dx++) {
      for (let dy = 0; dy < mainHeight; dy++) {
        if (dx >= cutX && dy >= cutY) {
          continue; // This creates the L-shape by cutting out a rectangle
        }
        cells.push({ x: x + dx, y: y + dy });
      }
    }
    
    // Calculate center of mass for the L-shape
    const totalArea = cells.length;
    const centerX = Math.floor(cells.reduce((sum, cell) => sum + cell.x, 0) / totalArea);
    const centerY = Math.floor(cells.reduce((sum, cell) => sum + cell.y, 0) / totalArea);
    
    return {
      id,
      type: RoomType.L_SHAPED,
      x,
      y,
      width: mainWidth,
      height: mainHeight,
      center: { x: centerX, y: centerY },
      cells,
      features: []
    };
  }
  
  findConnectionPoints(room: Room): Point[] {
    // Similar to the rectangular room but filtering to ensure we only use cells on the L-shape
    if (!room.cells) return [];
    
    return room.cells.filter(cell => {
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
    if (!room.cells) return room.center;
    
    // Find the closest perimeter cell to the target point
    const perimeterCells = this.findConnectionPoints(room);
    
    let closestCell = perimeterCells[0];
    let minDistance = Infinity;
    
    for (const cell of perimeterCells) {
      const distance = Math.hypot(
        cell.x - targetPoint.x,
        cell.y - targetPoint.y
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCell = cell;
      }
    }
    
    return closestCell || room.center;
  }
  
  getDefaultParams(): RoomTemplateParams {
    return {
      minWidth: 5,
      maxWidth: 10,
      minHeight: 5,
      maxHeight: 10
    };
  }
}