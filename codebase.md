# package.json

```json
{
  "name": "dungeon-generator",
  "version": "1.0.0",
  "description": "Procedural dungeon generator with layered textures",
  "main": "index.js",
  "scripts": {
    "start": "webpack serve --mode development --open",
    "build": "webpack --mode production",
    "test": "jest"
  },
  "keywords": [
    "dungeon",
    "procedural",
    "generator",
    "typescript",
    "canvas"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@types/jest": "^29.5.6",
    "copy-webpack-plugin": "^11.0.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.0",
    "typescript": "^5.2.2",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  },
  "dependencies": {
    "ai-digest": "^1.0.8"
  }
}

```

# public/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dungeon Generator</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Procedural Dungeon Generator</h1>
  </header>
  
  <main>
    <div id="dungeon-app-container"></div>
  </main>
  
  <footer>
    <p>Procedural Dungeon Generator &copy; 2025</p>
  </footer>
  
  <script src="bundle.js"></script>
</body>
</html>
```

# public/styles.css

```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
  }
  
  header {
    background-color: #333;
    color: #fff;
    padding: 1rem;
    text-align: center;
  }
  
  main {
    padding: 1rem;
    max-width: 1600px;
    margin: 0 auto;
  }
  
  footer {
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
  }
  
  .dungeon-app {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .control-sidebar {
    flex: 0 0 300px;
    background-color: #fff;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .main-content {
    flex: 1;
    min-width: 300px;
    background-color: #fff;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .canvas-container {
    width: 100%;
    overflow: auto;
    margin-bottom: 1rem;
  }
  
  canvas {
    display: block;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  
  .control-group {
    margin-bottom: 1rem;
  }
  
  .control-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  .control-group input[type="number"],
  .control-group input[type="text"],
  .control-group input[type="range"],
  .control-group input[type="color"],
  .control-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
  }
  
  .checkbox-group input {
    margin-right: 0.5rem;
  }
  
  .checkbox-group label {
    margin-bottom: 0;
  }
  
  .slider-value {
    display: inline-block;
    margin-left: 0.5rem;
    min-width: 30px;
  }
  
  .button-container {
    margin-top: 1rem;
    text-align: center;
  }
  
  button {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  button:hover {
    background-color: #555;
  }
  
  .generate-button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1.1rem;
    background-color: #4caf50;
  }
  
  .generate-button:hover {
    background-color: #45a049;
  }
  
  .layer-preview-container {
    background-color: #fff;
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
    width: 100%;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
  }
  
  .layer-preview-container.collapsed {
    max-height: 0;
    padding: 0;
    margin: 0;
    border: none;
    box-shadow: none;
  }
  
  .layer-preview-canvas {
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .layer-control-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .layer-control {
    flex: 1 0 200px;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  .layer-control h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
  
  .export-container {
    margin-top: 1rem;
    text-align: center;
  }
```

# README.md

```md
Dungeon Generator
=================

Welcome to the Dungeon Generator—a TypeScript-powered tool for creating random dungeon layouts that are as unpredictable as your next D&D session! Whether you're a DM looking to spice up your campaign or a developer wanting a robust generator for your Pathfinder-inspired games, this project is for you.

Overview
--------
This generator builds dungeons with:
  • RoomGenerator: Crafts rooms (rectangular, circular, L-shaped, cave-like) and clusters them together like a sketchy, ancient building.
  • CorridorGenerator: Connects rooms using a minimum spanning tree (MST) so that each connection is unique—no extra hallways allowed (unless you want them!).
  • CanvasRenderer: Renders your dungeon on an HTML5 canvas, with plans for smooth curves, funky rock borders, and 45° chamfered corners to keep things visually interesting.

Current Status
--------------
- Rooms are clustered for a compact layout.
- Multiple room types are generated.
- Corridors reliably connect rooms.

Future (Epic) Goals
-------------------
- Smooth, curved circular room rendering.
- Voronoi-style rock borders around walls.
- Diagonal (45°) wall cuts for irregular rooms.
- Cool cosmetic touches (cracks, rocks, water effects, etc.).
- A simple UI for tweaking settings without needing to recompile code.

Setup & Usage
-------------
1. Clone the repo:
   git clone https://github.com/matthewandersonthompson/dungeon-generator.git
   cd dungeon-generator
2. Install dependencies:
   npm install
3. Build and run:
   npm run build
   Open the generated HTML file in your browser or run your dev server.

License
-------
MIT License

Acknowledgements
----------------
Big thanks to all the dungeon delvers, DM gurus, and open-source wizards who inspired this project.

```

# src/app.ts

```ts
import { DungeonGenerator } from './generator/DungeonGenerator';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import { DungeonParamsBuilder } from './generator/DungeonParams';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('dungeon-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  const dungeonParams = DungeonParamsBuilder.createDefault();
  const dungeonGenerator = new DungeonGenerator(dungeonParams);
  const generatedDungeon = dungeonGenerator.generate();
  const canvasRenderer = new CanvasRenderer(canvas, generatedDungeon);
  canvasRenderer.render();
  console.log('Dungeon generation complete!');
  console.log(`Rooms: ${generatedDungeon.rooms.length}`);
  console.log(`Corridors: ${generatedDungeon.corridors.length}`);
  console.log(`Features: ${generatedDungeon.features.length}`);
});
```

# src/core/Geometry.ts

```ts
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

```

# src/core/Grid.ts

```ts
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

```

# src/core/Random.ts

```ts
export class Random {
  private seed: number;
  private m = 2147483647;
  private a = 16807;
  private c = 0;
  private state: number;

  constructor(seed?: string | number) {
    this.seed = this.generateSeed(seed);
    this.state = this.seed;
  }

  private generateSeed(seed?: string | number): number {
    if (seed === undefined) return Math.floor(Math.random() * this.m);
    if (typeof seed === 'number') return seed;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  reset(): void {
    this.state = this.seed;
  }

  next(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state / this.m;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  nextElement<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

```

# src/core/Types.ts

```ts
export enum CellType {
  EMPTY = 0,
  WALL = 1,
  FLOOR = 2,
  CORRIDOR = 3,
  DOOR = 4,
  SECRET_DOOR = 5,
  ENTRANCE = 6,
  EXIT = 7,
  WATER = 8,
  PILLAR = 9,
  STATUE = 10,
  ALTAR = 11,
  FOUNTAIN = 12,
  TRAP = 13,
  TREASURE = 14,
  MONSTER = 15
}

export enum RoomType {
  RECTANGULAR = 'rectangular',
  CIRCULAR = 'circular',
  L_SHAPED = 'l-shaped',
  CAVE = 'cave',
  STAR_SHAPED = 'star-shaped',
  CROSS_SHAPED = 'cross-shaped',
  NORTH_STAR_SHAPED = 'north-star-shaped',
  OCTAGON_SHAPED = 'octagon-shaped'
}

export interface Point {
  x: number;
  y: number;
}

export interface Room {
  id: number;
  type: RoomType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  center: Point;
  cells?: Point[];
  features: Feature[];
  description?: string;
  borderPoints?: Point[];
}

export interface Corridor {
  from: number;
  to: number;
  fromRoom: Room;
  toRoom: Room;
  path: Point[];
  width: number;
}

export interface Door {
  x: number;
  y: number;
  type: CellType.DOOR | CellType.SECRET_DOOR;
  connects: [number, number];
}

export interface Feature {
  x: number;
  y: number;
  type: CellType;
  description: string;
  roomId: number;
}

export interface Dungeon {
  width: number;
  height: number;
  grid: CellType[][];
  rooms: Room[];
  corridors: Corridor[];
  doors: Door[];
  features: Feature[];
  entrance?: Point & { roomId: number };
  exit?: Point & { roomId: number };
  seed: string | number;
  theme: string;
}

export interface DungeonParams {
  width: number;
  height: number;
  numRooms: number;
  roomDensity: number;
  roomSizeVariation: number;
  specialRoomChance: number;
  corridorWidth: number;
  createLoops: boolean;
  loopChance: number;
  featureDensity: number;
  theme: string;
  seed?: string | number;
  hallwayStyle: 'straight' | 'bendy' | 'organic';
  doorFrequency: number;
  secretDoorChance: number;
}

export interface LayerOptions {
  opacity: number;
  density: number;
  scale: number;
  color: string;
  visible: boolean;
}
// Add to your existing Types.ts file

export interface DungeonParams {
  width: number;
  height: number;
  numRooms: number;
  roomDensity: number;
  roomSizeVariation: number;
  specialRoomChance: number;
  corridorWidth: number;
  createLoops: boolean;
  loopChance: number;
  featureDensity: number;
  theme: string;
  seed?: string | number;
  hallwayStyle: 'straight' | 'bendy' | 'organic';
  doorFrequency: number;
  secretDoorChance: number;
  roomTemplateWeights?: Record<string, number>;
}

export interface RoomTemplateParams {
  minSize?: number;
  maxSize?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  minRadius?: number;
  maxRadius?: number;
  [key: string]: any; // Allow for custom parameters
}
```

# src/core/Vector2D.ts

```ts
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

```

# src/generator/CorridorGenerator.ts

```ts
import { Room, Corridor, Point, CellType } from '../core/Types';
import { Random } from '../core/Random';
import { Geometry } from '../core/Geometry';
import { Grid } from '../core/Grid';
import { RoomGenerator } from './RoomGenerator';

// Utility interface for graph edges
interface Edge {
  from: number;
  to: number;
  weight: number;
  roomFrom: Room;
  roomTo: Room;
}

/**
 * Generator for corridors connecting rooms
 */
export class CorridorGenerator {
  private random: Random;
  private corridorWidth: number;
  private createLoops: boolean;
  private loopChance: number;
  private hallwayStyle: 'straight' | 'bendy' | 'organic';
  private roomGenerator?: RoomGenerator;

  /**
   * Create a new corridor generator
   * @param seed Random seed
   * @param corridorWidth Width of corridors (1-3)
   * @param createLoops Whether to create loops in the dungeon
   * @param loopChance Chance of creating additional loop connections
   * @param hallwayStyle Style of hallway generation
   * @param roomGenerator Optional room generator for calculating connection points
   */
  constructor(
    seed?: string | number,
    corridorWidth: number = 1,
    createLoops: boolean = true,
    loopChance: number = 0.3,
    hallwayStyle: 'straight' | 'bendy' | 'organic' = 'bendy',
    roomGenerator?: RoomGenerator
  ) {
    this.random = new Random(seed);
    this.corridorWidth = Math.max(1, Math.min(3, corridorWidth));
    this.createLoops = createLoops;
    this.loopChance = loopChance;
    this.hallwayStyle = hallwayStyle;
    this.roomGenerator = roomGenerator;
  }

  /**
   * Generate corridors between rooms
   * @param rooms List of rooms to connect
   * @param dungeonWidth Width of the dungeon
   * @param dungeonHeight Height of the dungeon
   * @returns Array of generated corridors
   */
  generateCorridors(rooms: Room[], dungeonWidth: number, dungeonHeight: number): Corridor[] {
    if (rooms.length <= 1) {
      return [];
    }
    
    // Create a graph of all possible connections
    const edges = this.createAllPossibleEdges(rooms);
    
    // Generate the minimum spanning tree (MST)
    const mstEdges = this.generateMinimumSpanningTree(edges, rooms.length);
    
    // Use only MST edges, ensuring exactly one hallway between each room pair
    const finalEdges = mstEdges;
    
    // Generate actual corridor paths from the final edges
    return this.createCorridorPaths(finalEdges, dungeonWidth, dungeonHeight);
  }

  /**
   * Create all possible edges between rooms
   * @param rooms List of rooms
   * @returns Array of all possible edges
   */
  private createAllPossibleEdges(rooms: Room[]): Edge[] {
    const edges: Edge[] = [];
    
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const roomA = rooms[i];
        const roomB = rooms[j];
        
        // Calculate distance between room centers
        const distance = Geometry.distance(
          roomA.center.x, roomA.center.y,
          roomB.center.x, roomB.center.y
        );
        
        edges.push({
          from: roomA.id,
          to: roomB.id,
          weight: distance,
          roomFrom: roomA,
          roomTo: roomB
        });
      }
    }
    
    // Sort edges by weight for efficient MST construction
    edges.sort((a, b) => a.weight - b.weight);
    
    return edges;
  }

  /**
   * Generate a minimum spanning tree using Kruskal's algorithm
   * @param edges List of all possible edges
   * @param numRooms Number of rooms
   * @returns List of edges forming the MST
   */
  private generateMinimumSpanningTree(edges: Edge[], numRooms: number): Edge[] {
    // Initialize disjoint set for union-find
    const parent: number[] = [];
    for (let i = 0; i < numRooms; i++) {
      parent[i] = i;
    }
    
    // Find set function for union-find
    const find = (i: number): number => {
      if (parent[i] !== i) {
        parent[i] = find(parent[i]);
      }
      return parent[i];
    };
    
    // Union function for union-find
    const union = (i: number, j: number): void => {
      parent[find(i)] = find(j);
    };
    
    const mstEdges: Edge[] = [];
    
    // Kruskal's algorithm: add edge if it connects two different trees
    for (const edge of edges) {
      const setA = find(edge.from);
      const setB = find(edge.to);
      
      if (setA !== setB) {
        mstEdges.push(edge);
        union(edge.from, edge.to);
        
        // Stop when the MST has (numRooms - 1) edges
        if (mstEdges.length === numRooms - 1) {
          break;
        }
      }
    }
    
    return mstEdges;
  }
  
  /**
   * (Optional) Add additional connections to create loops in the dungeon.
   * This function is no longer used by generateCorridors to ensure one hallway per room pair.
   * @param allEdges List of all possible edges
   * @param mstEdges Edges in the minimum spanning tree
   * @returns Expanded list of edges including loops
   */
  private addLoopConnections(allEdges: Edge[], mstEdges: Edge[]): Edge[] {
    const result: Edge[] = [...mstEdges];
    const mstEdgeSet = new Set(mstEdges.map(edge => `${edge.from}-${edge.to}`));
    
    // Consider edges not in the MST
    for (const edge of allEdges) {
      const edgeKey = `${edge.from}-${edge.to}`;
      const reverseEdgeKey = `${edge.to}-${edge.from}`;
      
      // Skip edges already in the MST
      if (mstEdgeSet.has(edgeKey) || mstEdgeSet.has(reverseEdgeKey)) {
        continue;
      }
      
      // Add edge with probability based on loopChance
      if (this.random.nextFloat(0, 1) < this.loopChance) {
        result.push(edge);
        mstEdgeSet.add(edgeKey);
      }
    }
    
    return result;
  }
  
  /**
   * Create corridor paths for the selected edges
   * @param edges List of edges to create corridors for
   * @param dungeonWidth Width of the dungeon
   * @param dungeonHeight Height of the dungeon
   * @returns List of corridors
   */
  private createCorridorPaths(edges: Edge[], dungeonWidth: number, dungeonHeight: number): Corridor[] {
    const corridors: Corridor[] = [];
    
    for (const edge of edges) {
      const roomFrom = edge.roomFrom;
      const roomTo = edge.roomTo;
      
      let startPoint: Point;
      let endPoint: Point;
      
      // Use room generator to calculate appropriate connection points if available
      if (this.roomGenerator) {
        startPoint = this.roomGenerator.calculateConnectionPoint(roomFrom, roomTo.center);
        endPoint = this.roomGenerator.calculateConnectionPoint(roomTo, roomFrom.center);
      } else {
        // Default to room centers if no room generator
        startPoint = roomFrom.center;
        endPoint = roomTo.center;
      }
      
      // Generate the path between calculated points based on the hallway style
      const path = this.generatePath(startPoint, endPoint, dungeonWidth, dungeonHeight);
      
      corridors.push({
        from: roomFrom.id,
        to: roomTo.id,
        fromRoom: roomFrom,
        toRoom: roomTo,
        path,
        width: this.corridorWidth
      });
    }
    
    return corridors;
  }
  
  /**
   * Generate a path between two points based on the chosen hallway style
   * @param startPoint Source point
   * @param endPoint Destination point
   * @param dungeonWidth Width of the dungeon
   * @param dungeonHeight Height of the dungeon
   * @returns Array of points forming the path
   */
  private generatePath(startPoint: Point, endPoint: Point, dungeonWidth: number, dungeonHeight: number): Point[] {
    switch (this.hallwayStyle) {
      case 'straight':
        return this.generateStraightPath(startPoint, endPoint);
      case 'bendy':
        return this.generateBendyPath(startPoint, endPoint);
      case 'organic':
        return this.generateOrganicPath(startPoint, endPoint, dungeonWidth, dungeonHeight);
      default:
        return this.generateBendyPath(startPoint, endPoint);
    }
  }
  
  /**
   * Generate a straight path between two points
   * @param startPoint Source point
   * @param endPoint Destination point
   * @returns Array of points along a straight line
   */
  private generateStraightPath(startPoint: Point, endPoint: Point): Point[] {
    // Use Bresenham's algorithm to determine the line points
    return Geometry.getLinePoints(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  }
  
  /**
   * Generate a path with one bend between two points
   * @param startPoint Source point
   * @param endPoint Destination point 
   * @returns Array of points forming a path with one bend
   */
  private generateBendyPath(startPoint: Point, endPoint: Point): Point[] {
    let cornerX, cornerY;
    
    // Randomly choose horizontal-first or vertical-first
    if (this.random.nextBoolean()) {
      cornerX = endPoint.x;
      cornerY = startPoint.y;
    } else {
      cornerX = startPoint.x;
      cornerY = endPoint.y;
    }
    
    // Get the two segments of the path
    const firstSegment = Geometry.getLinePoints(startPoint.x, startPoint.y, cornerX, cornerY);
    const secondSegment = Geometry.getLinePoints(cornerX, cornerY, endPoint.x, endPoint.y);
    
    // Combine segments, removing duplicate at the corner
    return [...firstSegment, ...secondSegment.slice(1)];
  }
  
  /**
   * Generate an organic path with 2-4 bends between two points
   * @param startPoint Source point
   * @param endPoint Destination point
   * @param dungeonWidth Width of the dungeon
   * @param dungeonHeight Height of the dungeon
   * @returns Array of points forming an organic path
   */
  private generateOrganicPath(startPoint: Point, endPoint: Point, dungeonWidth: number, dungeonHeight: number): Point[] {
    // Determine a random number of bends (2-4)
    const bendCount = this.random.nextInt(2, 4);
    const points: Point[] = [startPoint];
    
    // Generate intermediate points that move toward the destination
    for (let i = 0; i < bendCount; i++) {
      const progressRatio = (i + 1) / (bendCount + 1);
      const targetX = startPoint.x + (endPoint.x - startPoint.x) * progressRatio;
      const targetY = startPoint.y + (endPoint.y - startPoint.y) * progressRatio;
      
      // Add some randomness within bounds
      const variance = 10;
      const x = Math.max(0, Math.min(dungeonWidth - 1, targetX + this.random.nextInt(-variance, variance)));
      const y = Math.max(0, Math.min(dungeonHeight - 1, targetY + this.random.nextInt(-variance, variance)));
      
      points.push({ x, y });
    }
    
    // Append the final destination point
    points.push(endPoint);
    
    // Connect all points to form a continuous path
    const path: Point[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const segment = Geometry.getLinePoints(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
      if (i === 0) {
        path.push(...segment);
      } else {
        path.push(...segment.slice(1));
      }
    }
    
    return path;
  }
}
```

# src/generator/DoorGenerator.ts

```ts
import { Room, Corridor, Door, CellType, Point } from '../core/Types';
import { Random } from '../core/Random';
import { Grid } from '../core/Grid';

export class DoorGenerator {
  private random: Random;
  private doorFrequency: number;
  private secretDoorChance: number;

  constructor(
    seed?: string | number,
    doorFrequency = 0.8,
    secretDoorChance = 0.1
  ) {
    this.random = new Random(seed);
    this.doorFrequency = Math.min(Math.max(0, doorFrequency), 1);
    this.secretDoorChance = Math.min(Math.max(0, secretDoorChance), 1);
  }

  placeDoors(rooms: Room[], corridors: Corridor[], grid: Grid<CellType>): Door[] {
    const doors: Door[] = [];
    
    for (const corridor of corridors) {
      const path = corridor.path;
      if (path.length < 2) continue;
      
      this.checkCorridorEntrances(doors, corridor, grid);
    }
    
    return doors;
  }

  private checkCorridorEntrances(
    doors: Door[], 
    corridor: Corridor, 
    grid: Grid<CellType>
  ): void {
    const path = corridor.path;
    const checkPoints = [
      { entrance: path[0], reference: path[1] },
      { entrance: path[path.length - 1], reference: path[path.length - 2] }
    ];

    checkPoints.forEach(({ entrance, reference }) => {
      this.tryPlaceDoor(
        doors, 
        corridor.from, 
        corridor.to, 
        entrance, 
        reference, 
        grid
      );
    });
  }

  private tryPlaceDoor(
    doors: Door[], 
    roomId: number, 
    otherRoomId: number, 
    point: Point,
    directionPoint: Point,
    grid: Grid<CellType>
  ): void {
    if (this.random.nextFloat(0, 1) > this.doorFrequency) return;
    
    // Safely get cell types with a default value
    const pointValue = grid.get(point.x, point.y) ?? CellType.EMPTY;
    const directionValue = grid.get(directionPoint.x, directionPoint.y) ?? CellType.EMPTY;
    
    // Check if this is a valid door location (transition between floor and corridor)
    const isDoorLocation = 
      (pointValue === CellType.FLOOR && directionValue === CellType.CORRIDOR) ||
      (pointValue === CellType.CORRIDOR && directionValue === CellType.FLOOR);

    if (!isDoorLocation) return;

    // Determine if it should be a secret door
    const doorType = this.random.nextFloat(0, 1) < this.secretDoorChance
      ? CellType.SECRET_DOOR
      : CellType.DOOR;
    
    const door: Door = {
      x: point.x,
      y: point.y,
      type: doorType,
      connects: [roomId, otherRoomId]
    };
    
    doors.push(door);
    grid.set(point.x, point.y, doorType);
  }

  /**
   * Find potential door locations between two rooms
   * @param roomA First room
   * @param roomB Second room
   * @param grid Dungeon grid
   * @returns Array of potential door positions
   */
  private findPotentialDoorLocations(roomA: Room, roomB: Room, grid: Grid<CellType>): Point[] {
    if (!roomA.cells || !roomB.cells) return [];
    
    const wallsA = this.findRoomWalls(roomA, grid);
    const wallsB = this.findRoomWalls(roomB, grid);
    
    // Find pairs of walls that are adjacent
    return wallsA.flatMap(wallA => 
      wallsB.filter(wallB => {
        const dx = Math.abs(wallA.x - wallB.x);
        const dy = Math.abs(wallA.y - wallB.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
      }).map(wallB => ({
        x: Math.floor((wallA.x + wallB.x) / 2),
        y: Math.floor((wallA.y + wallB.y) / 2)
      }))
    );
  }

  /**
   * Find wall cells for a room
   * @param room Room to find walls for
   * @param grid Dungeon grid
   * @returns Array of wall cell positions
   */
  private findRoomWalls(room: Room, grid: Grid<CellType>): Point[] {
    if (!room.cells) {
      if (!room.width || !room.height) return [];
      
      // For rectangular rooms without explicit cells
      const walls: Point[] = [];
      const { x, y, width, height } = room;
      
      for (let i = x; i < x + width; i++) {
        walls.push({ x: i, y }, { x: i, y: y + height - 1 });
      }
      
      for (let j = y + 1; j < y + height - 1; j++) {
        walls.push({ x, y: j }, { x: x + width - 1, y: j });
      }
      
      return walls;
    }
    
    // For rooms with explicit cells
    return room.cells.filter(cell => {
      // Check if this cell has at least one non-room neighbor
      const adjacentCells = [
        { x: cell.x - 1, y: cell.y },
        { x: cell.x + 1, y: cell.y },
        { x: cell.x, y: cell.y - 1 },
        { x: cell.x, y: cell.y + 1 }
      ];
      
      return adjacentCells.some(neighbor => 
        grid.isInBounds(neighbor.x, neighbor.y) && 
        [CellType.EMPTY, CellType.WALL].includes(grid.get(neighbor.x, neighbor.y) ?? CellType.EMPTY)
      );
    });
  }
}
```

# src/generator/DungeonGenerator.ts

```ts
import { Dungeon, DungeonParams, CellType, Room, Corridor, Door, Feature, Point } from '../core/Types';
import { Grid } from '../core/Grid';
import { Random } from '../core/Random';
import { RoomGenerator } from './RoomGenerator';
import { CorridorGenerator } from './CorridorGenerator';
import { DoorGenerator } from './DoorGenerator';
import { FeatureGenerator } from './FeatureGenerator';
import { DungeonParamsBuilder } from './DungeonParams';
import { RoomTemplate } from './templates/RoomTemplate';
import { StarRoomTemplate } from './templates/StarRoomTemplate';
import { CrossRoomTemplate } from './templates/CrossRoomTemplate';
import { LShapedRoomTemplate } from './templates/LShapedRoomTemplate';
import { NorthStarRoomTemplate } from './templates/NorthStarRoomTemplate';
import { OctagonRoomTemplate } from './templates/OctagonRoomTemplate';

/**
 * Main dungeon generator that uses all other components
 */
export class DungeonGenerator {
  private params: DungeonParams;
  private random: Random;
  private grid: Grid<CellType>;
  private roomGenerator: RoomGenerator;
  private corridorGenerator: CorridorGenerator;
  private doorGenerator: DoorGenerator;
  private featureGenerator: FeatureGenerator;

  /**
   * Create a new dungeon generator
   * @param params Parameters for dungeon generation
   */
  constructor(params: Partial<DungeonParams> = {}) {
    // Validate and normalize parameters
    this.params = DungeonParamsBuilder.validateAndNormalize(params);
    
    // Create a random number generator
    this.random = new Random(this.params.seed);
    
    // Create the grid
    this.grid = new Grid<CellType>(this.params.width, this.params.height, CellType.EMPTY);
    
    // Initialize room generator with template system
    this.roomGenerator = new RoomGenerator(
      this.params.seed,
      this.params.roomSizeVariation,
      this.params.specialRoomChance
    );
    
    // Initialize corridor generator with access to room generator for connection points
    this.corridorGenerator = new CorridorGenerator(
      this.params.seed,
      this.params.corridorWidth,
      this.params.createLoops,
      this.params.loopChance,
      this.params.hallwayStyle,
      this.roomGenerator
    );
    
    this.doorGenerator = new DoorGenerator(
      this.params.seed,
      this.params.doorFrequency,
      this.params.secretDoorChance
    );
    
    this.featureGenerator = new FeatureGenerator(
      this.params.seed,
      this.params.featureDensity,
      this.params.theme
    );
    
    // Register additional room templates
    this.registerCustomRoomTemplates();
  }

  /**
   * Register custom room templates with the room generator
   * This is where you can easily add new room types
   */
  private registerCustomRoomTemplates(): void {
    // Register L-shaped room template
    const lShapedTemplate = new LShapedRoomTemplate();
    this.roomGenerator.registerTemplate(
      lShapedTemplate, 
      this.params.specialRoomChance / 5  // Reduced weight to accommodate new templates
    );
    
    // Register star-shaped room template (if available)
    try {
      const starTemplate = new StarRoomTemplate();
      this.roomGenerator.registerTemplate(
        starTemplate, 
        this.params.specialRoomChance / 5
      );
    } catch (e) {
      console.warn("StarRoomTemplate not available");
    }
    
    // Register cross-shaped room template (if available)
    try {
      const crossTemplate = new CrossRoomTemplate();
      this.roomGenerator.registerTemplate(
        crossTemplate, 
        this.params.specialRoomChance / 5
      );
    } catch (e) {
      console.warn("CrossRoomTemplate not available");
    }
    
    // Register north star room template (if available)
    try {
      const northStarTemplate = new NorthStarRoomTemplate();
      this.roomGenerator.registerTemplate(
        northStarTemplate, 
        this.params.specialRoomChance / 5
      );
    } catch (e) {
      console.warn("NorthStarRoomTemplate not available");
    }
    
    // Register octagon room template (if available)
    try {
      const octagonTemplate = new OctagonRoomTemplate();
      this.roomGenerator.registerTemplate(
        octagonTemplate, 
        this.params.specialRoomChance / 5
      );
    } catch (e) {
      console.warn("OctagonRoomTemplate not available");
    }
  }

  /**
   * Generate a complete dungeon
   * @returns Generated dungeon
   */
  generate(): Dungeon {
    // Step 1: Generate rooms
    const rooms = this.roomGenerator.generateRooms(
      this.params.width,
      this.params.height,
      this.params.numRooms,
      this.params.roomDensity
    );
    
    // Add room descriptions
    this.roomGenerator.generateRoomDescriptions(rooms, this.params.theme);
    
    // Step 2: Generate corridors
    const corridors = this.corridorGenerator.generateCorridors(
      rooms,
      this.params.width,
      this.params.height
    );
    
    // Step 3: Build the grid
    this.buildGrid(rooms, corridors);
    
    // Step 4: Place doors
    const doors = this.doorGenerator.placeDoors(rooms, corridors, this.grid);
    
    // Step 5: Add features
    const features = this.featureGenerator.generateFeatures(rooms, this.grid);
    
    // Step 6: Place entrance and exit
    const { entrance, exit } = this.featureGenerator.placeEntranceAndExit(rooms, this.grid);
    
    // Create the dungeon object
    const dungeon: Dungeon = {
      width: this.params.width,
      height: this.params.height,
      grid: this.grid.getData(),
      rooms,
      corridors,
      doors,
      features,
      entrance,
      exit,
      seed: this.params.seed || this.random.next(), // Use the actual seed
      theme: this.params.theme
    };
    
    return dungeon;
  }

  /**
   * Build the grid based on rooms and corridors
   * @param rooms Array of rooms
   * @param corridors Array of corridors
   */
  private buildGrid(rooms: Room[], corridors: Corridor[]): void {
    // Start with an empty grid
    this.grid.fill(CellType.EMPTY);
    
    // Place walls everywhere initially
    for (let x = 0; x < this.params.width; x++) {
      for (let y = 0; y < this.params.height; y++) {
        this.grid.set(x, y, CellType.WALL);
      }
    }
    
    // Add rooms to the grid
    for (const room of rooms) {
      if (room.cells) {
        // For rooms with defined cells (custom shapes, templates, etc.)
        for (const cell of room.cells) {
          this.grid.set(cell.x, cell.y, CellType.FLOOR);
        }
      } else if (room.width && room.height) {
        // For rectangular rooms
        for (let x = room.x; x < room.x + room.width; x++) {
          for (let y = room.y; y < room.y + room.height; y++) {
            this.grid.set(x, y, CellType.FLOOR);
          }
        }
      } else if (room.radius) {
        // For circular rooms
        const centerX = room.center.x;
        const centerY = room.center.y;
        const radius = room.radius;
        
        for (let x = centerX - radius; x <= centerX + radius; x++) {
          for (let y = centerY - radius; y <= centerY + radius; y++) {
            if (this.grid.isInBounds(x, y)) {
              const dx = x - centerX;
              const dy = y - centerY;
              if (dx * dx + dy * dy <= radius * radius) {
                this.grid.set(x, y, CellType.FLOOR);
              }
            }
          }
        }
      }
    }
    
    // Add corridors to the grid
    for (const corridor of corridors) {
      const path = corridor.path;
      
      for (const point of path) {
        this.grid.set(point.x, point.y, CellType.CORRIDOR);
        
        // For wider corridors, also set adjacent cells
        if (corridor.width > 1) {
          const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          
          for (const [dx, dy] of offsets) {
            const nx = point.x + dx;
            const ny = point.y + dy;
            
            if (this.grid.isInBounds(nx, ny) && 
                this.grid.get(nx, ny) === CellType.WALL) {
              this.grid.set(nx, ny, CellType.CORRIDOR);
            }
          }
        }
      }
    }
  }

  /**
   * Get all registered room templates
   * @returns Array of room templates
   */
  getRoomTemplates(): RoomTemplate[] {
    return this.roomGenerator.getTemplates();
  }

  /**
   * Get the weight for a specific room template
   * @param type Room type to get weight for
   * @returns Weight value
   */
  getRoomTemplateWeight(type: string): number {
    return this.roomGenerator.getTemplateWeight(type);
  }

  /**
   * Set the weight for a specific room template
   * @param type Room type to set weight for
   * @param weight New weight value
   */
  setRoomTemplateWeight(type: string, weight: number): void {
    this.roomGenerator.setTemplateWeight(type, weight);
  }

  /**
   * Register a new room template
   * @param template Template to register
   * @param weight Weight for the template
   */
  registerRoomTemplate(template: RoomTemplate, weight: number = 1.0): void {
    this.roomGenerator.registerTemplate(template, weight);
  }

  /**
   * Create a new dungeon generator with default parameters
   */
  static createDefault(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createDefault());
  }

  /**
   * Create a new dungeon generator for a small dungeon
   */
  static createSmall(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createSmall());
  }

  /**
   * Create a new dungeon generator for a large dungeon
   */
  static createLarge(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createLarge());
  }

  /**
   * Create a new dungeon generator for a cave-like dungeon
   */
  static createCave(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createCave());
  }

  /**
   * Create a new dungeon generator for a maze-like dungeon
   */
  static createMaze(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createMaze());
  }

  /**
   * Create a new dungeon generator for a loopy dungeon
   */
  static createLoopy(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createLoopy());
  }

  /**
   * Create a new dungeon generator for a temple-like dungeon
   */
  static createTemple(): DungeonGenerator {
    return new DungeonGenerator(DungeonParamsBuilder.createTemple());
  }

  /**
   * Create a new dungeon generator for a fancy dungeon with special rooms
   */
  static createFancyDungeon(): DungeonGenerator {
    return new DungeonGenerator(
      DungeonParamsBuilder.customize(params => ({
        ...params,
        specialRoomChance: 0.5, // Higher chance of special rooms
        roomTemplateWeights: {
          'rectangular': 0.4,    // Reduced weight for standard rooms
          'circular': 0.1,
          'l-shaped': 0.1,
          'star-shaped': 0.15,   // Increased weight for stars
          'cross-shaped': 0.15,  // Increased weight for crosses
          'north-star-shaped': 0.1, // Include north stars
          'octagon-shaped': 0.1    // Include octagons
        },
        theme: 'temple'  // Theme that would work well with geometric room shapes
      }))
    );
  }
}
```

# src/generator/DungeonParams.ts

```ts
import { DungeonParams } from '../core/Types';

