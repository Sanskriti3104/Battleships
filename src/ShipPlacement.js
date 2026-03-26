export default function autoPlaceShip(gameboard, ship) {
    const board = gameboard.board;
    const boardSize = board.length;

    function getRandomDirection() {
        return Math.random() < 0.5 ? "horizontal" : "vertical";
    }

    function getRandomStart(shipLength, direction) {
        let row = Math.floor(Math.random() * boardSize);
        let col = Math.floor(Math.random() * boardSize);

        if (direction === "horizontal" && col + shipLength > boardSize) {
            col = boardSize - shipLength;
        }

        if (direction === "vertical" && row + shipLength > boardSize) {
            row = boardSize - shipLength;
        }

        return [row, col];
    }

    function canPlaceShip(row, col, shipLength, direction) {

        for (let i = 0; i < shipLength; i++) {

            let r = row;
            let c = col;

            if (direction === "horizontal") c += i;
            else r += i;

            if (board[r][c] !== null) {
                return false;
            }
        }

        return true;
    }

    let placed = false;

    while (!placed) {
        const direction = getRandomDirection();
        const [row, col] = getRandomStart(ship.length, direction);

        if (canPlaceShip(row, col, ship.length, direction)) {
            gameboard.placeShip(ship, row, col, direction);
            placed = true;

        }
    }
}