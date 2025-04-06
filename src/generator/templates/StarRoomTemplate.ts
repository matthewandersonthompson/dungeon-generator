// src/generator/templates/StarRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';

// Helper: Convert degrees to radians.
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Define instruction types for better type safety
interface TurnInstruction {
  type: "turn";
  angle: number;
}

interface MoveInstruction {
  type: "move";
  distance: number;
}

type Instruction = TurnInstruction | MoveInstruction;

export class StarRoomTemplate implements RoomTemplate {
  readonly type = 'star-shaped' as RoomType;
  readonly name = "Star-Shaped Room";

  generateRoom(
    id: number,
    dungeonX: number,
    dungeonY: number,
    maxWidth: number,
    maxHeight: number,
    random: Random,
    params?: RoomTemplateParams
  ): Room {
    // Default parameters including our new (lowered) global scale range.
    const p = {
      minScale: 3,
      maxScale: 6,
      forceEvenScale: true, // optional
      // Lower these to make the overall star smaller on average.
      globalScaleMin: 0.3,
      globalScaleMax: 0.6,
      ...this.getDefaultParams(),
      ...params
    };

    // 1. Choose the step size (scale) for a "unit" of movement.
    let scale = random.nextInt(p.minScale!, p.maxScale!);
    if (p.forceEvenScale && scale % 2 !== 0) {
      scale += 1;
    }

    // 2. Define our instruction sequence for one cycle.
    //    We use degrees; turning right subtracts, turning left adds.
    const cycleInstructions: Instruction[] = [
      { type: "turn", angle: -90 },
      { type: "move", distance: scale },
      { type: "turn", angle: 45 },
      { type: "move", distance: scale },
      { type: "turn", angle: -90 },
      { type: "move", distance: scale },
      { type: "turn", angle: 45 },
      { type: "move", distance: scale }
    ];

    // 3. Repeat the cycle 4 times.
    const instructions: Instruction[] = [];
    for (let i = 0; i < 4; i++) {
      instructions.push(...cycleInstructions);
    }

    // 4. Simulate the instructions to get the star polygon vertices.
    // We'll work in local coordinates (starting at (0,0) with initial direction 0° (east)).
    let pos: Point = { x: 0, y: 0 };
    let dir = 0; // degrees; 0 means east.
    const vertices: Point[] = [{ ...pos }];
    for (const inst of instructions) {
      if (inst.type === "turn") {
        dir += inst.angle;
      } else if (inst.type === "move") {
        const rad = degToRad(dir);
        pos = {
          x: pos.x + inst.distance * Math.cos(rad),
          y: pos.y + inst.distance * Math.sin(rad)
        };
        // Round a bit to avoid floating-point drift.
        pos.x = Math.round(pos.x * 1000) / 1000;
        pos.y = Math.round(pos.y * 1000) / 1000;
        vertices.push({ ...pos });
      }
    }
    // Ideally, pos should be close to (0,0) if the shape closes perfectly.

    // 5. Apply a random global scale factor for variety.
    //    This multiplies every vertex coordinate.
    const globalFactor = random.nextFloat(p.globalScaleMin!, p.globalScaleMax!);
    const scaledVertices = vertices.map(v => ({
      x: v.x * globalFactor,
      y: v.y * globalFactor
    }));

    // 6. Compute the polygon's bounding box in local coordinates.
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const v of scaledVertices) {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
      if (v.y < minY) minY = v.y;
      if (v.y > maxY) maxY = v.y;
    }
    const polyWidth = Math.ceil(maxX - minX);
    const polyHeight = Math.ceil(maxY - minY);

    // 7. Shift the polygon so that its top-left is at (0,0) in local space.
    const shiftedVertices = scaledVertices.map(v => ({ x: v.x - minX, y: v.y - minY }));

    // 8. Now choose a random placement for the star in the dungeon so that the bounding box fits.
    if (polyWidth > maxWidth || polyHeight > maxHeight) {
      return this.fallbackRoom(id, dungeonX, dungeonY, maxWidth, maxHeight);
    }
    const availX = dungeonX + maxWidth - polyWidth;
    const availY = dungeonY + maxHeight - polyHeight;
    const offsetX = random.nextInt(dungeonX, availX);
    const offsetY = random.nextInt(dungeonY, availY);

    // 9. Compute the final vertices in dungeon coordinates.
    const finalVertices = shiftedVertices.map(v => ({ x: v.x + offsetX, y: v.y + offsetY }));

    // 10. Fill the interior of the polygon using a ray-casting approach.
    const cells: Point[] = [];
    const cellMap = new Map<string, Point>();
    for (let x = 0; x < polyWidth; x++) {
      for (let y = 0; y < polyHeight; y++) {
        const testPt = { x, y };
        if (this.isPointInPolygon(testPt, shiftedVertices)) {
          const absPt = { x: x + offsetX, y: y + offsetY };
          const key = `${absPt.x},${absPt.y}`;
          if (!cellMap.has(key)) {
            cells.push(absPt);
            cellMap.set(key, absPt);
          }
        }
      }
    }

    // 11. Define the room's center as the centroid of the bounding box.
    const centerX_final = offsetX + polyWidth / 2;
    const centerY_final = offsetY + polyHeight / 2;

    return {
      id,
      type: this.type,
      x: offsetX,
      y: offsetY,
      width: polyWidth,
      height: polyHeight,
      center: { x: centerX_final, y: centerY_final },
      cells,
      borderPoints: finalVertices,
      features: []
    };
  }

  /**
   * Ray-casting point-in-polygon test.
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
   * Fallback: return a small square room if the star cannot be placed.
   */
  private fallbackRoom(
    id: number,
    dungeonX: number,
    dungeonY: number,
    maxWidth: number,
    maxHeight: number
  ): Room {
    const size = Math.min(5, maxWidth, maxHeight);
    const sx = dungeonX + Math.floor((maxWidth - size) / 2);
    const sy = dungeonY + Math.floor((maxHeight - size) / 2);
    const cells: Point[] = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        cells.push({ x: sx + x, y: sy + y });
      }
    }
    return {
      id,
      type: this.type,
      x: sx,
      y: sy,
      width: size,
      height: size,
      center: { x: sx + Math.floor(size / 2), y: sy + Math.floor(size / 2) },
      cells,
      borderPoints: [],
      features: []
    };
  }

  /**
   * For corridor/door connections, return the perimeter cells.
   */
  findConnectionPoints(room: Room): Point[] {
    if (!room.cells) return [];
    const cellMap = new Set(room.cells.map(c => `${c.x},${c.y}`));
    return room.cells.filter(cell => {
      const neighbors = [
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x, y: cell.y - 1 }
      ];
      return neighbors.some(n => !cellMap.has(`${n.x},${n.y}`));
    });
  }

  /**
   * Choose the connection point nearest to a target point.
   */
  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    if (!room.cells || !room.borderPoints) return room.center;
    const connectionPoints = this.findConnectionPoints(room);
    if (connectionPoints.length === 0) return room.center;
    
    let closest = connectionPoints[0];
    let minDist = Infinity;
    for (const p of connectionPoints) {
      const d = Math.hypot(p.x - targetPoint.x, p.y - targetPoint.y);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    }
    return closest;
  }

  getDefaultParams(): RoomTemplateParams {
    return {
      // The scale (unit step) will be chosen between these values.
      minScale: 3,
      maxScale: 6,
      forceEvenScale: true,
      // Adjusted global scale parameters for a smaller overall star.
      globalScaleMin: 0.3,
      globalScaleMax: 0.6
    };
  }
}
