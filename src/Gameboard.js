function Gameboard() {

    const boardSize = 10;

    // Create empty 10x10 board
    this.board = Array.from({ length: boardSize }, () =>
        Array(boardSize).fill(null)
    );

    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];

    this.placeShip = function (ship, x, y) {

        if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
            return null; // Out of bounds, do not place the ship
        }

        if (this.board[x][y] !== null) {
            return "Cell already occupied";
        }

        this.board[x][y] = ship;
        this.ships.push(ship);
    }

    this.receiveAttack = function (x, y) {
        if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
            return null;
        }

        if (this.isAlreadyAttacked(x, y)) {
            return "Already attacked";
        }

        if (this.board[x][y] !== null) {
            this.board[x][y].hit();
            this.hitAttacks.push([x, y]);
            return "Hit";
        } else {
            this.missedAttacks.push([x, y]);
            return "Miss";
        }
    }

    this.isAlreadyAttacked = function (x, y) {
        return (
            this.missedAttacks.some(coord => coord[0] === x && coord[1] === y) ||
            this.hitAttacks.some(coord => coord[0] === x && coord[1] === y)
        );
    }

    this.allShipsSunk = function () {
        return this.ships.every(ship => ship.isSunk());
    }
}

export default Gameboard;