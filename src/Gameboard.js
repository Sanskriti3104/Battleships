import Ship from "../src/ship.js";

function Gameboard() {

    this.board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    
    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];

    this.placeShip = function (ship, x, y) {

        if (x < 0 || x > this.board.length - 1 || y < 0 || y > this.board[0].length - 1) {
            return null; // Out of bounds, do not place the ship
        }

        if (this.board[x][y] !== null) {
            return "Cell already occupied";
        }

        this.board[x][y] = ship;
        this.ships.push(ship);
    }

    this.receiveAttack = function (x, y) {
        if (x < 0 || x > this.board.length - 1 || y < 0 || y > this.board[0].length - 1) {
            return null; 
        }

        const alreadyMissed = this.missedAttacks.some(coord => coord[0] === x && coord[1] === y);
        const alreadyHit = this.hitAttacks.some(coord => coord[0] === x && coord[1] === y);

        if(alreadyHit || alreadyMissed) {
            return "Already attacked";
        }

        if(this.board[x][y] !== null) {
            this.board[x][y].hit();
            this.hitAttacks.push([x, y]);
        }else {
            this.missedAttacks.push([x, y]);
        }
    }

    this.allShipsSunk = function() {
        return this.ships.every(ship => ship.isSunk());
    }
}

export default Gameboard;