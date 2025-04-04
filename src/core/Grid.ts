/**
 * Generic 2D grid class for storing arbitrary data
 */
export class Grid<T> {
    private data: T[][];
  
    /**
     * Create a new grid
     * @param width Width of the grid
     * @param height Height of the grid
     * @param defaultValue Default value to fill the grid with
     */
    constructor(public readonly width: number, public readonly height: number, private defaultValue: T) {
      this.data = [];
      this.initialize();
    }
  
    /**
     * Initialize the grid with the default value
     */
    private initialize(): void {
      this.data = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        this.data[x] = new Array(this.height).fill(this.defaultValue);
      }
    }
  
    /**
     * Check if coordinates are within the grid bounds
     * @param x X coordinate
     * @param y Y coordinate
     * @returns True if the coordinates are valid
     */
    isInBounds(x: number, y: number): boolean {
      return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
  
    /**
     * Get the value at the specified coordinates
     * @param x X coordinate
     * @param y Y coordinate
     * @returns Value at the coordinates or undefined if out of bounds
     */
    get(x: number, y: number): T | undefined {
      if (!this.isInBounds(x, y)) {
        return undefined;
      }
      return this.data[x][y];
    }
  
    /**
     * Set the value at the specified coordinates
     * @param x X coordinate
     * @param y Y coordinate
     * @param value Value to set
     * @returns True if the value was set, false if out of bounds
     */
    set(x: number, y: number, value: T): boolean {
      if (!this.isInBounds(x, y)) {
        return false;
      }
      this.data[x][y] = value;
      return true;
    }
  
    /**
     * Fill the entire grid with a value
     * @param value Value to fill the grid with
     */
    fill(value: T): void {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          this.data[x][y] = value;
        }
      }
    }
  
    /**
     * Fill a rectangular area of the grid with a value
     * @param startX Starting X coordinate
     * @param startY Starting Y coordinate
     * @param endX Ending X coordinate
     * @param endY Ending Y coordinate
     * @param value Value to fill the area with
     */
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
  
    /**
     * Get a copy of the grid data
     * @returns 2D array of the grid data
     */
    getData(): T[][] {
      return this.data.map(col => [...col]);
    }
  
    /**
     * Create a clone of the grid
     * @returns New grid with the same data
     */
    clone(): Grid<T> {
      const newGrid = new Grid<T>(this.width, this.height, this.defaultValue);
      
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          newGrid.set(x, y, this.data[x][y]);
        }
      }
      
      return newGrid;
    }
  
    /**
     * Apply a function to each cell in the grid
     * @param callback Function to apply to each cell
     */
    forEach(callback: (value: T, x: number, y: number) => void): void {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          callback(this.data[x][y], x, y);
        }
      }
    }
  
    /**
     * Map each cell in the grid to a new value
     * @param callback Function to map each cell
     * @returns New grid with mapped values
     */
    map<U>(callback: (value: T, x: number, y: number) => U): Grid<U> {
      const newGrid = new Grid<U>(this.width, this.height, callback(this.defaultValue, 0, 0));
      
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          newGrid.set(x, y, callback(this.data[x][y], x, y));
        }
      }
      
      return newGrid;
    }
  
    /**
     * Find cells that match a predicate
     * @param predicate Function to test each cell
     * @returns Array of [x, y] coordinates of matching cells
     */
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
  
    /**
     * Get the neighbors of a cell
     * @param x X coordinate
     * @param y Y coordinate
     * @param diagonal Whether to include diagonal neighbors
     * @returns Array of [x, y, value] tuples of neighboring cells
     */
    getNeighbors(x: number, y: number, diagonal: boolean = false): [number, number, T][] {
      const neighbors: [number, number, T][] = [];
      const directions = diagonal 
        ? [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
        : [[0, -1], [-1, 0], [1, 0], [0, 1]];
      
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (this.isInBounds(nx, ny)) {
          neighbors.push([nx, ny, this.data[nx][ny]]);
        }
      }
      
      return neighbors;
    }
  }