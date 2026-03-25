import Player from '../src/Player.js';

test('Player is created with a name and a gameboard', () => {
    const player = new Player('Human');

    expect(player.name).toBe('Human');
    expect(player.gameboard).toBeDefined();
});

test('Each player has their own gameboard', () => {
    const Human = new Player('Human');
    const Computer = new Player('Computer');

    expect(Human.gameboard).not.toBe(Computer.gameboard);
});