export class DungeonParamsBuilder {
  static createDefault(): DungeonParams {
    return {
      width: 50,
      height: 50,
      numRooms: 15,
      roomDensity: 0.8,
      roomSizeVariation: 0.5,
      specialRoomChance: 0.2,
      corridorWidth: 1,
      createLoops: false,
      loopChance: 0,
      featureDensity: 0.5,
      theme: 'standard',
      hallwayStyle: 'bendy',
      doorFrequency: 0.8,
      secretDoorChance: 0.1,
      roomTemplateWeights: {
        'rectangular': 0.6,
        'circular': 0.1,
        'l-shaped': 0.08,
        'star-shaped': 0.08,
        'cross-shaped': 0.08,
        'north-star-shaped': 0.06, // Add these new types
        'octagon-shaped': 0.06     // Add these new types
      }
    };
  }

  static createSmall(): DungeonParams {
    return { ...this.createDefault(), width: 30, height: 30, numRooms: 5 };
  }

  static createLarge(): DungeonParams {
    return { ...this.createDefault(), width: 80, height: 80, numRooms: 30 };
  }

  static createCave(): DungeonParams {
    return {
      ...this.createDefault(),
      roomDensity: 0.7,
      roomSizeVariation: 0.8,
      specialRoomChance: 0.4,
      hallwayStyle: 'organic',
      theme: 'cave',
      roomTemplateWeights: {
        'rectangular': 0.3,
        'circular': 0.2,
        'l-shaped': 0.1,
        'star-shaped': 0.1,
        'cross-shaped': 0.05,
        'north-star-shaped': 0.05,
        'octagon-shaped': 0.1,
        'cave': 0.3
      }
    };
  }

