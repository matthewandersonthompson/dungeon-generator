export class Grid<T> {
  private data: T[][];

  constructor(public readonly width: number, public readonly height: number, private defaultValue: T) {
    this.data = [];
    this.initialize();
  }

  private initialize(): void {
    this.data = new Array(this.width);
    for (let x = 0; x < this.width; x++) {
      this.data[x] = new Array(this.height).fill(this.defaultValue);
    }
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  get(x: number, y: number): T | undefined {
    return this.isInBounds(x, y) ? this.data[x][y] : undefined;
  }

  set(x: number, y: number, value: T): boolean {
    if (!this.isInBounds(x, y)) return false;
    this.data[x][y] = value;
    return true;
  }

  fill(value: T): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.data[x][y] = value;
      }
    }
  }

  fillRect(startX: number, startY: number, endX: number, endY: number, value: T): void {
    const x1 = Math.max(0, startX);
    const y1 = Math.max(0, startY);
    const x2 = Math.min(this.width - 1, endX);
    const y2 = Math.min(this.height - 1, endY);
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        this.data[x][y] = value;
      }
    }
  }

  getData(): T[][] {
    return this.data.map(col => [...col]);
  }

  clone(): Grid<T> {
    const newGrid = new Grid<T>(this.width, this.height, this.defaultValue);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        newGrid.set(x, y, this.data[x][y]);
      }
    }
    return newGrid;
  }

  forEach(callback: (value: T, x: number, y: number) => void): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        callback(this.data[x][y], x, y);
      }
    }
  }

  map<U>(callback: (value: T, x: number, y: number) => U): Grid<U> {
    const newGrid = new Grid<U>(this.width, this.height, callback(this.defaultValue, 0, 0));
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        newGrid.set(x, y, callback(this.data[x][y], x, y));
      }
    }
    return newGrid;
  }

  findAll(predicate: (value: T, x: number, y: number) => boolean): [number, number][] {
    const result: [number, number][] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (predicate(this.data[x][y], x, y)) {
          result.push([x, y]);
        }
      }
    }
    return result;
  }

  getNeighbors(x: number, y: number, diagonal: boolean = false): [number, number, T][] {
    const neighbors: [number, number, T][] = [];
    const directions = diagonal 
      ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
      : [[0, -1], [-1, 0], [1, 0], [0, 1]];
    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      if (this.isInBounds(nx, ny)) {
        neighbors.push([nx, ny, this.data[nx][ny]]);
      }
    }
    return neighbors;
  }
}
