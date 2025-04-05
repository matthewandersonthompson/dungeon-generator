export class Vector2D {
  constructor(public x: number, public y: number) {}

  clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  add(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector2D): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distance(v: Vector2D): number {
    const dx = this.x - v.x, dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  distanceSquared(v: Vector2D): number {
    const dx = this.x - v.x, dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  normalize(): Vector2D {
    const len = this.length();
    return len === 0 ? new Vector2D(0, 0) : new Vector2D(this.x / len, this.y / len);
  }

  dot(v: Vector2D): number {
    return this.x * v.x + this.y * v.y;
  }

  angleTo(v: Vector2D): number {
    const lenA = this.length(), lenB = v.length();
    if (lenA === 0 || lenB === 0) return 0;
    return Math.acos(Math.min(1, Math.max(-1, this.dot(v) / (lenA * lenB))));
  }

  static fromAngle(angle: number, length: number = 1): Vector2D {
    return new Vector2D(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  rotate(angle: number): Vector2D {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return new Vector2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