  static createMaze(): DungeonParams {
    return {
      ...this.createDefault(),
      numRooms: 10,
      roomDensity: 0.3,
      roomSizeVariation: 0.3,
      createLoops: false,
      hallwayStyle: 'bendy',
      theme: 'maze',
      roomTemplateWeights: {
        'rectangular': 0.7,
        'circular': 0.1,
        'l-shaped': 0.1,
        'octagon-shaped': 0.1
      }
    };
  }

  static createLoopy(): DungeonParams {
    return {
      ...this.createDefault(),
      createLoops: true,
      loopChance: 0.5,
      hallwayStyle: 'straight',
      theme: 'loopy',
      roomTemplateWeights: {
        'rectangular': 0.5,
        'circular': 0.2,
        'cross-shaped': 0.1,
        'star-shaped': 0.1,
        'north-star-shaped': 0.1
      }
    };
  }

  static createTemple(): DungeonParams {
    return {
      ...this.createDefault(),
      specialRoomChance: 0.4,
      featureDensity: 0.8,
      doorFrequency: 1.0,
      secretDoorChance: 0.2,
      theme: 'temple',
      roomTemplateWeights: {
        'rectangular': 0.3,
        'circular': 0.2,
        'cross-shaped': 0.2,
        'star-shaped': 0.15,
        'octagon-shaped': 0.15
      }
    };
  }

  static customize(customizer: (params: DungeonParams) => DungeonParams): DungeonParams {
    return customizer(this.createDefault());
  }

  static validateAndNormalize(params: Partial<DungeonParams>): DungeonParams {
    const clamp = (value: number, min = 0, max = 1) => 
      Math.min(max, Math.max(min, value));

    const defaults = this.createDefault();
    const normalized: DungeonParams = { ...defaults, ...params };

    // Validate dimensions and room count
    normalized.width = Math.max(10, normalized.width);
    normalized.height = Math.max(10, normalized.height);
    const maxRooms = Math.floor((normalized.width * normalized.height) / 25);
    normalized.numRooms = Math.min(maxRooms, Math.max(1, normalized.numRooms));

    // Clamp probability values
    const probabilityKeys = [
      'roomDensity', 
      'roomSizeVariation', 
      'specialRoomChance', 
      'loopChance', 
      'featureDensity', 
      'doorFrequency', 
      'secretDoorChance'
    ] as const;

    probabilityKeys.forEach(key => {
      const value = normalized[key];
      normalized[key] = clamp(value as number);
    });

    // Validate corridor width
    normalized.corridorWidth = Math.max(1, Math.min(3, normalized.corridorWidth));

    // Ensure room template weights are present
    if (!normalized.roomTemplateWeights) {
      normalized.roomTemplateWeights = defaults.roomTemplateWeights;
    }

    return normalized;
  }
}
```

# src/generator/FeatureGenerator.ts

```ts
import { Room, Feature, CellType, Point } from '../core/Types';
import { Random } from '../core/Random';
import { Grid } from '../core/Grid';

export class FeatureGenerator {
  private random: Random;
  private featureDensity: number;
  private theme: string;

  constructor(
    seed?: string | number,
    featureDensity = 0.5,
    theme = 'standard'
  ) {
    this.random = new Random(seed);
    this.featureDensity = Math.min(Math.max(0, featureDensity), 1);
    this.theme = theme;
  }

  generateFeatures(rooms: Room[], grid: Grid<CellType>): Feature[] {
    const allFeatures: Feature[] = [];
    
    rooms.forEach(room => {
      const features = this.generateRoomFeatures(room, grid);
      room.features = features;
      allFeatures.push(...features);
      
      features.forEach(feature => {
        grid.set(feature.x, feature.y, feature.type);
      });
    });
    
    return allFeatures;
  }

  private generateRoomFeatures(room: Room, grid: Grid<CellType>): Feature[] {
    const floorCells = this.getAvailableFloorCells(room, grid);
    if (floorCells.length === 0) return [];
    
    const roomSize = floorCells.length;
    const maxFeatures = Math.max(1, Math.ceil(roomSize * this.featureDensity / 10));
    const featureCount = this.random.nextInt(0, maxFeatures);
    
    const features: Feature[] = [];
    
    for (let i = 0; i < featureCount; i++) {
      if (floorCells.length === 0) break;
      
      const cellIndex = this.random.nextInt(0, floorCells.length - 1);
      const cell = floorCells[cellIndex];
      floorCells.splice(cellIndex, 1);
      
      const feature = this.createFeature(room.id, cell, room);
      if (feature) {
        features.push(feature);
        this.markSurroundingCellsAsUsed(cell, floorCells);
      }
    }
    
    return features;
  }

  private createFeature(roomId: number, location: Point, room: Room): Feature | null {
    const featureType = this.selectFeatureType(room);
    const description = this.getFeatureDescription(featureType);
    
    return {
      x: location.x,
      y: location.y,
      type: featureType,
      description,
      roomId
    };
  }

