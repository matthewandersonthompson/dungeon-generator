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
  CAVE = 'cave'
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
