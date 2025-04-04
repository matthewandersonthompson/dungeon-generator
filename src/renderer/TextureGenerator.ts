import { Random } from '../core/Random';
import { LayerOptions } from '../core/Types';

/**
 * Interface for texture generators
 */
export interface TextureGenerator {
  /**
   * Generate a texture on the provided canvas context
   * @param ctx Canvas context to draw on
   * @param width Width of the canvas
   * @param height Height of the canvas
   * @param random Random number generator
   * @param options Layer options
   */
  generate(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    random: Random,
    options: LayerOptions
  ): void;
}

/**
 * Grid texture generator
 */
export class GridTextureGenerator implements TextureGenerator {
  generate(ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, options: LayerOptions) {
    const { scale, color, opacity } = options;
    
    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.lineWidth = 0.5;
    
    const gridSize = 20 * scale;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
}

/**
 * Rock debris texture generator
 */
export class RocksTextureGenerator implements TextureGenerator {
  generate(ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, options: LayerOptions) {
    const { density, color, opacity, scale } = options;
    
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    
    // Number of rocks based on density and canvas size
    const rockCount = Math.floor((width * height * density) / 3000);
    
    for (let i = 0; i < rockCount; i++) {
      const x = random.next() * width;
      const y = random.next() * height;
      const size = (2 + random.next() * 5) * scale;
      
      this.drawRock(ctx, x, y, size, random);
    }
  }
  
  drawRock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, random: Random) {
    ctx.beginPath();
    
    // Create irregular rock shape
    const points = 5 + Math.floor(random.next() * 3);
    const angleStep = (Math.PI * 2) / points;
    
    for (let i = 0; i < points; i++) {
      const angle = i * angleStep;
      const radius = size * (0.7 + random.next() * 0.6);
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Cracks texture generator
 */
export class CracksTextureGenerator implements TextureGenerator {
  generate(ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, options: LayerOptions) {
    const { density, color, opacity, scale } = options;
    
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
  
  drawCrack(ctx: CanvasRenderingContext2D, startX: number, startY: number, length: number, random: Random) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    let x = startX;
    let y = startY;
    let angle = random.next() * Math.PI * 2;
    
    const segments = 3 + Math.floor(random.next() * 5);
    const segLength = length / segments;
    
    for (let i = 0; i < segments; i++) {
      // Adjust angle slightly for each segment
      angle += (random.next() - 0.5) * 0.8;
      
      x += Math.cos(angle) * segLength;
      y += Math.sin(angle) * segLength;
      
      ctx.lineTo(x, y);
    }
    
    ctx.stroke();
  }
}

/**
 * Dots texture generator
 */
export class DotsTextureGenerator implements TextureGenerator {
  generate(ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, options: LayerOptions) {
    const { density, color, opacity, scale } = options;
    
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    
    // Number of dots based on density and canvas size
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

/**
 * Factory for creating texture generators
 */
export class TextureGeneratorFactory {
  static createGenerator(type: string): TextureGenerator {
    switch (type.toLowerCase()) {
      case 'grid':
        return new GridTextureGenerator();
      case 'rocks':
        return new RocksTextureGenerator();
      case 'cracks':
        return new CracksTextureGenerator();
      case 'dots':
        return new DotsTextureGenerator();
      default:
        throw new Error(`Unknown texture generator type: ${type}`);
    }
  }
}