  private getAvailableFloorCells(room: Room, grid: Grid<CellType>): Point[] {
    if (room.cells) {
      return room.cells.filter(cell => 
        grid.get(cell.x, cell.y) === CellType.FLOOR
      );
    }
    
    if (!room.width || !room.height) return [];
    
    const floorCells: Point[] = [];
    
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        if (grid.get(x, y) === CellType.FLOOR) {
          floorCells.push({ x, y });
        }
      }
    }
    
    return floorCells;
  }

  private markSurroundingCellsAsUsed(center: Point, availableCells: Point[]): void {
    const bufferSize = 1;
    
    for (let i = availableCells.length - 1; i >= 0; i--) {
      const cell = availableCells[i];
      const dx = Math.abs(cell.x - center.x);
      const dy = Math.abs(cell.y - center.y);
      
      if (dx <= bufferSize && dy <= bufferSize) {
        availableCells.splice(i, 1);
      }
    }
  }

  private selectFeatureType(room: Room): CellType {
    const featureProbabilities: Record<string, Partial<Record<CellType, number>>> = {
      'standard': {
        [CellType.PILLAR]: 0.25,
        [CellType.STATUE]: 0.10,
        [CellType.FOUNTAIN]: 0.05,
        [CellType.ALTAR]: 0.05,
        [CellType.TRAP]: 0.15,
        [CellType.TREASURE]: 0.15,
        [CellType.MONSTER]: 0.25
      },
      'cave': {
        [CellType.PILLAR]: 0.05,
        [CellType.STATUE]: 0.05,
        [CellType.FOUNTAIN]: 0.15,
        [CellType.ALTAR]: 0.05,
        [CellType.TRAP]: 0.20,
        [CellType.TREASURE]: 0.20,
        [CellType.MONSTER]: 0.30,
        [CellType.WATER]: 0.20
      },
      'temple': {
        [CellType.PILLAR]: 0.30,
        [CellType.STATUE]: 0.25,
        [CellType.FOUNTAIN]: 0.10,
        [CellType.ALTAR]: 0.20,
        [CellType.TRAP]: 0.05,
        [CellType.TREASURE]: 0.05,
        [CellType.MONSTER]: 0.05
      },
      'maze': {
        [CellType.PILLAR]: 0.10,
        [CellType.STATUE]: 0.05,
        [CellType.FOUNTAIN]: 0.05,
        [CellType.ALTAR]: 0.05,
        [CellType.TRAP]: 0.30,
        [CellType.TREASURE]: 0.15,
        [CellType.MONSTER]: 0.30
      },
      'loopy': {
        [CellType.PILLAR]: 0.20,
        [CellType.STATUE]: 0.15,
        [CellType.FOUNTAIN]: 0.10,
        [CellType.ALTAR]: 0.10,
        [CellType.TRAP]: 0.15,
        [CellType.TREASURE]: 0.15,
        [CellType.MONSTER]: 0.15
      }
    };
    
    const themeProbs = featureProbabilities[this.theme] || featureProbabilities.standard;
    const rand = this.random.nextFloat(0, 1);
    
    let cumulativeProbability = 0;
    for (const [typeStr, probability] of Object.entries(themeProbs)) {
      cumulativeProbability += probability;
      if (rand <= cumulativeProbability) {
        return parseInt(typeStr);
      }
    }
    
    return CellType.MONSTER;
  }

  private getFeatureDescription(featureType: CellType): string {
    const descriptions: Partial<Record<CellType, string[]>> = {
      [CellType.PILLAR]: [
        "A sturdy stone pillar supporting the ceiling.",
        "A tall column decorated with intricate carvings.",
        "A cracked pillar that looks like it might collapse.",
        "A pillar with strange symbols etched into its surface."
      ],
      [CellType.STATUE]: [
        "A stone statue of a warrior with a stern expression.",
        "A weathered statue of an unknown deity.",
        "A small statuette on a pedestal.",
        "A life-sized statue of a robed figure."
      ],
      [CellType.FOUNTAIN]: [
        "A small fountain with clear water bubbling up.",
        "A dry fountain basin with intricate stonework.",
        "A fountain with strange colored water.",
        "An ornate fountain with a creature sculpture at its center."
      ],
      [CellType.ALTAR]: [
        "A stone altar with dark stains on its surface.",
        "A small shrine with candles and offerings.",
        "An altar carved with religious symbols.",
        "A raised dais with an altar at its center."
      ],
      [CellType.TRAP]: [
        "A suspicious section of floor.",
        "A wire stretched across the path.",
        "A pressure plate barely visible in the floor.",
        "A ceiling with small holes that might release darts."
      ],
      [CellType.TREASURE]: [
        "A small chest partially buried in the floor.",
        "A pile of coins glinting in the darkness.",
        "A gemstone embedded in the wall.",
        "A collection of valuable-looking objects."
      ],
      [CellType.MONSTER]: [
        "Something lurks in the shadows here.",
        "Strange scratches on the floor suggest a creature's lair.",
        "The remnants of a recent meal indicate a predator.",
        "An area where a creature appears to have made its home."
      ],
      [CellType.WATER]: [
        "A small pool of clear water.",
        "A puddle of stagnant water.",
        "A narrow stream flowing across the floor.",
        "A deep pool of dark water."
      ]
    };
    
    const options = descriptions[featureType] || ["An unknown feature."];
    return this.random.nextElement(options);
  }

  placeEntranceAndExit(rooms: Room[], grid: Grid<CellType>): { 
    entrance?: Point & { roomId: number },
    exit?: Point & { roomId: number }
  } {
    if (rooms.length < 2) return {};
    
    let maxDistance = 0;
    let entranceRoom = rooms[0];
    let exitRoom = rooms[1];
    
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const roomA = rooms[i];
        const roomB = rooms[j];
        
        const distance = Math.hypot(
          roomA.center.x - roomB.center.x,
          roomA.center.y - roomB.center.y
        );
        
        if (distance > maxDistance) {
          maxDistance = distance;
          entranceRoom = roomA;
          exitRoom = roomB;
        }
      }
    }
    
    const entranceFloorCells = this.getAvailableFloorCells(entranceRoom, grid);
    const exitFloorCells = this.getAvailableFloorCells(exitRoom, grid);
    
    if (entranceFloorCells.length === 0 || exitFloorCells.length === 0) {
      return {};
    }
    
    const entranceCell = this.random.nextElement(entranceFloorCells);
    const exitCell = this.random.nextElement(exitFloorCells);
    
    grid.set(entranceCell.x, entranceCell.y, CellType.ENTRANCE);
    grid.set(exitCell.x, exitCell.y, CellType.EXIT);
    
    return {
      entrance: { ...entranceCell, roomId: entranceRoom.id },
      exit: { ...exitCell, roomId: exitRoom.id }
    };
  }
}
```

# src/generator/RoomGenerator.ts

```ts
// src/generator/RoomGenerator.ts

import { Room, RoomType, Point } from '../core/Types';
import { Random } from '../core/Random';
import { Grid } from '../core/Grid';
import { RoomTemplateRegistry } from './templates/RoomTemplateRegistry';
import { RectangularRoomTemplate } from './templates/RectangularRoomTemplate';
import { CircularRoomTemplate } from './templates/CircularRoomTemplate';
import { RoomTemplate, RoomTemplateParams } from './templates/RoomTemplate';

export class RoomGenerator {
  private random: Random;
  private templateRegistry: RoomTemplateRegistry;
  private templateParams: Map<RoomType, RoomTemplateParams> = new Map();
  
  constructor(
    seed?: string | number,
    roomSizeVariation = 0.5,
    specialRoomChance = 0.2
  ) {
    this.random = new Random(seed);
    this.templateRegistry = new RoomTemplateRegistry(seed);
    
    // Register default templates
    this.registerDefaultTemplates(roomSizeVariation);
    
    // Set weights based on special room chance
    this.configureTemplateWeights(specialRoomChance);
  }
  
  private registerDefaultTemplates(roomSizeVariation: number): void {
    // Register rectangular room template
    const rectTemplate = new RectangularRoomTemplate();
    this.templateRegistry.registerTemplate(rectTemplate);
    
    // Adjust rectangular room params based on size variation
    const rectParams: RoomTemplateParams = {
      minWidth: 3 + Math.floor(roomSizeVariation * 2),
      maxWidth: 8 + Math.floor(roomSizeVariation * 7),
      minHeight: 3 + Math.floor(roomSizeVariation * 2),
      maxHeight: 8 + Math.floor(roomSizeVariation * 7)
    };
    this.templateParams.set(RoomType.RECTANGULAR, rectParams);
    
    // Register circular room template
    const circTemplate = new CircularRoomTemplate();
    this.templateRegistry.registerTemplate(circTemplate);
    
    // Adjust circular room params based on size variation
    const circParams: RoomTemplateParams = {
      minRadius: 3 + Math.floor(roomSizeVariation),
      maxRadius: 6 + Math.floor(roomSizeVariation * 3)
    };
    this.templateParams.set(RoomType.CIRCULAR, circParams);
  }
  
  private configureTemplateWeights(specialRoomChance: number): void {
    this.templateRegistry.setWeight(RoomType.RECTANGULAR, 1.0 - specialRoomChance);
    
    // Distribute special room chance among special room types
    const specialTemplates = this.templateRegistry.getAllTemplates()
      .filter(template => template.type !== RoomType.RECTANGULAR);
    
    if (specialTemplates.length > 0) {
      const specialWeight = specialRoomChance / specialTemplates.length;
      specialTemplates.forEach(template => {
        this.templateRegistry.setWeight(template.type, specialWeight);
      });
    }
  }
  
  generateRooms(width: number, height: number, numRooms: number, density: number): Room[] {
    const rooms: Room[] = [];
    const maxAttempts = numRooms * 10;
    let attempts = 0;
    
    const grid = new Grid<boolean>(width, height, false);
    const effectiveBuffer = Math.max(1, Math.ceil(1 * (1.5 - density)));
    
    while (rooms.length < numRooms && attempts < maxAttempts) {
      attempts++;
      
      // Select a room template
      const template = this.templateRegistry.selectRandomTemplate();
      
      // Get template-specific parameters
      const templateParams = this.templateParams.get(template.type) || template.getDefaultParams();
      
      // Calculate placement
      const { x, y } = this.calculateRoomPlacement(
        width, height, template, templateParams, density
      );
      
      // Generate room
      const room = template.generateRoom(
        rooms.length, x, y, width, height, this.random, templateParams
      );
      
      if (this.canPlaceRoom(room, grid, rooms, effectiveBuffer)) {
        this.markRoomCells(room, grid);
        rooms.push(room);
      }
    }
    
    return rooms;
  }
  
  private calculateRoomPlacement(
    width: number, 
    height: number, 
    template: RoomTemplate,
    params: RoomTemplateParams,
    density: number
  ): { x: number, y: number } {
    // Calculate room size bounds
    const maxRoomWidth = params.maxWidth || (params.maxRadius ? params.maxRadius * 2 + 1 : 0) || width;
    const maxRoomHeight = params.maxHeight || (params.maxRadius ? params.maxRadius * 2 + 1 : 0) || height;
    
    // Calculate placement area
    const clusterWidth = Math.floor(width * (1 - (density * 0.5)));
    const clusterHeight = Math.floor(height * (1 - (density * 0.5)));
    const offsetX = Math.floor((width - clusterWidth) / 2);
    const offsetY = Math.floor((height - clusterHeight) / 2);
    
    // Determine placement
    const x = this.random.nextInt(offsetX, offsetX + clusterWidth - maxRoomWidth);
    const y = this.random.nextInt(offsetY, offsetY + clusterHeight - maxRoomHeight);
    
    return { x, y };
  }
  
  private canPlaceRoom(room: Room, grid: Grid<boolean>, existingRooms: Room[], buffer: number): boolean {
    // Implementation same as before
    const minX = Math.max(0, room.x - buffer);
    const minY = Math.max(0, room.y - buffer);
    const maxX = Math.min(grid.width - 1, room.x + (room.width || 0) + buffer);
    const maxY = Math.min(grid.height - 1, room.y + (room.height || 0) + buffer);
    
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (grid.get(x, y)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  private markRoomCells(room: Room, grid: Grid<boolean>): void {
    // Implementation same as before
    if (room.cells) {
      room.cells.forEach(cell => {
        if (grid.isInBounds(cell.x, cell.y)) {
          grid.set(cell.x, cell.y, true);
        }
      });
    } else {
      for (let x = room.x; x < room.x + (room.width || 0); x++) {
        for (let y = room.y; y < room.y + (room.height || 0); y++) {
          if (grid.isInBounds(x, y)) {
            grid.set(x, y, true);
          }
        }
      }
    }
  }
  
  // Method to register a new room template
  registerTemplate(template: RoomTemplate, weight: number = 1.0, params?: RoomTemplateParams): void {
    this.templateRegistry.registerTemplate(template, weight);
    
    if (params) {
      this.templateParams.set(template.type, params);
    }
  }
  
  // Method to calculate connection point for a corridor
  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    // Get the appropriate template for this room type
    const template = this.templateRegistry.getTemplate(room.type);
    
    if (template) {
      // Use the template's connection logic
      return template.calculateConnectionPoint(room, targetPoint);
    }
    
    // Fallback to room center if no template is found
    return room.center;
  }
  
  // Update method to generate descriptions
  generateRoomDescriptions(rooms: Room[], theme: string): void {
    // Implementation as before, or enhanced to use template-specific descriptions
    const roomDescriptors: Record<string, string[]> = {
      standard: [
        "A simple square room with stone walls.",
        "A dusty chamber with cobwebs in the corners.",
        "A room with flickering torches on the walls.",
        "A chamber with a cracked stone floor.",
        "A room with faded murals on the walls."
      ],
      cave: [
        "A natural cave with dripping stalactites.",
        "A damp cavern with glowing fungus.",
        "A rocky chamber with uneven ground.",
        "A wide cave with a small underground stream.",
        "A narrow cave passage that widens into a chamber."
      ],
      temple: [
        "A sacred chamber with ornate pillars.",
        "A room with ceremonial markings on the floor.",
        "A sanctum with religious symbols carved into the walls.",
        "A prayer chamber with stone benches.",
        "A ritual room with a raised dais."
      ],
      maze: [
        "A small chamber at an intersection of passages.",
        "A confusing room with multiple identical doorways.",
        "A chamber with directional markers carved into the floor.",
        "A small room serving as a waypoint in the labyrinth.",
        "A disorienting circular room with many exits."
      ],
      loopy: [
        "A hub room connecting several passages.",
        "A chamber that loops back on itself.",
        "A room with passages that seem to lead in circles.",
        "A crossroads chamber with worn pathways.",
        "A circular room with doorways spaced evenly around the perimeter."
      ]
    };
    
    const descriptors = roomDescriptors[theme] || roomDescriptors.standard;
    
    for (const room of rooms) {
      let specialDescription = "";
      
      if (room.type === RoomType.CIRCULAR) {
        specialDescription = " It has a perfectly circular shape.";
      } else if (room.type === RoomType.L_SHAPED) {
        specialDescription = " It has an unusual L-shaped layout.";
      } else if (room.type === RoomType.CAVE) {
        specialDescription = " It has an irregular, natural formation.";
      }
      
      const baseDescription = this.random.nextElement(descriptors);
      room.description = baseDescription + specialDescription;
    }
  }

  /**
   * Get all registered room templates
   * @returns Array of room templates
   */
  getTemplates(): RoomTemplate[] {
    return this.templateRegistry.getAllTemplates();
  }

  /**
   * Get the weight for a specific room template
   * @param type Room type to get weight for
   * @returns Weight value
   */
  getTemplateWeight(type: string): number {
    return this.templateRegistry.getWeight(type as any);
  }

  /**
   * Set the weight for a specific room template
   * @param type Room type to set weight for
   * @param weight New weight value
   */
  setTemplateWeight(type: string, weight: number): void {
    this.templateRegistry.setWeight(type as any, weight);
  }
}
```

# src/generator/templates/CircularRoomTemplate.ts

```ts
// src/generator/templates/CircularRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';
import { Geometry } from '../../core/Geometry';

export class CircularRoomTemplate implements RoomTemplate {
  readonly type = RoomType.CIRCULAR;
  readonly name = "Circular Room";
  
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
    
    const radius = random.nextInt(roomParams.minRadius!, roomParams.maxRadius!);
    const centerX = x + radius;
    const centerY = y + radius;
    
    // Generate cells within the circle
    const cells = Geometry.getFilledCirclePoints(centerX, centerY, radius);
    
    // Generate points around the perimeter for rendering
    const borderPoints: Point[] = [];
    const numSamples = Math.max(32, radius * 4);
    for (let i = 0; i < numSamples; i++) {
      const angle = (2 * Math.PI * i) / numSamples;
      const bx = centerX + radius * Math.cos(angle);
      const by = centerY + radius * Math.sin(angle);
      borderPoints.push({ x: bx, y: by });
    }
    
    const diameter = radius * 2 + 1;
    
    return {
      id,
      type: RoomType.CIRCULAR,
      x: centerX - radius,
      y: centerY - radius,
      width: diameter,
      height: diameter,
      radius,
      center: { x: centerX, y: centerY },
      cells,
      borderPoints,
      features: []
    };
  }
  
