import Ship from '../src/ship.js';

test('Ship is created with correct length' , () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
});

test('Ship is not sunk before enough hits', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
});

test('isSunk returns true when hits equal length' , () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test('ship remains sunk after extra hits' , () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit(); // Extra hit beyond length
    expect(ship.isSunk()).toBe(true);
}); 