// src/generator/templates/NorthStarRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';

export class NorthStarRoomTemplate implements RoomTemplate {
  readonly type = 'north-star-shaped' as RoomType;
  readonly name = "North-Star-Shaped Room";

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

    // Pick a random outer radius (like half the side of the larger square).
    const outerR = random.nextInt(p.minOuterRadius!, p.maxOuterRadius!);
    // Inner radius for the smaller, rotated square.
    // You can randomize it or define a ratio. Here we do a direct ratio of outerR.
    const innerR = Math.floor(outerR * p.innerRatio!);

    // Optional clamp so innerR is at least 1
    if (innerR < 1) {
      return this.fallbackRoom(id, dungeonX, dungeonY, maxWidth, maxHeight);
    }

    // Center coordinates. For simplicity, place star so its bounding box fits.
    // We’ll just do a naive approach: star bounding box = 2*outerR in each dimension.
    // If you want a margin or guaranteed in-bounds, clamp or offset here:
    if (2 * outerR > maxWidth || 2 * outerR > maxHeight) {
      // Fallback if star is too big
      return this.fallbackRoom(id, dungeonX, dungeonY, maxWidth, maxHeight);
    }

    // We’ll pick a random top-left offset so the star is inside the dungeon
    const startX = random.nextInt(dungeonX, dungeonX + maxWidth - 2 * outerR);
    const startY = random.nextInt(dungeonY, dungeonY + maxHeight - 2 * outerR);

    // The actual center of the star
    const centerX = startX + outerR;
    const centerY = startY + outerR;

    // Build an 8-vertex polygon that alternates between outerRadius and innerRadius.
    // i goes from 0..7; angle step is 45° (π/4). We can add a rotation offset if desired.
    const starPolygon: Point[] = [];
    for (let i = 0; i < 8; i++) {
      // Angle in radians
      const angle = i * (Math.PI / 4) + p.rotationOffset!;
      // Even indices => use outer radius; odd => inner radius
      const r = (i % 2 === 0) ? outerR : innerR;
      const px = centerX + r * Math.cos(angle);
      const py = centerY + r * Math.sin(angle);
      starPolygon.push({ x: px, y: py });
    }

    // Now fill the interior using a simple bounding box + ray-casting approach
    const cells: Point[] = [];
    const boundingSize = 2 * outerR;
    for (let dx = 0; dx < boundingSize; dx++) {
      for (let dy = 0; dy < boundingSize; dy++) {
        const testX = startX + dx;
        const testY = startY + dy;
        if (this.isPointInPolygon({ x: testX, y: testY }, starPolygon)) {
          cells.push({ x: testX, y: testY });
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
      borderPoints: starPolygon,
      features: []
    };
  }

  /**
   * Simple fallback: return a small 3x3 or 5x5 square in the center if the star won't fit.
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
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        cells.push({ x: startX + x, y: startY + y });
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
      borderPoints: [], // or compute a square perimeter if you prefer
      features: []
    };
  }

  /**
   * Ray-casting test to see if a point is inside an 8-vertex polygon.
   */
  private isPointInPolygon(pt: Point, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect =
        ((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * findConnectionPoints: perimeter cells for corridor or door placements.
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
   * calculateConnectionPoint: pick the perimeter cell nearest to a target point.
   */
  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    if (!room.cells || !room.borderPoints) return room.center;

    // 1) Find the closest border vertex to target
    let closestVertex = room.borderPoints[0];
    let minDist = Infinity;
    for (const v of room.borderPoints) {
      const dist = Math.hypot(v.x - targetPoint.x, v.y - targetPoint.y);
      if (dist < minDist) {
        minDist = dist;
        closestVertex = v;
      }
    }
    // 2) Among the room’s floor cells, find whichever is closest to that vertex
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
   * Default parameters for the “two overlapping squares” star.
   */
  getDefaultParams(): RoomTemplateParams {
    return {
      // Outer radius (half the side of the bigger square)
      minOuterRadius: 4,
      maxOuterRadius: 8,

      // Ratio of inner to outer (the smaller, rotated square).
      // 0.7 => the smaller square is 70% the size of the bigger one
      innerRatio: 0.7,

      // Optional rotation offset in radians. 0 => axis aligned outer square.
      // e.g. Math.PI/4 => outer square is rotated 45°, so the “inner” square is axis aligned
      rotationOffset: 0
    };
  }
}