  findConnectionPoints(room: Room): Point[] {
    if (!room.cells) return [];
    
    // For circular rooms, find cells on or very near the perimeter
    return room.cells.filter(cell => {
      if (!room.center || !room.radius) return false;
      
      const distanceFromCenter = Geometry.distance(
        cell.x, cell.y, 
        room.center.x, room.center.y
      );
      
      // Cell is near the perimeter
      return Math.abs(distanceFromCenter - room.radius) < 1.5;
    });
  }
  
  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    if (!room.center || !room.radius) return room.center || targetPoint;
    
    const { center, radius } = room;
    
    // Calculate direction vector from center to target
    const dirX = targetPoint.x - center.x;
    const dirY = targetPoint.y - center.y;
    
    // Normalize the direction vector
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    const normalizedX = dirX / length;
    const normalizedY = dirY / length;
    
    // Calculate point on the perimeter
    return {
      x: Math.round(center.x + normalizedX * radius),
      y: Math.round(center.y + normalizedY * radius)
    };
  }
  
  getDefaultParams(): RoomTemplateParams {
    return {
      minRadius: 3,
      maxRadius: 6
    };
  }
}
```

# src/generator/templates/CrossRoomTemplate.ts

```ts
// src/generator/templates/CrossRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';

export class CrossRoomTemplate implements RoomTemplate {
  readonly type = 'cross-shaped' as RoomType;
  readonly name = "Cross-Shaped Room";

  generateRoom(
    id: number,
    dungeonX: number,
    dungeonY: number,
    maxWidth: number,
    maxHeight: number,
    random: Random,
    params?: RoomTemplateParams
  ): Room {
    const defaultParams = this.getDefaultParams();
    const roomParams = { ...defaultParams, ...params };

    // 1) Choose a random odd center size
    let centerSize = random.nextInt(roomParams.minCenterSize!, roomParams.maxCenterSize!);
    if (centerSize % 2 === 0) centerSize++;

    // 2) Choose a random odd arm thickness
    let armThickness = random.nextInt(roomParams.minArmThickness!, roomParams.maxArmThickness!);
    if (armThickness % 2 === 0) armThickness++;

    // 3) Determine minimal viable cross size using the minimal arm length
    const minArmLength = roomParams.minArmLength!;
    const minViableSize = centerSize + 2 * minArmLength;
    if (minViableSize > maxWidth || minViableSize > maxHeight) {
      // Fallback to a simple centered square if we can't fit even the minimal cross
      return this.fallbackRoom(id, dungeonX, dungeonY, maxWidth, maxHeight, centerSize);
    }

    // 4) Compute a safety margin (if provided)
    const margin = roomParams.safetyMargin ?? 0;

    // 5) Determine the maximum arm length allowed by the dungeon bounds and safety margins
    const maxPossibleArm = Math.floor((Math.min(maxWidth, maxHeight) - centerSize - 2 * margin) / 2);
    const finalMaxArmLength = Math.min(roomParams.maxArmLength!, maxPossibleArm);
    if (finalMaxArmLength < minArmLength) {
      return this.fallbackRoom(id, dungeonX, dungeonY, maxWidth, maxHeight, centerSize);
    }
    // Pick a random arm length within allowed limits
    let armLength = random.nextInt(minArmLength, finalMaxArmLength);

    // 6) Compute total bounding box size of the cross (square)
    const totalSize = centerSize + 2 * armLength;

    // 7) Choose a top-left coordinate so that the entire cross (with margin) fits inside the dungeon
    const availWidth = maxWidth - totalSize - 2 * margin;
    const availHeight = maxHeight - totalSize - 2 * margin;
    let startX: number, startY: number;
    if (availWidth <= 0) {
      startX = dungeonX + Math.floor((maxWidth - totalSize) / 2);
    } else {
      startX = dungeonX + margin + random.nextInt(0, availWidth);
    }
    if (availHeight <= 0) {
      startY = dungeonY + Math.floor((maxHeight - totalSize) / 2);
    } else {
      startY = dungeonY + margin + random.nextInt(0, availHeight);
    }

    // 8) Build the cross shape using a cell map to avoid duplicates
    const cellMap = new Map<string, Point>();
    const addCell = (xx: number, yy: number) => {
      // Only add cells within the dungeon bounds
      if (xx < dungeonX || xx >= dungeonX + maxWidth || yy < dungeonY || yy >= dungeonY + maxHeight) {
        return;
      }
      const key = `${xx},${yy}`;
      if (!cellMap.has(key)) {
        cellMap.set(key, { x: xx, y: yy });
      }
    };

    // 8a) Center square: positioned starting at (startX + armLength, startY + armLength)
    for (let dy = 0; dy < centerSize; dy++) {
      for (let dx = 0; dx < centerSize; dx++) {
        addCell(startX + armLength + dx, startY + armLength + dy);
      }
    }

    // 8b) Arms: calculate offset so arms are centered on the center square
    const armOffset = Math.floor((centerSize - armThickness) / 2);
    // Top arm
    for (let dy = 0; dy < armLength; dy++) {
      for (let dx = 0; dx < armThickness; dx++) {
        addCell(startX + armLength + armOffset + dx, startY + dy);
      }
    }
    // Right arm
    for (let dx = 0; dx < armLength; dx++) {
      for (let dy = 0; dy < armThickness; dy++) {
        addCell(startX + armLength + centerSize + dx, startY + armLength + armOffset + dy);
      }
    }
    // Bottom arm
    for (let dy = 0; dy < armLength; dy++) {
      for (let dx = 0; dx < armThickness; dx++) {
        addCell(startX + armLength + armOffset + dx, startY + armLength + centerSize + dy);
      }
    }
    // Left arm
    for (let dx = 0; dx < armLength; dx++) {
      for (let dy = 0; dy < armThickness; dy++) {
        addCell(startX + dx, startY + armLength + armOffset + dy);
      }
    }

    const cells = Array.from(cellMap.values());

    // 9) Calculate the center of the cross in dungeon coordinates
    const centerX = startX + armLength + Math.floor(centerSize / 2);
    const centerY = startY + armLength + Math.floor(centerSize / 2);

    // 10) Generate border points
    const borderPoints = this.generateBorderPoints(cells);

    return {
      id,
      type: this.type,
      x: startX,
      y: startY,
      width: totalSize,
      height: totalSize,
      center: { x: centerX, y: centerY },
      cells,
      borderPoints,
      features: []
    };
  }

  /**
   * Fallback room returns a simple centered square room of the given size.
   */
  private fallbackRoom(
    id: number,
    dungeonX: number,
    dungeonY: number,
    maxWidth: number,
    maxHeight: number,
    size: number
  ): Room {
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
      borderPoints: this.generateBorderPoints(cells),
      features: []
    };
  }

  // --- Border and Connection Helpers ---

  private generateBorderPoints(cells: Point[]): Point[] {
    const perimeter = this.findPerimeterCells(cells);
    return this.orderClockwise(perimeter);
  }

  private findPerimeterCells(cells: Point[]): Point[] {
    const cellMap = new Set<string>();
    for (const c of cells) {
      cellMap.add(`${c.x},${c.y}`);
    }
    const perimeter: Point[] = [];
    for (const cell of cells) {
      const neighbors = [
        { x: cell.x, y: cell.y - 1 },
        { x: cell.x + 1, y: cell.y },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x - 1, y: cell.y }
      ];
      if (neighbors.some(n => !cellMap.has(`${n.x},${n.y}`))) {
        perimeter.push(cell);
      }
    }
    return perimeter;
  }

  private orderClockwise(perimeter: Point[]): Point[] {
    if (perimeter.length === 0) return [];
    const center = {
      x: perimeter.reduce((sum, p) => sum + p.x, 0) / perimeter.length,
      y: perimeter.reduce((sum, p) => sum + p.y, 0) / perimeter.length
    };
    return perimeter.sort((a, b) => {
      const angleA = Math.atan2(a.y - center.y, a.x - center.x);
      const angleB = Math.atan2(b.y - center.y, b.x - center.x);
      return angleA - angleB;
    });
  }

  findConnectionPoints(room: Room): Point[] {
    if (!room.cells) return [];
    return this.findPerimeterCells(room.cells);
  }

  calculateConnectionPoint(room: Room, targetPoint: Point): Point {
    if (!room.cells) return room.center;
    const connectionPoints = this.findConnectionPoints(room);
    if (connectionPoints.length === 0) return room.center;
    let closest = connectionPoints[0];
    let minDist = Infinity;
    for (const cp of connectionPoints) {
      const dist = Math.hypot(cp.x - targetPoint.x, cp.y - targetPoint.y);
      if (dist < minDist) {
        minDist = dist;
        closest = cp;
      }
    }
    return closest;
  }

  getDefaultParams(): RoomTemplateParams {
    return {
      minCenterSize: 5,
      maxCenterSize: 9,
      minArmThickness: 3,
      maxArmThickness: 5,
      minArmLength: 3,
      maxArmLength: 8,
      safetyMargin: 2
    };
  }
}

```

# src/generator/templates/LShapedRoomTemplate.ts

```ts
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
```

# src/generator/templates/NorthStarRoomTemplate.ts

```ts
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

```

# src/generator/templates/OctagonRoomTemplate.ts

```ts
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

```

# src/generator/templates/RectangularRoomTemplate.ts

```ts
// src/generator/templates/RectangularRoomTemplate.ts

import { RoomTemplate, RoomTemplateParams } from './RoomTemplate';
import { Room, RoomType, Point } from '../../core/Types';
import { Random } from '../../core/Random';
import { Geometry } from '../../core/Geometry';

export class RectangularRoomTemplate implements RoomTemplate {
  readonly type = RoomType.RECTANGULAR;
  readonly name = "Rectangular Room";
  
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
    
    const width = random.nextInt(roomParams.minWidth!, roomParams.maxWidth!);
    const height = random.nextInt(roomParams.minHeight!, roomParams.maxHeight!);
    
