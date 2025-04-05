import { Room, Corridor, Point, CellType } from '../core/Types';
import { Random } from '../core/Random';
import { Geometry } from '../core/Geometry';
import { Grid } from '../core/Grid';

interface Edge {
  from: number;
  to: number;
  weight: number;
  roomFrom: Room;
  roomTo: Room;
}

export class CorridorGenerator {
  private random: Random;
  private corridorWidth: number;
  private createLoops: boolean;
  private loopChance: number;
  private hallwayStyle: 'straight' | 'bendy' | 'organic';

  constructor(
    seed?: string | number,
    corridorWidth: number = 1,
    createLoops: boolean = true,
    loopChance: number = 0.3,
    hallwayStyle: 'straight' | 'bendy' | 'organic' = 'bendy'
  ) {
    this.random = new Random(seed);
    this.corridorWidth = Math.max(1, Math.min(3, corridorWidth));
    this.createLoops = createLoops;
    this.loopChance = loopChance;
    this.hallwayStyle = hallwayStyle;
  }

  generateCorridors(rooms: Room[], dungeonWidth: number, dungeonHeight: number): Corridor[] {
    if (rooms.length <= 1) return [];
    const edges = this.createAllPossibleEdges(rooms);
    const mstEdges = this.generateMinimumSpanningTree(edges, rooms.length);
    const finalEdges = mstEdges;
    return this.createCorridorPaths(finalEdges, dungeonWidth, dungeonHeight);
  }

  private createAllPossibleEdges(rooms: Room[]): Edge[] {
    const edges: Edge[] = [];
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const roomA = rooms[i], roomB = rooms[j];
        const distance = Geometry.distance(roomA.center.x, roomA.center.y, roomB.center.x, roomB.center.y);
        edges.push({ from: roomA.id, to: roomB.id, weight: distance, roomFrom: roomA, roomTo: roomB });
      }
    }
    edges.sort((a, b) => a.weight - b.weight);
    return edges;
  }

  private generateMinimumSpanningTree(edges: Edge[], numRooms: number): Edge[] {
    const parent: number[] = [];
    for (let i = 0; i < numRooms; i++) parent[i] = i;
    const find = (i: number): number => (parent[i] !== i ? (parent[i] = find(parent[i])) : i);
    const union = (i: number, j: number): void => { parent[find(i)] = find(j); };
    const mstEdges: Edge[] = [];
    for (const edge of edges) {
      if (find(edge.from) !== find(edge.to)) {
        mstEdges.push(edge);
        union(edge.from, edge.to);
        if (mstEdges.length === numRooms - 1) break;
      }
    }
    return mstEdges;
  }

  private addLoopConnections(allEdges: Edge[], mstEdges: Edge[]): Edge[] {
    const result: Edge[] = [...mstEdges];
    const mstEdgeSet = new Set(mstEdges.map(edge => `${edge.from}-${edge.to}`));
    for (const edge of allEdges) {
      const key = `${edge.from}-${edge.to}`, revKey = `${edge.to}-${edge.from}`;
      if (mstEdgeSet.has(key) || mstEdgeSet.has(revKey)) continue;
      if (this.random.nextFloat(0, 1) < this.loopChance) {
        result.push(edge);
        mstEdgeSet.add(key);
      }
    }
    return result;
  }

  private createCorridorPaths(edges: Edge[], dungeonWidth: number, dungeonHeight: number): Corridor[] {
    const corridors: Corridor[] = [];
    for (const edge of edges) {
      const { roomFrom, roomTo } = edge;
      const path = this.generatePath(roomFrom, roomTo, dungeonWidth, dungeonHeight);
      corridors.push({ from: roomFrom.id, to: roomTo.id, fromRoom: roomFrom, toRoom: roomTo, path, width: this.corridorWidth });
    }
    return corridors;
  }

  private generatePath(roomFrom: Room, roomTo: Room, dungeonWidth: number, dungeonHeight: number): Point[] {
    switch (this.hallwayStyle) {
      case 'straight':
        return this.generateStraightPath(roomFrom, roomTo);
      case 'bendy':
        return this.generateBendyPath(roomFrom, roomTo);
      case 'organic':
        return this.generateOrganicPath(roomFrom, roomTo, dungeonWidth, dungeonHeight);
      default:
        return this.generateBendyPath(roomFrom, roomTo);
    }
  }

  private generateStraightPath(roomFrom: Room, roomTo: Room): Point[] {
    return Geometry.getLinePoints(roomFrom.center.x, roomFrom.center.y, roomTo.center.x, roomTo.center.y);
  }

  private generateBendyPath(roomFrom: Room, roomTo: Room): Point[] {
    const startX = roomFrom.center.x, startY = roomFrom.center.y;
    const endX = roomTo.center.x, endY = roomTo.center.y;
    let cornerX: number, cornerY: number;
    if (this.random.nextBoolean()) {
      cornerX = endX; cornerY = startY;
    } else {
      cornerX = startX; cornerY = endY;
    }
    const firstSegment = Geometry.getLinePoints(startX, startY, cornerX, cornerY);
    const secondSegment = Geometry.getLinePoints(cornerX, cornerY, endX, endY);
    return [...firstSegment, ...secondSegment.slice(1)];
  }

  private generateOrganicPath(roomFrom: Room, roomTo: Room, dungeonWidth: number, dungeonHeight: number): Point[] {
    const startX = roomFrom.center.x, startY = roomFrom.center.y;
    const endX = roomTo.center.x, endY = roomTo.center.y;
    const bendCount = this.random.nextInt(2, 4);
    const points: Point[] = [{ x: startX, y: startY }];
    for (let i = 0; i < bendCount; i++) {
      const progress = (i + 1) / (bendCount + 1);
      const targetX = startX + (endX - startX) * progress;
      const targetY = startY + (endY - startY) * progress;
      const variance = 10;
      const x = Math.max(0, Math.min(dungeonWidth - 1, targetX + this.random.nextInt(-variance, variance)));
      const y = Math.max(0, Math.min(dungeonHeight - 1, targetY + this.random.nextInt(-variance, variance)));
      points.push({ x, y });
    }
    points.push({ x: endX, y: endY });
    const path: Point[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const segment = Geometry.getLinePoints(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
      if (i === 0) path.push(...segment);
      else path.push(...segment.slice(1));
    }
    return path;
  }
}
