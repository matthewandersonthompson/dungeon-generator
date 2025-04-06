// src/generator/templates/OctagonRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';

export class OctagonRoomTemplate implements RoomTemplate {
  readonly type = 'octagon-shaped' as RoomType;
  readonly name = "Octagon-Shaped Room";

  generateRoom(
    id: number,
    dungeonX: number,
    dungeonY: number,
    maxWidth: number,
    maxHeight: number,
    random: Random,
    params?: RoomTemplateParams
  ): Room {
    const defaults = this.getDefaultParams();
    const p = { ...defaults, ...params };

    // 1) Pick a random side length for our “double square” star
    const side = random.nextInt(p.minSide!, p.maxSide!);

    // 2) The shape’s bounding circle radius is r = side / sqrt(2).
    //    The bounding box is thus ~ 2*r = side * sqrt(2).
    const radius = side / Math.SQRT2;
    const boundingSize = Math.ceil(side * Math.SQRT2);

    // 3) If it doesn’t fit, fallback or clamp. For simplicity, just fallback:
    if (boundingSize > maxWidth || boundingSize > maxHeight) {
      return this.fallbackRoom(id, dungeonX, dungeonY, maxWidth, maxHeight);
    }

    // 4) Pick a random top-left so the bounding box fits inside the dungeon
    const maxX = dungeonX + maxWidth - boundingSize;
    const maxY = dungeonY + maxHeight - boundingSize;
    if (maxX < dungeonX || maxY < dungeonY) {
      return this.fallbackRoom(id, dungeonX, dungeonY, maxWidth, maxHeight);
    }
    const startX = random.nextInt(dungeonX, maxX);
    const startY = random.nextInt(dungeonY, maxY);

    // 5) The actual center is offset by radius from (startX, startY)
    const centerX = startX + radius;
    const centerY = startY + radius;

    // 6) Build the 8-vertex polygon by stepping 45° each time,
    //    starting from 22.5° (Math.PI/8). 
    //    This yields the union of two squares of side `side` 
    //    (one axis-aligned, one rotated 45°).
    const vertices: Point[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = p.rotationOffset! + (Math.PI / 8) + i * (Math.PI / 4);
      const vx = centerX + radius * Math.cos(angle);
      const vy = centerY + radius * Math.sin(angle);
      vertices.push({ x: vx, y: vy });
    }

    // 7) Fill the interior with a ray-casting approach
    const cells: Point[] = [];
    for (let dx = 0; dx < boundingSize; dx++) {
      for (let dy = 0; dy < boundingSize; dy++) {
        const px = startX + dx;
        const py = startY + dy;
        if (this.isPointInPolygon({ x: px, y: py }, vertices)) {
          cells.push({ x: px, y: py });
        }
      }
    }

    return {
      id,
      type: this.type,
      x: startX,
      y: startY,
      width: boundingSize,
      height: boundingSize,
      center: { x: centerX, y: centerY },
      cells,
      borderPoints: vertices,
      features: []
    };
  }

  /**
   * Fallback: return a small 5×5 square in the dungeon’s center
   * if the star doesn’t fit. You could also return null
   * (if your RoomGenerator / DungeonGenerator can handle that).
   */
  private fallbackRoom(
    id: number,
    dungeonX: number,
    dungeonY: number,
    maxWidth: number,
    maxHeight: number
  ): Room {
    const size = Math.min(5, maxWidth, maxHeight);
    const startX = dungeonX + Math.floor((maxWidth - size) / 2);
    const startY = dungeonY + Math.floor((maxHeight - size) / 2);

    const cells: Point[] = [];
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        cells.push({ x: startX + dx, y: startY + dy });
      }
    }
    return {
      id,
      type: this.type,
      x: startX,
      y: startY,
      width: size,
      height: size,
      center: { x: startX + Math.floor(size / 2), y: startY + Math.floor(size / 2) },
      cells,
      borderPoints: [],
      features: []
    };
  }

  /**
   * Standard ray-casting check to see if a point is inside a polygon.
   */
  private isPointInPolygon(pt: Point, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect =
        (yi > pt.y) !== (yj > pt.y) &&
        (pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Perimeter detection for corridor/door connections.
   */
  findConnectionPoints(room: Room): Point[] {
    if (!room.cells) return [];
    const cellMap = new Set(room.cells.map(c => `${c.x},${c.y}`));
    return room.cells.filter(cell => {
      const neighbors = [
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x,     y: cell.y + 1 },
        { x: cell.x,     y: cell.y - 1 }
      ];
      return neighbors.some(n => !cellMap.has(`${n.x},${n.y}`));
    });
  }

  /**
   * Choose the perimeter cell nearest to target.
   */
  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    if (!room.cells || !room.borderPoints) return room.center;

    // 1) Closest border vertex
    let closestVertex = room.borderPoints[0];
    let minDist = Infinity;
    for (const v of room.borderPoints) {
      const dist = Math.hypot(v.x - targetPoint.x, v.y - targetPoint.y);
      if (dist < minDist) {
        minDist = dist;
        closestVertex = v;
      }
    }
    // 2) Among the room’s cells, pick the one nearest to that vertex
    let nearestCell = room.cells[0];
    minDist = Infinity;
    for (const c of room.cells) {
      const dist = Math.hypot(c.x - closestVertex.x, c.y - closestVertex.y);
      if (dist < minDist) {
        minDist = dist;
        nearestCell = c;
      }
    }
    return nearestCell;
  }

  /**
   * Default parameters: side length range and optional rotation offset.
   */
  getDefaultParams(): RoomTemplateParams {
    return {
      // The random side length for the “double square” star
      minSide: 6,
      maxSide: 12,

      // If you want to rotate the entire shape, set rotationOffset = Math.PI/4
      // so the big square is diagonal and the small square is axis-aligned, etc.
      rotationOffset: 0
    };
  }
}