    const cells: Point[] = [];
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        cells.push({ x: x + dx, y: y + dy });
      }
    }
    
    const center = {
      x: x + Math.floor(width / 2),
      y: y + Math.floor(height / 2)
    };
    
    return {
      id,
      type: RoomType.RECTANGULAR,
      x,
      y,
      width,
      height,
      center,
      cells,
      features: []
    };
  }
  
  findConnectionPoints(room: Room): Point[] {
    if (!room.cells) return [];
    
    // Find all cells on the perimeter
    return room.cells.filter(cell => {
      // Check if any adjacent cell is not part of the room
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
    if (!room.width || !room.height) return room.center;
    
    const { x, y, width, height, center } = room;
    
    // Find closest wall to the target point
    const distToLeft = Math.abs(targetPoint.x - x);
    const distToRight = Math.abs(targetPoint.x - (x + width));
    const distToTop = Math.abs(targetPoint.y - y);
    const distToBottom = Math.abs(targetPoint.y - (y + height));
    
    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
    
    let connectionPoint: Point;
    
    if (minDist === distToLeft) {
      // Connect to left wall
      connectionPoint = { x, y: Math.min(y + height - 1, Math.max(y, targetPoint.y)) };
    } else if (minDist === distToRight) {
      // Connect to right wall
      connectionPoint = { x: x + width - 1, y: Math.min(y + height - 1, Math.max(y, targetPoint.y)) };
    } else if (minDist === distToTop) {
      // Connect to top wall
      connectionPoint = { x: Math.min(x + width - 1, Math.max(x, targetPoint.x)), y };
    } else {
      // Connect to bottom wall
      connectionPoint = { x: Math.min(x + width - 1, Math.max(x, targetPoint.x)), y: y + height - 1 };
    }
    
    return connectionPoint;
  }
  
  getDefaultParams(): RoomTemplateParams {
    return {
      minWidth: 3,
      maxWidth: 8,
      minHeight: 3,
      maxHeight: 8
    };
  }
}
```

# src/generator/templates/RoomTemplate.ts

```ts
// src/generator/templates/RoomTemplate.ts

import { Point, Room, RoomType } from '../../core/Types';
import { Random } from '../../core/Random';

export interface RoomTemplateParams {
  minSize?: number;
  maxSize?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  minRadius?: number;
  maxRadius?: number;
  [key: string]: any; // Allow for custom parameters
}

export interface RoomTemplate {
  // Unique identifier for this template
  readonly type: RoomType;
  
  // Display name for debugging/UI
  readonly name: string;
  
  // Generate a room from this template
  generateRoom(
    id: number,
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    random: Random,
    params?: RoomTemplateParams
  ): Room;
  
  // Find valid connection points for corridors
  findConnectionPoints(room: Room): Point[];
  
  // Calculate a connection point for a specific target point
  calculateConnectionPoint(room: Room, targetPoint: Point): Point;
  
  // Get default parameters for this template
  getDefaultParams(): RoomTemplateParams;
}
```

# src/generator/templates/RoomTemplateRegistry.ts

```ts
// src/generator/templates/RoomTemplateRegistry.ts

import { RoomTemplate } from './RoomTemplate';
import { RoomType } from '../../core/Types';
import { Random } from '../../core/Random';

export class RoomTemplateRegistry {
  private templates: Map<RoomType, RoomTemplate> = new Map();
  private weights: Map<RoomType, number> = new Map();
  private random: Random;
  
  constructor(seed?: string | number) {
    this.random = new Random(seed);
  }
  
  // Register a new room template with a weight
  registerTemplate(template: RoomTemplate, weight: number = 1.0): void {
    this.templates.set(template.type, template);
    this.weights.set(template.type, weight);
  }
  
  // Remove a template
  unregisterTemplate(type: RoomType): boolean {
    if (this.templates.has(type)) {
      this.templates.delete(type);
      this.weights.delete(type);
      return true;
    }
    return false;
  }
  
  // Get a template by type
  getTemplate(type: RoomType): RoomTemplate | undefined {
    return this.templates.get(type);
  }
  
  // Get all registered templates
  getAllTemplates(): RoomTemplate[] {
    return Array.from(this.templates.values());
  }
  
  // Select a random template based on weights
  selectRandomTemplate(): RoomTemplate {
    const totalWeight = Array.from(this.weights.values())
      .reduce((sum, weight) => sum + weight, 0);
    
    let roll = this.random.nextFloat(0, totalWeight);
    
    for (const [type, weight] of this.weights.entries()) {
      roll -= weight;
      if (roll <= 0) {
        return this.templates.get(type)!;
      }
    }
    
    // Fallback to first template
    const firstTemplate = this.templates.values().next().value;
    if (!firstTemplate) {
    throw new Error("No room templates registered");
    }
    return firstTemplate;
}
  
  // Set a new weight for a template
  setWeight(type: RoomType, weight: number): void {
    if (this.templates.has(type)) {
      this.weights.set(type, weight);
    }
  }
  
  // Get current weight for a template
  getWeight(type: RoomType): number {
    return this.weights.get(type) || 0;
  }
}
```

# src/generator/templates/StarRoomTemplate.ts

```ts
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

```

# src/index.ts

```ts
import { DungeonGenerator } from './generator/DungeonGenerator';
import { ControlPanel } from './ui/ControlPanel';
import { LayerPreviewPanel } from './ui/LayerPreview';
import { CanvasRenderer } from './renderer/CanvasRenderer';
import { Dungeon } from './core/Types';

class DungeonApp {
    private container: HTMLElement;
    private controlPanel: ControlPanel;
    private layerPreview: LayerPreviewPanel;
    private mainCanvas: HTMLCanvasElement;
    private dungeonGenerator?: DungeonGenerator;
    private renderer?: CanvasRenderer;
    private currentDungeon?: Dungeon;
    
    constructor(container: HTMLElement) {
        this.container = container;
        this.mainCanvas = document.createElement('canvas');
        
        const appContainer = document.createElement('div');
        appContainer.className = 'dungeon-app';
        this.container.appendChild(appContainer);
        
        const controlSidebar = document.createElement('div');
        controlSidebar.className = 'control-sidebar';
        
        const mainContent = document.createElement('div');
        mainContent.className = 'main-content';
        
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        canvasContainer.appendChild(this.mainCanvas);
        mainContent.appendChild(canvasContainer);
        
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export as PNG';
        exportButton.addEventListener('click', () => this.exportDungeon());
        
        const exportContainer = document.createElement('div');
        exportContainer.className = 'export-container';
        exportContainer.appendChild(exportButton);
        mainContent.appendChild(exportContainer);
        
        appContainer.appendChild(controlSidebar);
        appContainer.appendChild(mainContent);
        
        this.controlPanel = new ControlPanel(
            controlSidebar, 
            this.generateDungeon.bind(this)
        );
        
        const layerPreviewContainer = document.createElement('div');
        layerPreviewContainer.className = 'layer-preview-container collapsed';
        
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Layer Preview';
        toggleButton.addEventListener('click', () => {
            layerPreviewContainer.classList.toggle('collapsed');
        });
        
        controlSidebar.appendChild(toggleButton);
        
        this.layerPreview = new LayerPreviewPanel(
            layerPreviewContainer, 
            400, 300
        );
        
        appContainer.appendChild(layerPreviewContainer);
        
        this.generateDungeon();
    }
    
    generateDungeon(): void {
        const params = this.controlPanel.getParams();
        
        this.dungeonGenerator = new DungeonGenerator(params);
        
        const dungeon = this.dungeonGenerator.generate();
        this.currentDungeon = dungeon;
        
        this.renderer = new CanvasRenderer(
            this.mainCanvas, 
            dungeon, 
            {
                cellSize: 24,
                padding: 10,
                layerOptions: this.layerPreview.getLayerOptions()
            }
        );
        
        this.renderer.render();
    }
    
    exportDungeon(): void {
        if (!this.renderer) {
            return;
        }
        
        const dataUrl = this.renderer.exportToPNG();
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `dungeon-${Date.now()}.png`;
        link.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('dungeon-app-container');
    
    if (!appContainer) {
        console.error('Could not find app container');
        return;
    }
    
    const app = new DungeonApp(appContainer);
});
```

# src/renderer/CanvasRenderer.ts

```ts
import { Dungeon, CellType, Room, Corridor, Door, Feature, Point, LayerOptions } from '../core/Types';
import { LayerManager } from './LayerManager';
import { Geometry } from '../core/Geometry';

export interface RendererOptions {
  cellSize: number;
  padding: number;
  backgroundColor: string;
  layerOptions: Record<string, LayerOptions>;
  showGrid: boolean;
  showRoomLabels: boolean;
  wallColor: string;
  wallThickness: number;
  floorColor: string;
  corridorColor: string;
  roomLabelsFont: string;
}

export const DEFAULT_RENDERER_OPTIONS: RendererOptions = {
  cellSize: 24,
  padding: 10,
  backgroundColor: 'white',
  layerOptions: {
    grid: {
      opacity: 0.2,
      density: 1.0,
      scale: 1.0,
      color: '#000000',
      visible: true
    },
    rocks: {
      opacity: 0.3,
      density: 0.7,
      scale: 1.0,
      color: '#000000',
      visible: true
    },
    cracks: {
      opacity: 0.25,
      density: 0.5,
      scale: 1.0,
      color: '#000000',
      visible: true
    },
    dots: {
      opacity: 0.2,
      density: 0.3,
      scale: 1.0,
      color: '#000000',
      visible: true
    }
  },
  showGrid: true,
  showRoomLabels: true,
  wallColor: '#333333',
  wallThickness: 2,
  floorColor: '#f0f0f0',
  corridorColor: '#e0e0e0',
  roomLabelsFont: '12px Arial'
};

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dungeon: Dungeon;
  private layerManager: LayerManager;
  private options: RendererOptions;
  
  constructor(
    canvas: HTMLCanvasElement, 
    dungeon: Dungeon, 
    options: Partial<RendererOptions> = {}
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.dungeon = dungeon;
    this.options = { ...DEFAULT_RENDERER_OPTIONS, ...options };
    this.canvas.width = dungeon.width * this.options.cellSize + this.options.padding * 2;
    this.canvas.height = dungeon.height * this.options.cellSize + this.options.padding * 2;
    this.layerManager = new LayerManager(
      this.canvas.width, 
      this.canvas.height, 
      dungeon.seed
    );
    this.layerManager.generateAllLayers(this.options.layerOptions);
  }
  
  render(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const floorMask = this.layerManager.createFloorMask(
      this.dungeon, 
      this.options.cellSize, 
      this.options.padding
    );
    
    const wallMask = this.layerManager.createWallMask(
      this.dungeon,
      this.options.cellSize,
      this.options.padding
    );
    
    this.renderDungeonBase();
    this.renderWalls();
    this.renderDoors();
    this.renderFeatures();
    if (this.options.showGrid) {
      this.renderGrid();
    }
    if (this.options.showRoomLabels) {
      this.renderRoomLabels();
    }
  }
  
  private renderDungeonBase(): void {
    this.ctx.fillStyle = this.options.floorColor;
    for (let x = 0; x < this.dungeon.width; x++) {
      for (let y = 0; y < this.dungeon.height; y++) {
        const cellType = this.dungeon.grid[x][y];
        if (cellType === CellType.FLOOR) {
          const px = this.options.padding + x * this.options.cellSize;
          const py = this.options.padding + y * this.options.cellSize;
          this.ctx.fillRect(px, py, this.options.cellSize, this.options.cellSize);
        }
      }
    }
   
    this.ctx.fillStyle = this.options.corridorColor;
    
    for (let x = 0; x < this.dungeon.width; x++) {
      for (let y = 0; y < this.dungeon.height; y++) {
        const cellType = this.dungeon.grid[x][y];
        
        if (cellType === CellType.CORRIDOR) {
          const px = this.options.padding + x * this.options.cellSize;
          const py = this.options.padding + y * this.options.cellSize;
          this.ctx.fillRect(px, py, this.options.cellSize, this.options.cellSize);
        }
      }
    }
  }

  private renderTexturedFloor(floorMask: HTMLCanvasElement): void {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    for (const layerType of ['grid', 'rocks', 'cracks', 'dots']) {
      const layerOptions = this.options.layerOptions[layerType];
      if (!layerOptions || !layerOptions.visible) continue;
      const layer = this.layerManager.getLayer(layerType);
      if (layer) {
        tempCtx.drawImage(layer, 0, 0);
      }
    }
    this.layerManager.applyMask(tempCtx, floorMask);
    this.ctx.drawImage(tempCanvas, 0, 0);
  }
  
  // Update the renderWalls method to handle custom room shapes
  private renderWalls(): void {
    const { cellSize, padding, wallColor, wallThickness } = this.options;
    
    this.ctx.strokeStyle = wallColor;
    this.ctx.lineWidth = wallThickness;
    this.ctx.lineCap = 'square';
    
    // Process each room
    for (const room of this.dungeon.rooms) {
      // Check if room has borderPoints (for circular, star, etc. rooms)
      if (room.borderPoints && room.borderPoints.length > 0) {
        this.renderCustomRoomWalls(room);
      } else {
        this.renderStandardRoomWalls(room);
      }
    }
    
    // Also render corridor walls
    this.renderCorridorWalls();
  }

  private renderDoors(): void {
    const featureColors: Record<number, string> = {
      [CellType.PILLAR]: '#999999',
      [CellType.STATUE]: '#CCCCCC',
      [CellType.FOUNTAIN]: '#4444FF',
      [CellType.ALTAR]: '#AA8866',
      [CellType.TRAP]: '#FF4444',
      [CellType.TREASURE]: '#FFFF00',
      [CellType.MONSTER]: '#FF6600',
      [CellType.WATER]: '#6666FF',
      [CellType.ENTRANCE]: '#00FF00',
      [CellType.EXIT]: '#FF00FF'
    };

    if (!this.dungeon.doors) {
      return;
    }

    for (const door of this.dungeon.doors) {
      const x = door.x;
      const y = door.y;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      if (door.type === CellType.DOOR) {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(px + size * 0.2, py + size * 0.2, size * 0.6, size * 0.6);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px + size * 0.2, py + size * 0.2, size * 0.6, size * 0.6);
      } else {
        this.ctx.fillStyle = '#555555'; // Dark gray (looks like wall)
        this.ctx.fillRect(px + size * 0.15, py + size * 0.15, size * 0.7, size * 0.7);
        this.ctx.strokeStyle = '#777777';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(px + size * 0.3, py + size * 0.3);
        this.ctx.lineTo(px + size * 0.7, py + size * 0.7);
        this.ctx.moveTo(px + size * 0.3, py + size * 0.7);
        this.ctx.lineTo(px + size * 0.7, py + size * 0.3);
        this.ctx.stroke();
      }
    }
  }
  
  private renderFeatures(): void {
    const featureColors: Record<number, string> = {
      [CellType.PILLAR]: '#999999',
      [CellType.STATUE]: '#CCCCCC',
      [CellType.FOUNTAIN]: '#4444FF',
      [CellType.ALTAR]: '#AA8866',
      [CellType.TRAP]: '#FF4444',
      [CellType.TREASURE]: '#FFFF00',
      [CellType.MONSTER]: '#FF6600',
      [CellType.WATER]: '#6666FF',
      [CellType.ENTRANCE]: '#00FF00',
      [CellType.EXIT]: '#FF00FF'
    };
    
    if (!this.dungeon.features) {
      return;
    }

    for (const feature of this.dungeon.features) {
      const x = feature.x;
      const y = feature.y;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      const halfSize = size / 2;
      const color = featureColors[feature.type] || '#FF00FF';
      this.ctx.fillStyle = color;
      
      switch (feature.type) {
        case CellType.PILLAR:
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case CellType.STATUE:
          this.ctx.beginPath();
          this.ctx.moveTo(px + halfSize, py + size * 0.2);
          this.ctx.lineTo(px + size * 0.2, py + size * 0.8);
          this.ctx.lineTo(px + size * 0.8, py + size * 0.8);
          this.ctx.closePath();
          this.ctx.fill();
          break;
          
        case CellType.FOUNTAIN:
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = '#8888FF';
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.4, 0, Math.PI * 2);
          this.ctx.stroke();
          break;
          
        case CellType.ALTAR:
          this.ctx.fillRect(px + size * 0.2, py + size * 0.3, size * 0.6, size * 0.4);
          break;
          
        case CellType.TRAP:
          this.ctx.lineWidth = 2;
          this.ctx.strokeStyle = color;
          this.ctx.beginPath();
          this.ctx.moveTo(px + size * 0.2, py + size * 0.2);
          this.ctx.lineTo(px + size * 0.8, py + size * 0.8);
          this.ctx.moveTo(px + size * 0.8, py + size * 0.2);
          this.ctx.lineTo(px + size * 0.2, py + size * 0.8);
          this.ctx.stroke();
          break;
          
        case CellType.TREASURE:
          this.ctx.fillRect(px + size * 0.3, py + size * 0.3, size * 0.4, size * 0.4);
          this.ctx.strokeStyle = '#FF9900';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(px + size * 0.25, py + size * 0.25, size * 0.5, size * 0.5);
          break;
          
        case CellType.MONSTER:
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.fillStyle = '#000000';
          this.ctx.beginPath();
          this.ctx.arc(px + size * 0.4, py + size * 0.4, size * 0.08, 0, Math.PI * 2);
          this.ctx.arc(px + size * 0.6, py + size * 0.4, size * 0.08, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case CellType.WATER:
          this.ctx.fillRect(px + size * 0.1, py + size * 0.1, size * 0.8, size * 0.8);
          this.ctx.strokeStyle = '#9999FF';
          this.ctx.beginPath();
          this.ctx.moveTo(px + size * 0.2, py + size * 0.5);
          this.ctx.bezierCurveTo(
            px + size * 0.3, py + size * 0.4,
            px + size * 0.5, py + size * 0.6,
            px + size * 0.8, py + size * 0.5
          );
          this.ctx.stroke();
          break;
          
        default:
          this.ctx.beginPath();
          this.ctx.arc(px + halfSize, py + halfSize, size * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          break;
      }
    }

    if (this.dungeon.entrance) {
      const { x, y } = this.dungeon.entrance;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      this.ctx.fillStyle = featureColors[CellType.ENTRANCE];
      this.ctx.beginPath();
      this.ctx.moveTo(px + size * 0.5, py + size * 0.2);
      this.ctx.lineTo(px + size * 0.2, py + size * 0.8);
      this.ctx.lineTo(px + size * 0.8, py + size * 0.8);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    if (this.dungeon.exit) {
      const { x, y } = this.dungeon.exit;
      const px = this.options.padding + x * this.options.cellSize;
      const py = this.options.padding + y * this.options.cellSize;
      const size = this.options.cellSize;
      this.ctx.fillStyle = featureColors[CellType.EXIT];
      this.ctx.beginPath();
      this.ctx.moveTo(px + size * 0.5, py + size * 0.8);
      this.ctx.lineTo(px + size * 0.2, py + size * 0.2);
      this.ctx.lineTo(px + size * 0.8, py + size * 0.2);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  private renderGrid(): void {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; 
    this.ctx.lineWidth = 0.5;
    const startX = this.options.padding;
    const startY = this.options.padding;
    const endX = this.options.padding + this.dungeon.width * this.options.cellSize;
    const endY = this.options.padding + this.dungeon.height * this.options.cellSize;
    for (let x = 0; x <= this.dungeon.width; x++) {
      const px = this.options.padding + x * this.options.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(px, startY);
      this.ctx.lineTo(px, endY);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.dungeon.height; y++) {
      const py = this.options.padding + y * this.options.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, py);
      this.ctx.lineTo(endX, py);
      this.ctx.stroke();
    }
  }

  private renderRoomLabels(): void {
    this.ctx.font = this.options.roomLabelsFont;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    for (let i = 0; i < this.dungeon.rooms.length; i++) {
      const room = this.dungeon.rooms[i];
      const label = (i + 1).toString();
      
      const x = this.options.padding + room.center.x * this.options.cellSize;
      const y = this.options.padding + room.center.y * this.options.cellSize;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.options.cellSize * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillText(label, x, y);
    }
  }
  exportToPNG(): string {
    return this.canvas.toDataURL('image/png');
  }

  // Add this method to your CanvasRenderer class

private renderRooms(): void {
  // Render each room based on its type
  for (const room of this.dungeon.rooms) {
    this.renderRoom(room);
  }
}

private renderRoom(room: Room): void {
  const { cellSize, padding, floorColor } = this.options;
  
  // Render the room floor
  this.ctx.fillStyle = floorColor;
  
  if (room.cells) {
    // For rooms with explicit cell lists, render each cell
    for (const cell of room.cells) {
      const px = padding + cell.x * cellSize;
      const py = padding + cell.y * cellSize;
      this.ctx.fillRect(px, py, cellSize, cellSize);
    }
  } else if (room.width && room.height) {
    // For rectangular rooms
    const px = padding + room.x * cellSize;
    const py = padding + room.y * cellSize;
    this.ctx.fillRect(px, py, room.width * cellSize, room.height * cellSize);
  }
}

private renderCustomRoomWalls(room: Room): void {
  const { cellSize, padding, wallColor, wallThickness } = this.options;
  
  this.ctx.strokeStyle = wallColor;
  this.ctx.lineWidth = wallThickness;
  this.ctx.beginPath();
  
  // Draw connected line through all border points
  if (!room.borderPoints || room.borderPoints.length === 0) return;
  
  const firstPoint = room.borderPoints[0];
  const startX = padding + firstPoint.x * cellSize;
  const startY = padding + firstPoint.y * cellSize;
  this.ctx.moveTo(startX, startY);
  
  for (let i = 1; i < room.borderPoints.length; i++) {
    const point = room.borderPoints[i];
    const x = padding + point.x * cellSize;
    const y = padding + point.y * cellSize;
    this.ctx.lineTo(x, y);
  }
  
  // Close the path back to the first point
  this.ctx.closePath();
  this.ctx.stroke();
}

private renderStandardRoomWalls(room: Room): void {
  const { cellSize, padding, wallColor, wallThickness } = this.options;
  
  this.ctx.strokeStyle = wallColor;
  this.ctx.lineWidth = wallThickness;
  
  if (room.cells) {
    // For rooms with explicit cell lists, find the perimeter
    this.renderCellBasedRoomWalls(room);
  } else if (room.width && room.height) {
    // For rectangular rooms
    const px = padding + room.x * cellSize;
    const py = padding + room.y * cellSize;
    const width = room.width * cellSize;
    const height = room.height * cellSize;
    
    this.ctx.strokeRect(px, py, width, height);
  }
}

private renderCellBasedRoomWalls(room: Room): void {
  if (!room.cells) return;
  
  const { cellSize, padding } = this.options;
  const cellMap = new Map<string, Point>();
  
  // Create a map of all cells in the room
  for (const cell of room.cells) {
    cellMap.set(`${cell.x},${cell.y}`, cell);
  }
  
  // Check each direction for each cell
  for (const cell of room.cells) {
    const directions = [
      { dx: 0, dy: -1, edge: 'top' },
      { dx: 1, dy: 0, edge: 'right' },
      { dx: 0, dy: 1, edge: 'bottom' },
      { dx: -1, dy: 0, edge: 'left' }
    ];
    
    for (const { dx, dy, edge } of directions) {
      const nx = cell.x + dx;
      const ny = cell.y + dy;
      const neighborKey = `${nx},${ny}`;
      
      // If neighbor cell is not part of the room, draw a wall
      if (!cellMap.has(neighborKey)) {
        const px = padding + cell.x * cellSize;
        const py = padding + cell.y * cellSize;
        
        this.ctx.beginPath();
        
        if (edge === 'top') {
          this.ctx.moveTo(px, py);
          this.ctx.lineTo(px + cellSize, py);
        } else if (edge === 'right') {
          this.ctx.moveTo(px + cellSize, py);
          this.ctx.lineTo(px + cellSize, py + cellSize);
        } else if (edge === 'bottom') {
          this.ctx.moveTo(px, py + cellSize);
          this.ctx.lineTo(px + cellSize, py + cellSize);
        } else if (edge === 'left') {
          this.ctx.moveTo(px, py);
          this.ctx.lineTo(px, py + cellSize);
        }
        
        this.ctx.stroke();
      }
    }
  }
}

private renderCorridorWalls(): void {
  // Existing implementation...
}

}
```

# src/renderer/LayerManager.ts

```ts
import { Random } from '../core/Random';
import { Dungeon, LayerOptions, CellType } from '../core/Types';
import { TextureGenerator, TextureGeneratorFactory } from './TextureGenerator';

export class LayerManager {
  private canvasWidth: number;
  private canvasHeight: number;
  private textureGenerators: Map<string, TextureGenerator>;
  private textureLayers: Map<string, HTMLCanvasElement>;
  private random: Random;
  
  constructor(width: number, height: number, seed?: string | number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.random = new Random(seed);
    this.textureGenerators = new Map();
    this.textureLayers = new Map();
    
    this.initializeGenerators();
  }
  
  private initializeGenerators() {
    const generators = ['grid', 'rocks', 'cracks', 'dots'];
    generators.forEach(type => 
      this.textureGenerators.set(type, TextureGeneratorFactory.createGenerator(type))
    );
  }
  
  generateLayer(layerType: string, options: LayerOptions): HTMLCanvasElement {
    const generator = this.textureGenerators.get(layerType);
    if (!generator) {
      throw new Error(`Unknown layer type: ${layerType}`);
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    generator.generate(ctx, this.canvasWidth, this.canvasHeight, this.random, options);
    
    this.textureLayers.set(layerType, canvas);
    return canvas;
  }
  
  getLayer(layerType: string): HTMLCanvasElement | undefined {
    return this.textureLayers.get(layerType);
  }
  
  generateAllLayers(options: Record<string, LayerOptions>) {
    Object.entries(options)
      .filter(([, layerOptions]) => layerOptions.visible)
      .forEach(([layerType, layerOptions]) => 
        this.generateLayer(layerType, layerOptions)
      );
  }
  
  createFloorMask(dungeon: Dungeon, cellSize: number, padding: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const walkableCellTypes = [
      CellType.FLOOR, 
      CellType.CORRIDOR,
      CellType.DOOR,
      CellType.SECRET_DOOR,
      CellType.ENTRANCE,
      CellType.EXIT,
      CellType.WATER,
      CellType.PILLAR,
      CellType.STATUE,
      CellType.ALTAR,
      CellType.FOUNTAIN,
      CellType.TRAP,
      CellType.TREASURE,
      CellType.MONSTER
    ];
    
    ctx.fillStyle = 'white';
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (walkableCellTypes.includes(dungeon.grid[x][y])) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      }
    }
    
    return canvas;
  }
  
  applyMask(ctx: CanvasRenderingContext2D, mask: HTMLCanvasElement) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(mask, 0, 0);
    ctx.restore();
  }
  
  createWallMask(dungeon: Dungeon, cellSize: number, padding: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (dungeon.grid[x][y] === CellType.WALL) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      }
    }
    
    return canvas;
  }

  createWallLayer(dungeon: Dungeon, cellSize: number, padding: number, color: string, thickness: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'square';
    
    const isWall = (x: number, y: number): boolean => 
      x >= 0 && y >= 0 && x < dungeon.width && y < dungeon.height && 
      dungeon.grid[x][y] === CellType.WALL;
    
    const isEmpty = (x: number, y: number): boolean => 
      x < 0 || y < 0 || x >= dungeon.width || y >= dungeon.height || 
      dungeon.grid[x][y] === CellType.EMPTY;
    
    const drawEdge = (x: number, y: number, px: number, py: number, edge: 'top' | 'bottom' | 'left' | 'right') => {
      const edgeChecks = {
        'top': () => !isWall(x, y - 1) && !isEmpty(x, y - 1),
        'bottom': () => !isWall(x, y + 1) && !isEmpty(x, y + 1),
        'left': () => !isWall(x - 1, y) && !isEmpty(x - 1, y),
        'right': () => !isWall(x + 1, y) && !isEmpty(x + 1, y)
      };
      
      const edgeDrawings = {
        'top': () => {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + cellSize, py);
          ctx.stroke();
        },
        'bottom': () => {
          ctx.beginPath();
          ctx.moveTo(px, py + cellSize);
          ctx.lineTo(px + cellSize, py + cellSize);
          ctx.stroke();
        },
        'left': () => {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + cellSize);
          ctx.stroke();
        },
        'right': () => {
          ctx.beginPath();
          ctx.moveTo(px + cellSize, py);
          ctx.lineTo(px + cellSize, py + cellSize);
          ctx.stroke();
        }
      };
      
      if (edgeChecks[edge]()) {
        edgeDrawings[edge]();
      }
    };
    
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (dungeon.grid[x][y] === CellType.WALL) {
          const px = padding + x * cellSize;
          const py = padding + y * cellSize;
          
          drawEdge(x, y, px, py, 'top');
          drawEdge(x, y, px, py, 'bottom');
          drawEdge(x, y, px, py, 'left');
          drawEdge(x, y, px, py, 'right');
        }
      }
    }
    
    return canvas;
  }
}
```

# src/renderer/TextureGenerator.ts

```ts
import { Random } from '../core/Random';
import { LayerOptions } from '../core/Types';

