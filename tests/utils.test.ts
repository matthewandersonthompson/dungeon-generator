import { generateDungeon } from '../src/generator/RoomGenerator';

describe('Dungeon Generator Utils', () => {
    it('should generate a dungeon with the specified parameters', () => {
        const params = {
            width: 10,
            height: 10,
            roomCount: 5,
        };
        const dungeon = generateDungeon(params);
        expect(dungeon).toHaveProperty('rooms');
        expect(dungeon.rooms.length).toBeLessThanOrEqual(params.roomCount);
    });

    it('should return an empty dungeon if parameters are invalid', () => {
        const params = {
            width: -5,
            height: -5,
            roomCount: 0,
        };
        const dungeon = generateDungeon(params);
        expect(dungeon).toEqual({ rooms: [] });
    });

    // Additional tests can be added here
});