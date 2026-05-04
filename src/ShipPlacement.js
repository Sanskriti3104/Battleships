export default function autoPlaceShip(gameboard, ship) {
    const board = gameboard.board;
    const boardSize = board.length;

    function getRandomDirection() {
        return Math.random() < 0.5 ? "horizontal" : "vertical";
    }

    function getRandomStart(shipLength, direction) {
        let row, col;

        if (direction === "horizontal") {
            row = Math.floor(Math.random() * boardSize);
            col = Math.floor(Math.random() * (boardSize - shipLength + 1));
        } else {
            row = Math.floor(Math.random() * (boardSize - shipLength + 1));
            col = Math.floor(Math.random() * boardSize);
        }

        return [row, col];
    }

    // CHECK INCLUDING ADJACENT CELLS (ANTI-CLUSTER RULE)
    function canPlaceShip(row, col, shipLength, direction) {

        for (let i = 0; i < shipLength; i++) {

            let r = direction === "horizontal" ? row : row + i;
            let c = direction === "horizontal" ? col + i : col;

            // Check surrounding 8 directions + self
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {

                    let newR = r + dr;
                    let newC = c + dc;

                    if (
                        newR >= 0 &&
                        newR < boardSize &&
                        newC >= 0 &&
                        newC < boardSize
                    ) {
                        if (board[newR][newC] !== null) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    let placed = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 1000;

    while (!placed && attempts < MAX_ATTEMPTS) {
        const direction = getRandomDirection();
        const [row, col] = getRandomStart(ship.length, direction);

        if (canPlaceShip(row, col, ship.length, direction)) {
            gameboard.placeShip(ship, row, col, direction);
            placed = true;
        }

        attempts++;
    }

    if (!placed) {
        console.warn("Failed to place ship after many attempts");
    }
} 