export interface TextureGenerator {
  generate(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    random: Random,
    options: LayerOptions
  ): void;
}

export class GridTextureGenerator implements TextureGenerator {
  generate(ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, options: LayerOptions) {
    const { scale, opacity } = options;
    
    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.lineWidth = 0.5;
    
    const gridSize = 20 * scale;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
}

export class RocksTextureGenerator implements TextureGenerator {
  generate(ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, options: LayerOptions) {
    const { density, opacity, scale } = options;
    
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    
    const rockCount = Math.floor((width * height * density) / 3000);
    
    for (let i = 0; i < rockCount; i++) {
      const x = random.next() * width;
      const y = random.next() * height;
      const size = (2 + random.next() * 5) * scale;
      
      this.drawRock(ctx, x, y, size, random);
    }
  }
  
  private drawRock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, random: Random) {
    ctx.beginPath();
    
    const points = 5 + Math.floor(random.next() * 3);
    const angleStep = (Math.PI * 2) / points;
    
    for (let i = 0; i < points; i++) {
      const angle = i * angleStep;
      const radius = size * (0.7 + random.next() * 0.6);
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    
    ctx.closePath();
    ctx.fill();
  }
}

export class CracksTextureGenerator implements TextureGenerator {
  generate(ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, options: LayerOptions) {
    const { density, opacity, scale } = options;
    
    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.lineWidth = 0.8 * scale;
    
    const crackCount = Math.floor((width * height * density) / 8000);
    
    for (let i = 0; i < crackCount; i++) {
      const x = random.next() * width;
      const y = random.next() * height;
      const length = (10 + random.next() * 30) * scale;
      
      this.drawCrack(ctx, x, y, length, random);
    }
  }
  
  private drawCrack(ctx: CanvasRenderingContext2D, startX: number, startY: number, length: number, random: Random) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    let x = startX;
    let y = startY;
    let angle = random.next() * Math.PI * 2;
    
    const segments = 3 + Math.floor(random.next() * 5);
    const segLength = length / segments;
    
    for (let i = 0; i < segments; i++) {
      angle += (random.next() - 0.5) * 0.8;
      
      x += Math.cos(angle) * segLength;
      y += Math.sin(angle) * segLength;
      
      ctx.lineTo(x, y);
    }
    
    ctx.stroke();
  }
}

