function Gameboard() {

    const boardSize = 10;

    // Create empty 10x10 board
    const createBoard = () => {
        return Array.from({ length: boardSize }, () =>
        Array(boardSize).fill(null)
    );
    }
    this.board = createBoard();
    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];

    this.placeShip = function (ship, x, y, direction) {

        for (let i = 0; i < ship.length; i++) {

            let r = x;
            let c = y;

            if (direction === "horizontal") c += i;
            else r += i;

            this.board[r][c] = ship;
        }
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

    this.reset = function () {
        this.board = createBoard();

        this.ships = [];
        this.missedAttacks = [];
        this.hitAttacks = [];
    }
}

export default Gameboard;