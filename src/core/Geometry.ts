import { Vector2D } from './Vector2D';

/**
 * Utility class for geometric operations
 */
export class Geometry {
  /**
   * Check if a point is inside a rectangle
   * @param x Point X coordinate
   * @param y Point Y coordinate
   * @param rx Rectangle top-left X
   * @param ry Rectangle top-left Y
   * @param rw Rectangle width
   * @param rh Rectangle height
   */
  static isPointInRect(x: number, y: number, rx: number, ry: number, rw: number, rh: number): boolean {
    return x >= rx && x < rx + rw && y >= ry && y < ry + rh;
  }

  /**
   * Calculate the distance between two points
   * @param x1 First point X coordinate
   * @param y1 First point Y coordinate
   * @param x2 Second point X coordinate
   * @param y2 Second point Y coordinate
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate the squared distance between two points (faster than distance)
   * @param x1 First point X coordinate
   * @param y1 First point Y coordinate
   * @param x2 Second point X coordinate
   * @param y2 Second point Y coordinate
   */
  static distanceSquared(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
  }

  /**
   * Check if a point is inside a circle
   * @param x Point X coordinate
   * @param y Point Y coordinate
   * @param cx Circle center X
   * @param cy Circle center Y
   * @param r Circle radius
   */
  static isPointInCircle(x: number, y: number, cx: number, cy: number, r: number): boolean {
    return this.distanceSquared(x, y, cx, cy) <= r * r;
  }

  /**
   * Check if two circles overlap
   * @param x1 First circle center X
   * @param y1 First circle center Y
   * @param r1 First circle radius
   * @param x2 Second circle center X
   * @param y2 Second circle center Y
   * @param r2 Second circle radius
   */
  static doCirclesOverlap(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean {
    const distanceSquared = this.distanceSquared(x1, y1, x2, y2);
    const radiusSum = r1 + r2;
    return distanceSquared <= radiusSum * radiusSum;
  }

  /**
   * Check if two rectangles overlap
   * @param x1 First rectangle top-left X
   * @param y1 First rectangle top-left Y
   * @param w1 First rectangle width
   * @param h1 First rectangle height
   * @param x2 Second rectangle top-left X
   * @param y2 Second rectangle top-left Y
   * @param w2 Second rectangle width
   * @param h2 Second rectangle height
   */
  static doRectsOverlap(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
    return !(x2 >= x1 + w1 || x2 + w2 <= x1 || y2 >= y1 + h1 || y2 + h2 <= y1);
  }

  /**
   * Get a rectangle that represents the intersection of two rectangles
   * @param x1 First rectangle top-left X
   * @param y1 First rectangle top-left Y
   * @param w1 First rectangle width
   * @param h1 First rectangle height
   * @param x2 Second rectangle top-left X
   * @param y2 Second rectangle top-left Y
   * @param w2 Second rectangle width
   * @param h2 Second rectangle height
   * @returns Object with x, y, width, height or null if no intersection
   */
  static getRectsIntersection(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): { x: number, y: number, width: number, height: number } | null {
    const left = Math.max(x1, x2);
    const top = Math.max(y1, y2);
    const right = Math.min(x1 + w1, x2 + w2);
    const bottom = Math.min(y1 + h1, y2 + h2);
    
    if (right <= left || bottom <= top) {
      return null; // No intersection
    }
    
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    };
  }

  /**
   * Generate points along a line using Bresenham's algorithm
   * @param x1 Starting X coordinate
   * @param y1 Starting Y coordinate
   * @param x2 Ending X coordinate
   * @param y2 Ending Y coordinate
   * @returns Array of points along the line
   */
  static getLinePoints(x1: number, y1: number, x2: number, y2: number): { x: number, y: number }[] {
    const points: { x: number, y: number }[] = [];
    
    // Bresenham's line algorithm
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    
    let err = dx - dy;
    let x = x1;
    let y = y1;
    
    while (true) {
      points.push({ x, y });
      
      if (x === x2 && y === y2) {
        break;
      }
      
      const e2 = 2 * err;
      
      if (e2 > -dy) {
        if (x === x2) break;
        err -= dy;
        x += sx;
      }
      
      if (e2 < dx) {
        if (y === y2) break;
        err += dx;
        y += sy;
      }
    }
    
    return points;
  }

  /**
   * Generate points for a circle using the midpoint circle algorithm
   * @param centerX Circle center X
   * @param centerY Circle center Y
   * @param radius Circle radius
   * @returns Array of points forming the circle
   */
  static getCirclePoints(centerX: number, centerY: number, radius: number): { x: number, y: number }[] {
    const points: { x: number, y: number }[] = [];
    
    // Midpoint circle algorithm
    let x = radius;
    let y = 0;
    let err = 0;
    
    while (x >= y) {
      points.push({ x: centerX + x, y: centerY + y });
      points.push({ x: centerX + y, y: centerY + x });
      points.push({ x: centerX - y, y: centerY + x });
      points.push({ x: centerX - x, y: centerY + y });
      points.push({ x: centerX - x, y: centerY - y });
      points.push({ x: centerX - y, y: centerY - x });
      points.push({ x: centerX + y, y: centerY - x });
      points.push({ x: centerX + x, y: centerY - y });
      
      y += 1;
      if (err <= 0) {
        err += 2 * y + 1;
      }
      if (err > 0) {
        x -= 1;
        err -= 2 * x + 1;
      }
    }
    
    return points;
  }

  /**
   * Generate points for a filled circle
   * @param centerX Circle center X
   * @param centerY Circle center Y
   * @param radius Circle radius
   * @returns Array of points filling the circle
   */
  static getFilledCirclePoints(centerX: number, centerY: number, radius: number): { x: number, y: number }[] {
    const points: { x: number, y: number }[] = [];
    
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y <= radius * radius) {
          points.push({ x: centerX + x, y: centerY + y });
        }
      }
    }
    
    return points;
  }

  /**
   * Create a polygon with the specified number of sides
   * @param centerX Center X coordinate
   * @param centerY Center Y coordinate
   * @param radius Distance from center to vertices
   * @param sides Number of sides
   * @param angleOffset Rotation angle in radians
   * @returns Array of points forming the polygon
   */
  static createPolygon(centerX: number, centerY: number, radius: number, sides: number, angleOffset: number = 0): Vector2D[] {
    const points: Vector2D[] = [];
    const angleStep = (Math.PI * 2) / sides;
    
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep + angleOffset;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push(new Vector2D(x, y));
    }
    
    return points;
  }

  /**
   * Check if a point is inside a polygon
   * @param point Point to check
   * @param polygon Array of vertices forming the polygon
   * @returns True if the point is inside the polygon
   */
  static isPointInPolygon(point: Vector2D, polygon: Vector2D[]): boolean {
    // Ray casting algorithm
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const intersect = (
        (polygon[i].y > point.y) !== (polygon[j].y > point.y)
        && (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)
      );
      
      if (intersect) {
        inside = !inside;
      }
    }
    
    return inside;
  }
}