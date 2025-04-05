import { Vector2D } from './Vector2D';

export class Geometry {
  static isPointInRect(x: number, y: number, rx: number, ry: number, rw: number, rh: number): boolean {
    return x >= rx && x < rx + rw && y >= ry && y < ry + rh;
  }

  static distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceSquared(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1, dy = y2 - y1;
    return dx * dx + dy * dy;
  }

  static isPointInCircle(x: number, y: number, cx: number, cy: number, r: number): boolean {
    return this.distanceSquared(x, y, cx, cy) <= r * r;
  }

  static doCirclesOverlap(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean {
    const d2 = this.distanceSquared(x1, y1, x2, y2);
    return d2 <= (r1 + r2) * (r1 + r2);
  }

  static doRectsOverlap(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
    return !(x2 >= x1 + w1 || x2 + w2 <= x1 || y2 >= y1 + h1 || y2 + h2 <= y1);
  }

  static getRectsIntersection(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): { x: number, y: number, width: number, height: number } | null {
    const left = Math.max(x1, x2), top = Math.max(y1, y2),
          right = Math.min(x1 + w1, x2 + w2), bottom = Math.min(y1 + h1, y2 + h2);
    return right <= left || bottom <= top ? null : { x: left, y: top, width: right - left, height: bottom - top };
  }

  static getLinePoints(x1: number, y1: number, x2: number, y2: number): { x: number, y: number }[] {
    const points: { x: number, y: number }[] = [];
    const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
    let err = dx - dy, x = x1, y = y1;
    while (true) {
      points.push({ x, y });
      if (x === x2 && y === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) { if (x === x2) break; err -= dy; x += sx; }
      if (e2 < dx) { if (y === y2) break; err += dx; y += sy; }
    }
    return points;
  }

  static getCirclePoints(centerX: number, centerY: number, radius: number): { x: number, y: number }[] {
    const points: { x: number, y: number }[] = [];
    let x = radius, y = 0, err = 0;
    while (x >= y) {
      points.push({ x: centerX + x, y: centerY + y });
      points.push({ x: centerX + y, y: centerY + x });
      points.push({ x: centerX - y, y: centerY + x });
      points.push({ x: centerX - x, y: centerY + y });
      points.push({ x: centerX - x, y: centerY - y });
      points.push({ x: centerX - y, y: centerY - x });
      points.push({ x: centerX + y, y: centerY - x });
      points.push({ x: centerX + x, y: centerY - y });
      y++;
      if (err <= 0) { err += 2 * y + 1; }
      if (err > 0) { x--; err -= 2 * x + 1; }
    }
    return points;
  }

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

  static createPolygon(centerX: number, centerY: number, radius: number, sides: number, angleOffset: number = 0): Vector2D[] {
    const points: Vector2D[] = [];
    const angleStep = (Math.PI * 2) / sides;
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep + angleOffset;
      points.push(new Vector2D(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle)));
    }
    return points;
  }

  static isPointInPolygon(point: Vector2D, polygon: Vector2D[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const cond = (polygon[i].y > point.y) !== (polygon[j].y > point.y) &&
                   (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x);
      if (cond) inside = !inside;
    }
    return inside;
  }
}
