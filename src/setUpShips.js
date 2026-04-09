import Gameboard from "./Gameboard.js";
import Ship from "./ship.js";
import Game from "./Game.js";

export default function setupShips(playerName) {

    const boardTitle = document.querySelector(".placement-area .board-container h2");
    boardTitle.textContent = `${playerName}'s Fleet`;

    const boardElement = document.getElementById("placement-board");
    const ships = document.querySelectorAll(".ship");
    const startButton = document.getElementById("start-game-btn");
    const directionSelect = document.getElementById("ship-direction");

    const board = new Gameboard();

    let direction = directionSelect.value;

    directionSelect.addEventListener("change", () => {
        direction = directionSelect.value;
    });

    const boardSize = 10;

    // CREATE BOARD
    for (let x = 0; x < boardSize; x++) {

        for (let y = 0; y < boardSize; y++) {

            const cell = document.createElement("div");
            cell.classList.add("cell");

            cell.dataset.x = x;
            cell.dataset.y = y;

            boardElement.appendChild(cell);

            cell.addEventListener("dragover", (e) => e.preventDefault());

            cell.addEventListener("drop", (e) => {

                const length = parseInt(e.dataTransfer.getData("length"));
                const name = e.dataTransfer.getData("name");

                const ship = new Ship(name, length);

                const row = parseInt(cell.dataset.x);
                const col = parseInt(cell.dataset.y);

                // VALIDATION CHECKS

                if (!isValidPlacement(row, col, length, direction)) {
                    alert("Invalid placement");
                    return;
                }

                try {

                    board.placeShip(ship, row, col, direction);

                    for (let i = 0; i < length; i++) {

                        let r = row;
                        let c = col;

                        if (direction === "horizontal") c += i;
                        else r += i;

                        const index = r * boardSize + c;
                        boardElement.children[index].classList.add("ship");

                    }

                    // REMOVE SHIP FROM PANEL AFTER PLACEMENT
                    const draggedShip = document.querySelector(`[data-length="${length}"]`);
                    if (draggedShip) draggedShip.remove();

                } catch (err) {

                    alert("Invalid placement");

                }

            });

        }

    }

    // DRAG START
    ships.forEach(ship => {

        ship.addEventListener("dragstart", (e) => {

            e.dataTransfer.setData("length", ship.dataset.length);
            e.dataTransfer.setData("name", ship.textContent);

        });

    });

    // VALIDATION FUNCTION
    function isValidPlacement(row, col, length, direction) {

        if (direction === "horizontal" && col + length > boardSize) {
            return false;
        }

        if (direction === "vertical" && row + length > boardSize) {
            return false;
        }

        for (let i = 0; i < length; i++) {

            let r = row;
            let c = col;

            if (direction === "horizontal") c += i;
            else r += i;

            if (board.board[r][c] !== null) {
                return false;
            }

        }

        return true;

    }

    // START GAME
    startButton.addEventListener("click", () => {

        const setupContainer = document.querySelector(".setup-container");
        const gameContainer = document.querySelector(".game-container");
        const controls = document.querySelector(".controls");

        setupContainer.style.display = "none";
        gameContainer.style.display = "flex";
        controls.style.display = "flex";

        Game(board);

    });

}