export class DotsTextureGenerator implements TextureGenerator {
  generate(ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, options: LayerOptions) {
    const { density, opacity, scale } = options;
    
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    
    const dotCount = Math.floor((width * height * density) / 1000);
    
    for (let i = 0; i < dotCount; i++) {
      const x = random.next() * width;
      const y = random.next() * height;
      const size = (0.5 + random.next() * 2) * scale;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export class TextureGeneratorFactory {
  static createGenerator(type: string): TextureGenerator {
    const generators: Record<string, () => TextureGenerator> = {
      grid: () => new GridTextureGenerator(),
      rocks: () => new RocksTextureGenerator(),
      cracks: () => new CracksTextureGenerator(),
      dots: () => new DotsTextureGenerator()
    };
    
    const generator = generators[type.toLowerCase()];
    if (!generator) {
      throw new Error(`Unknown texture generator type: ${type}`);
    }
    
    return generator();
  }
}
```

# src/ui/ControlPanel.ts

```ts
import { DungeonParams } from '../core/Types';
import { DungeonParamsBuilder } from '../generator/DungeonParams';

export class ControlPanel {
  private container: HTMLElement;
  private onGenerateCallback: () => void;
  private controls: Map<string, HTMLInputElement | HTMLSelectElement> = new Map();
  private presets: Map<string, DungeonParams> = new Map();
  
  constructor(container: HTMLElement, onGenerate: () => void) {
    this.container = container;
    this.onGenerateCallback = onGenerate;
    
    this.presets.set('default', DungeonParamsBuilder.createDefault());
    this.presets.set('small', DungeonParamsBuilder.createSmall());
    this.presets.set('large', DungeonParamsBuilder.createLarge());
    this.presets.set('cave', DungeonParamsBuilder.createCave());
    this.presets.set('maze', DungeonParamsBuilder.createMaze());
    this.presets.set('loopy', DungeonParamsBuilder.createLoopy());
    this.presets.set('temple', DungeonParamsBuilder.createTemple());
    
    this.initUI();
  }
  
  private initUI(): void {
    this.createPresetSelector();
    
    this.createNumberInput('width', 'Width:', 10, 100, 1, 50);
    this.createNumberInput('height', 'Height:', 10, 100, 1, 50);
    this.createNumberInput('numRooms', 'Rooms:', 1, 50, 1, 15);
    
    this.createSlider('roomDensity', 'Room Density:', 0, 1, 0.05, 0.5);
    this.createSlider('roomSizeVariation', 'Size Variation:', 0, 1, 0.05, 0.5);
    this.createSlider('specialRoomChance', 'Special Rooms:', 0, 1, 0.05, 0.2);
    this.createSlider('featureDensity', 'Feature Density:', 0, 1, 0.05, 0.5);
    
    this.createNumberInput('corridorWidth', 'Corridor Width:', 1, 3, 1, 1);
    
    this.createCheckbox('createLoops', 'Create Loops', true);
    
    this.createSlider('loopChance', 'Loop Chance:', 0, 1, 0.05, 0.3);
    
    this.createDropdown('hallwayStyle', 'Hallway Style:', [
      { value: 'straight', label: 'Straight' },
      { value: 'bendy', label: 'Bendy' },
      { value: 'organic', label: 'Organic' }
    ], 'bendy');
    
    this.createSlider('doorFrequency', 'Door Frequency:', 0, 1, 0.05, 0.8);
    this.createSlider('secretDoorChance', 'Secret Door Chance:', 0, 1, 0.05, 0.1);
    
    this.createDropdown('theme', 'Theme:', [
      { value: 'standard', label: 'Standard' },
      { value: 'cave', label: 'Cave' },
      { value: 'temple', label: 'Temple' },
      { value: 'maze', label: 'Maze' },
      { value: 'loopy', label: 'Loopy' }
    ], 'standard');
    
    this.createTextInput('seed', 'Seed:', '');
    
    this.createGenerateButton();
    
    this.setupEventHandlers();
  }
  
  private createPresetSelector(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Preset:';
    
    const select = document.createElement('select');
    select.id = 'preset-selector';
    
    const presets = [
      { value: 'default', label: 'Default' },
      { value: 'small', label: 'Small Dungeon' },
      { value: 'large', label: 'Large Dungeon' },
      { value: 'cave', label: 'Cave System' },
      { value: 'maze', label: 'Maze' },
      { value: 'loopy', label: 'Loopy Dungeon' },
      { value: 'temple', label: 'Temple' },
      { value: 'custom', label: 'Custom' }
    ];
    
    for (const preset of presets) {
      const option = document.createElement('option');
      option.value = preset.value;
      option.textContent = preset.label;
      select.appendChild(option);
    }
    
    select.addEventListener('change', () => {
      const presetName = select.value;
      
      if (presetName !== 'custom') {
        const presetParams = this.presets.get(presetName);
        if (presetParams) {
          this.setParams(presetParams);
        }
      }
    });
    
    container.appendChild(label);
    container.appendChild(select);
    this.container.appendChild(container);
  }
  
  private createNumberInput(
    id: string, 
    label: string, 
    min: number, 
    max: number, 
    step: number, 
    defaultValue: number
  ): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = id;
    input.min = min.toString();
    input.max = max.toString();
    input.step = step.toString();
    input.value = defaultValue.toString();
    
    container.appendChild(labelElement);
    container.appendChild(input);
    this.container.appendChild(container);
    
    this.controls.set(id, input);
  }
  
  private createSlider(
    id: string, 
    label: string, 
    min: number, 
    max: number, 
    step: number, 
    defaultValue: number
  ): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    const input = document.createElement('input');
    input.type = 'range';
    input.id = id;
    input.min = min.toString();
    input.max = max.toString();
    input.step = step.toString();
    input.value = defaultValue.toString();
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = defaultValue.toString();
    
    input.addEventListener('input', () => {
      valueDisplay.textContent = input.value;
    });
    
    container.appendChild(labelElement);
    container.appendChild(input);
    container.appendChild(valueDisplay);
    this.container.appendChild(container);
    
    this.controls.set(id, input);
  }
  
  private createCheckbox(id: string, label: string, defaultChecked: boolean): void {
    const container = document.createElement('div');
    container.className = 'control-group checkbox-group';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.checked = defaultChecked;
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    container.appendChild(input);
    container.appendChild(labelElement);
    this.container.appendChild(container);
    
    this.controls.set(id, input);
  }
  
  private createDropdown(
    id: string, 
    label: string, 
    options: Array<{ value: string, label: string }>, 
    defaultValue: string
  ): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    const select = document.createElement('select');
    select.id = id;
    
    for (const option of options) {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      select.appendChild(optionElement);
    }
    
    select.value = defaultValue;
    
    container.appendChild(labelElement);
    container.appendChild(select);
    this.container.appendChild(container);
    
    this.controls.set(id, select);
  }
  
  private createTextInput(id: string, label: string, defaultValue: string): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.htmlFor = id;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.value = defaultValue;
    
    container.appendChild(labelElement);
    container.appendChild(input);
    this.container.appendChild(container);
    
    this.controls.set(id, input);
  }
  
  private createGenerateButton(): void {
    const button = document.createElement('button');
    button.textContent = 'Generate Dungeon';
    button.className = 'generate-button';
    button.addEventListener('click', () => {
      const presetSelector = document.getElementById('preset-selector') as HTMLSelectElement;
      if (presetSelector) {
        presetSelector.value = 'custom';
      }
      
      this.onGenerateCallback();
    });
    
    const container = document.createElement('div');
    container.className = 'button-container';
    container.appendChild(button);
    
    this.container.appendChild(container);
  }
  
  private setupEventHandlers(): void {
    const createLoopsCheckbox = this.controls.get('createLoops') as HTMLInputElement;
    const loopChanceContainer = document.getElementById('loopChance')?.parentElement;
    
    if (createLoopsCheckbox && loopChanceContainer) {
      loopChanceContainer.style.display = createLoopsCheckbox.checked ? 'block' : 'none';
      
      createLoopsCheckbox.addEventListener('change', () => {
        if (loopChanceContainer) {
          loopChanceContainer.style.display = createLoopsCheckbox.checked ? 'block' : 'none';
        }
      });
    }
  }
  
  getParams(): DungeonParams {
    const params: Partial<DungeonParams> = {};
    
    for (const param of ['width', 'height', 'numRooms', 'corridorWidth']) {
      const control = this.controls.get(param) as HTMLInputElement;
      if (control) {
        (params as any)[param] = parseInt(control.value, 10);
      }
    }
    
    for (const param of ['roomDensity', 'roomSizeVariation', 'specialRoomChance', 'featureDensity', 'loopChance', 'doorFrequency', 'secretDoorChance']) {
      const control = this.controls.get(param) as HTMLInputElement;
      if (control) {
        (params as any)[param] = parseFloat(control.value);
      }
    }
    
    const createLoopsControl = this.controls.get('createLoops') as HTMLInputElement;
    if (createLoopsControl) {
      params.createLoops = createLoopsControl.checked;
    }
    
    const hallwayStyleControl = this.controls.get('hallwayStyle') as HTMLSelectElement;
    if (hallwayStyleControl) {
      params.hallwayStyle = hallwayStyleControl.value as 'straight' | 'bendy' | 'organic';
    }
    
    const themeControl = this.controls.get('theme') as HTMLSelectElement;
    if (themeControl) {
      params.theme = themeControl.value;
    }
    
    const seedControl = this.controls.get('seed') as HTMLInputElement;
    if (seedControl && seedControl.value.trim() !== '') {
      params.seed = seedControl.value.trim();
    }
    
    return DungeonParamsBuilder.validateAndNormalize(params);
  }
  
  setParams(params: DungeonParams): void {
    for (const param of ['width', 'height', 'numRooms', 'corridorWidth']) {
      const control = this.controls.get(param) as HTMLInputElement;
      if (control && params[param as keyof DungeonParams] != null) {
        control.value = String(params[param as keyof DungeonParams]);
      }
    }
    
    for (const param of ['roomDensity', 'roomSizeVariation', 'specialRoomChance', 'featureDensity', 'loopChance', 'doorFrequency', 'secretDoorChance']) {
      const control = this.controls.get(param) as HTMLInputElement;
      if (control && params[param as keyof DungeonParams] != null) {
        control.value = String(params[param as keyof DungeonParams]);
        
        const valueDisplay = control.nextElementSibling as HTMLElement;
        if (valueDisplay && valueDisplay.className === 'slider-value') {
          valueDisplay.textContent = control.value;
        }
      }
    }
    
    const createLoopsControl = this.controls.get('createLoops') as HTMLInputElement;
    if (createLoopsControl && params.createLoops !== undefined) {
      createLoopsControl.checked = params.createLoops;
      
      const loopChanceContainer = document.getElementById('loopChance')?.parentElement;
      if (loopChanceContainer) {
        loopChanceContainer.style.display = createLoopsControl.checked ? 'block' : 'none';
      }
    }
    
    const hallwayStyleControl = this.controls.get('hallwayStyle') as HTMLSelectElement;
    if (hallwayStyleControl && params.hallwayStyle !== undefined) {
      hallwayStyleControl.value = params.hallwayStyle;
    }
    
    const themeControl = this.controls.get('theme') as HTMLSelectElement;
    if (themeControl && params.theme !== undefined) {
      themeControl.value = params.theme;
    }
  }
}
```

# src/ui/LayerPreview.ts

```ts
import { LayerOptions } from '../core/Types';
import { LayerManager } from '../renderer/LayerManager';
import { Random } from '../core/Random';

export class LayerPreviewPanel {
  private container: HTMLElement;
  private previewCanvas: HTMLCanvasElement;
  private layerControls: Map<string, LayerControlUI>;
  private layerManager: LayerManager;
  public element: HTMLElement;
  
  constructor(container: HTMLElement, width: number, height: number) {
    this.container = container;
    this.element = container;
    this.previewCanvas = document.createElement('canvas');
    this.previewCanvas.width = width;
    this.previewCanvas.height = height;
    
    this.layerManager = new LayerManager(width, height, Math.random().toString());
    
    this.layerControls = new Map();
    
    this.initializeUI();
  }
  
  private initializeUI(): void {
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'layer-preview-canvas';
    canvasContainer.appendChild(this.previewCanvas);
    this.container.appendChild(canvasContainer);
    
    const title = document.createElement('h2');
    title.textContent = 'Texture Layer Preview';
    this.container.appendChild(title);
    
    const controlPanel = document.createElement('div');
    controlPanel.className = 'layer-control-panel';
    
    this.addLayerControl(controlPanel, 'grid', 'Grid Layer');
    this.addLayerControl(controlPanel, 'rocks', 'Rock Debris');
    this.addLayerControl(controlPanel, 'cracks', 'Cracks');
    this.addLayerControl(controlPanel, 'dots', 'Dots');
    
    this.container.appendChild(controlPanel);
    
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Preview';
    refreshButton.addEventListener('click', () => {
      this.layerManager = new LayerManager(
        this.previewCanvas.width, 
        this.previewCanvas.height, 
        Math.random().toString()
      );
      this.updatePreview();
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.appendChild(refreshButton);
    this.container.appendChild(buttonContainer);
    
    this.updatePreview();
  }
  
  private addLayerControl(panel: HTMLElement, layerType: string, label: string): void {
    const control = new LayerControlUI(layerType, label, {
      opacity: 0.2,
      density: 1.0,
      scale: 1.0,
      color: '#000000',
      visible: true
    });
    
    control.onChange(() => this.updatePreview());
    panel.appendChild(control.element);
    this.layerControls.set(layerType, control);
  }
  
  updatePreview(): void {
    const ctx = this.previewCanvas.getContext('2d')!;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    
    for (const [layerType, control] of this.layerControls.entries()) {
      if (control.options.visible) {
        const layer = this.layerManager.generateLayer(layerType, control.options);
        ctx.drawImage(layer, 0, 0);
      }
    }
  }
  
  getLayerOptions(): Record<string, LayerOptions> {
    const options: Record<string, LayerOptions> = {};
    
    for (const [layerType, control] of this.layerControls.entries()) {
      options[layerType] = {...control.options};
    }
    
    return options;
  }
}

export class LayerControlUI {
  public element: HTMLElement;
  public options: LayerOptions;
  private changeCallbacks: Array<() => void> = [];
  
  constructor(layerType: string, label: string, defaultOptions: LayerOptions) {
    this.options = {...defaultOptions};
    this.element = document.createElement('div');
    this.element.className = 'layer-control';
    this.element.dataset.layerType = layerType;
    
    this.buildHeader(label);
    this.buildOpacityControl();
    this.buildDensityControl();
    this.buildScaleControl();
    this.buildColorControl();
    this.buildVisibilityToggle();
  }
  
  onChange(callback: () => void): void {
    this.changeCallbacks.push(callback);
  }
  
  private triggerChange(): void {
    for (const callback of this.changeCallbacks) {
      callback();
    }
  }
  
  private buildHeader(label: string): void {
    const header = document.createElement('h3');
    header.textContent = label;
    this.element.appendChild(header);
  }
  
  private buildOpacityControl(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Opacity:';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.05';
    slider.value = this.options.opacity.toString();
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = this.options.opacity.toString();
    
    slider.addEventListener('input', () => {
      this.options.opacity = parseFloat(slider.value);
      valueDisplay.textContent = slider.value;
      this.triggerChange();
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    this.element.appendChild(container);
  }
  
  private buildDensityControl(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Density:';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '2';
    slider.step = '0.1';
    slider.value = this.options.density.toString();
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = this.options.density.toString();
    
    slider.addEventListener('input', () => {
      this.options.density = parseFloat(slider.value);
      valueDisplay.textContent = slider.value;
      this.triggerChange();
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    this.element.appendChild(container);
  }
  
  private buildScaleControl(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Scale:';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0.2';
    slider.max = '3';
    slider.step = '0.1';
    slider.value = this.options.scale.toString();
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = this.options.scale.toString();
    
    slider.addEventListener('input', () => {
      this.options.scale = parseFloat(slider.value);
      valueDisplay.textContent = slider.value;
      this.triggerChange();
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    this.element.appendChild(container);
  }
  
  private buildColorControl(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const label = document.createElement('label');
    label.textContent = 'Color:';
    
    const input = document.createElement('input');
    input.type = 'color';
    input.value = this.options.color;
    
    input.addEventListener('input', () => {
      this.options.color = input.value;
      this.triggerChange();
    });
    
    container.appendChild(label);
    container.appendChild(input);
    this.element.appendChild(container);
  }
  
  private buildVisibilityToggle(): void {
    const container = document.createElement('div');
    container.className = 'control-group';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = this.options.visible;
    
    const label = document.createElement('label');
    label.textContent = 'Visible';
    
    checkbox.addEventListener('change', () => {
      this.options.visible = checkbox.checked;
      this.triggerChange();
    });
    
    container.appendChild(checkbox);
    container.appendChild(label);
    this.element.appendChild(container);
  }
}
```

# tsconfig.json

```json
{
    "compilerOptions": {
      "target": "es2015",
      "module": "es2015",
      "moduleResolution": "node",
      "strict": true,
      "esModuleInterop": true,
      "sourceMap": true,
      "outDir": "./dist",
      "baseUrl": "./src",
      "lib": ["dom", "es2015", "es2016", "es2017"]
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "**/*.test.ts"]
  }
```

# webpack.config.js

```js
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
};
```

