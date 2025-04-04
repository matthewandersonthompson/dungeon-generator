import { Room, Corridor, Point, CellType } from '../core/Types';
import { Random } from '../core/Random';
import { Geometry } from '../core/Geometry';
import { Grid } from '../core/Grid';

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

  /**
   * Create a new corridor generator
   * @param seed Random seed
   * @param corridorWidth Width of corridors (1-3)
   * @param createLoops Whether to create loops in the dungeon
   * @param loopChance Chance of creating additional loop connections
   * @param hallwayStyle Style of hallway generation
   */
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
      
      // Generate the path between rooms based on the hallway style
      const path = this.generatePath(roomFrom, roomTo, dungeonWidth, dungeonHeight);
      
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
   * Generate a path between two rooms based on the chosen hallway style
   * @param roomFrom Source room
   * @param roomTo Destination room
   * @param dungeonWidth Width of the dungeon
   * @param dungeonHeight Height of the dungeon
   * @returns Array of points forming the path
   */
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
  
  /**
   * Generate a straight path between two rooms
   * @param roomFrom Source room
   * @param roomTo Destination room
   * @returns Array of points along a straight line
   */
  private generateStraightPath(roomFrom: Room, roomTo: Room): Point[] {
    const startX = roomFrom.center.x;
    const startY = roomFrom.center.y;
    const endX = roomTo.center.x;
    const endY = roomTo.center.y;
    
    // Use Bresenham's algorithm to determine the line points
    return Geometry.getLinePoints(startX, startY, endX, endY);
  }
  
  /**
   * Generate a path with one bend between two rooms
   * @param roomFrom Source room
   * @param roomTo Destination room
   * @returns Array of points forming a path with one bend
   */
  private generateBendyPath(roomFrom: Room, roomTo: Room): Point[] {
    const startX = roomFrom.center.x;
    const startY = roomFrom.center.y;
    const endX = roomTo.center.x;
    const endY = roomTo.center.y;
    
    let cornerX, cornerY;
    
    // Randomly choose horizontal-first or vertical-first
    if (this.random.nextBoolean()) {
      cornerX = endX;
      cornerY = startY;
    } else {
      cornerX = startX;
      cornerY = endY;
    }
    
    // Get the two segments of the path
    const firstSegment = Geometry.getLinePoints(startX, startY, cornerX, cornerY);
    const secondSegment = Geometry.getLinePoints(cornerX, cornerY, endX, endY);
    
    // Combine segments, removing duplicate at the corner
    return [...firstSegment, ...secondSegment.slice(1)];
  }
  
  /**
   * Generate an organic path with 2-4 bends between two rooms
   * @param roomFrom Source room
   * @param roomTo Destination room
   * @param dungeonWidth Width of the dungeon
   * @param dungeonHeight Height of the dungeon
   * @returns Array of points forming an organic path
   */
  private generateOrganicPath(roomFrom: Room, roomTo: Room, dungeonWidth: number, dungeonHeight: number): Point[] {
    const startX = roomFrom.center.x;
    const startY = roomFrom.center.y;
    const endX = roomTo.center.x;
    const endY = roomTo.center.y;
    
    // Determine a random number of bends (2-4)
    const bendCount = this.random.nextInt(2, 4);
    const points: Point[] = [{ x: startX, y: startY }];
    
    // Generate intermediate points that move toward the destination
    for (let i = 0; i < bendCount; i++) {
      const progressRatio = (i + 1) / (bendCount + 1);
      const targetX = startX + (endX - startX) * progressRatio;
      const targetY = startY + (endY - startY) * progressRatio;
      
      // Add some randomness within bounds
      const variance = 10;
      const x = Math.max(0, Math.min(dungeonWidth - 1, targetX + this.random.nextInt(-variance, variance)));
      const y = Math.max(0, Math.min(dungeonHeight - 1, targetY + this.random.nextInt(-variance, variance)));
      
      points.push({ x, y });
    }
    
    // Append the final destination point
    points.push({ x: endX, y: endY });
    
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
