import Gameboard from "../src/Gameboard.js";
import Ship from "../src/ship.js";

test('Ship is placed on the board correctly', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, 1, 1);

    expect(gameboard.board[1][1]).toBe(ship);
});

test('Placing ship out of the grid should not place the ship', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    expect(gameboard.placeShip(ship, 6, 1)).toBe(null);
    expect(gameboard.placeShip(ship, -2, 8)).toBe(null);
});

test('No two ships can overlap on the board', () => {
    const gameboard = new Gameboard();
    const ship1 = new Ship(3);
    const ship2 = new Ship(3);

    gameboard.placeShip(ship1, 1, 2);

    expect(gameboard.placeShip(ship2, 1, 2)).toBe("Cell already occupied");
    expect(gameboard.board[1][2]).toBe(ship1);
});

test('Placing ship on the edge of the grid should work', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, 4, 2);

    expect(gameboard.board[4][2]).toBe(ship);
});

test('Placing ship on the corner of the grid should work', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, 0, 0);

    expect(gameboard.board[0][0]).toBe(ship);
});

test('Placing multiple ships adjacent to each other should work', () => {
    const gameboard = new Gameboard();
    const ship1 = new Ship(3);
    const ship2 = new Ship(3);

    gameboard.placeShip(ship1, 1, 1);
    gameboard.placeShip(ship2, 1, 2);

    expect(gameboard.board[1][1]).toBe(ship1);
    expect(gameboard.board[1][2]).toBe(ship2);
});


// Testing receiveAttack 

test('Receiving attack on occupied cell should hit the ship', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, 1, 1);
    gameboard.receiveAttack(1, 1);

    expect(gameboard.board[1][1]).toBe(ship);
    expect(gameboard.hitAttacks).toContainEqual([1, 1]);
    expect(ship.isSunk()).toBe(false);
});

test('Receiving attack on empty cell should record a miss', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, 1, 1);
    gameboard.receiveAttack(2, 2);

    expect(gameboard.board[2][2]).toBe(null);
    expect(gameboard.missedAttacks).toContainEqual([2, 2]);
    expect(ship.isSunk()).toBe(false);
});

test('Receiving attack on the same cell more than once should return "Already attacked"', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(3);

    gameboard.placeShip(ship, 1, 1);
    gameboard.receiveAttack(1, 1);

    expect(gameboard.receiveAttack(1, 1)).toBe("Already attacked");

    gameboard.receiveAttack(2, 2);
    expect(gameboard.receiveAttack(2, 2)).toBe("Already attacked");
});

test('Receiving attack out of bounds should return null', () => {
    const gameboard = new Gameboard();

    expect(gameboard.receiveAttack(10, 2)).toBe(null);
    expect(gameboard.receiveAttack(-1, 0)).toBe(null);
});

test('Ship sinks after enough hits', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(1);

    gameboard.placeShip(ship, 1, 1);
    gameboard.receiveAttack(1, 1);

    expect(ship.isSunk()).toBe(true);
});

test('Different ships can be hit independently', () => {
    const gameboard = new Gameboard();
    const ship1 = new Ship(1);
    const ship2 = new Ship(1);

    gameboard.placeShip(ship1, 1, 1);
    gameboard.placeShip(ship2, 2, 2);

    gameboard.receiveAttack(1, 1);

    expect(ship1.isSunk()).toBe(true);
    expect(ship2.isSunk()).toBe(false);
});

test('Multiple hits on the same cell should not sink the ship', () => {
    const gameboard = new Gameboard();
    const ship = new Ship(2);

    gameboard.placeShip(ship, 1, 1);

    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(1, 1);

    expect(ship.isSunk()).toBe(false);
});


// Testing allShipsSunk 

test('allShipsSunk returns true when all ships are sunk', () => {
    const gameboard = new Gameboard();
    const ship1 = new Ship(1);
    const ship2 = new Ship(1);

    gameboard.placeShip(ship1, 1, 1);
    gameboard.placeShip(ship2, 2, 2);

    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(2, 2);

    expect(gameboard.allShipsSunk()).toBe(true);
});

test('allShipsSunk returns false when at least one ship is not sunk', () => {
    const gameboard = new Gameboard();
    const ship1 = new Ship(1);
    const ship2 = new Ship(1);

    gameboard.placeShip(ship1, 1, 1);
    gameboard.placeShip(ship2, 2, 2);

    gameboard.receiveAttack(1, 1);

    expect(gameboard.allShipsSunk()).toBe(false);
});

test('allShipsSunk returns true when there are no ships on the board', () => {
    const gameboard = new Gameboard();

    expect(gameboard.allShipsSunk()).toBe(true);
});