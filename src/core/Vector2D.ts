/**
 * 2D Vector class for spatial operations
 */
export class Vector2D {
    constructor(public x: number, public y: number) {}
  
    /**
     * Create a copy of the vector
     * @returns A new vector with the same coordinates
     */
    clone(): Vector2D {
      return new Vector2D(this.x, this.y);
    }
  
    /**
     * Add another vector to this one
     * @param v Vector to add
     * @returns New vector with the sum
     */
    add(v: Vector2D): Vector2D {
      return new Vector2D(this.x + v.x, this.y + v.y);
    }
  
    /**
     * Subtract another vector from this one
     * @param v Vector to subtract
     * @returns New vector with the difference
     */
    subtract(v: Vector2D): Vector2D {
      return new Vector2D(this.x - v.x, this.y - v.y);
    }
  
    /**
     * Multiply this vector by a scalar
     * @param scalar Scalar value
     * @returns New vector scaled by the value
     */
    multiply(scalar: number): Vector2D {
      return new Vector2D(this.x * scalar, this.y * scalar);
    }
  
    /**
     * Calculate the length (magnitude) of the vector
     * @returns Length of the vector
     */
    length(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  
    /**
     * Calculate the distance to another vector
     * @param v Target vector
     * @returns Distance between the vectors
     */
    distance(v: Vector2D): number {
      const dx = this.x - v.x;
      const dy = this.y - v.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    /**
     * Calculate the squared distance to another vector (faster than distance)
     * @param v Target vector
     * @returns Squared distance between the vectors
     */
    distanceSquared(v: Vector2D): number {
      const dx = this.x - v.x;
      const dy = this.y - v.y;
      return dx * dx + dy * dy;
    }
  
    /**
     * Normalize the vector (make it unit length)
     * @returns New normalized vector
     */
    normalize(): Vector2D {
      const len = this.length();
      if (len === 0) {
        return new Vector2D(0, 0);
      }
      return new Vector2D(this.x / len, this.y / len);
    }
  
    /**
     * Return the dot product with another vector
     * @param v Other vector
     * @returns Dot product
     */
    dot(v: Vector2D): number {
      return this.x * v.x + this.y * v.y;
    }
  
    /**
     * Calculate the angle between this vector and another
     * @param v Other vector
     * @returns Angle in radians
     */
    angleTo(v: Vector2D): number {
      const dot = this.dot(v);
      const lenA = this.length();
      const lenB = v.length();
      
      if (lenA === 0 || lenB === 0) {
        return 0;
      }
      
      return Math.acos(Math.min(1, Math.max(-1, dot / (lenA * lenB))));
    }
  
    /**
     * Create a vector from an angle
     * @param angle Angle in radians
     * @param length Length of the vector (default: 1)
     * @returns New vector
     */
    static fromAngle(angle: number, length: number = 1): Vector2D {
      return new Vector2D(
        Math.cos(angle) * length,
        Math.sin(angle) * length
      );
    }
  
    /**
     * Rotate the vector by an angle
     * @param angle Angle in radians
     * @returns New rotated vector
     */
    rotate(angle: number): Vector2D {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return new Vector2D(
        this.x * cos - this.y * sin,
        this.x * sin + this.y * cos
      );
    }
  
    /**
     * Convert to a string representation
     * @returns String representation of the vector
     */
    toString(): string {
      return `(${this.x}, ${this.y})`;
    }
  }