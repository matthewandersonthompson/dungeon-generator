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
