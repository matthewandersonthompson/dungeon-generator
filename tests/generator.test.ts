import { DungeonGenerator } from '../src/generator/DungeonGenerator';

describe('DungeonGenerator', () => {
    let dungeonGenerator: DungeonGenerator;

    beforeEach(() => {
        dungeonGenerator = new DungeonGenerator();
    });

    test('should initialize with default parameters', () => {
        expect(dungeonGenerator).toBeDefined();
        // Add more expectations based on default parameters
    });

    test('should generate a dungeon with specified size', () => {
        const size = { width: 10, height: 10 };
        const dungeon = dungeonGenerator.generate(size);
        expect(dungeon).toHaveProperty('rooms');
        expect(dungeon.rooms.length).toBeGreaterThan(0);
        // Add more expectations based on the generated dungeon
    });

    test('should connect rooms with corridors', () => {
        const size = { width: 10, height: 10 };
        const dungeon = dungeonGenerator.generate(size);
        expect(dungeon).toHaveProperty('corridors');
        expect(dungeon.corridors.length).toBeGreaterThan(0);
        // Add more expectations based on the corridors
    });

    // Add more tests as needed
});