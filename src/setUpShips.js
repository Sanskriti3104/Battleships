import Gameboard from "./Gameboard.js";
import Ship from "./ship.js";
import Game from "./Game.js";

export default function setupShips(playerName) {

    const boardTitle = document.querySelector(".placement-area .board-container h2");
    boardTitle.textContent = `${playerName}'s Fleet`;

    const boardElement = document.getElementById("placement-board");
    const ships        = document.querySelectorAll(".ship");
    const startButton  = document.getElementById("start-game-btn");
    startButton.disabled = true;

    const directionSelect = document.getElementById("ship-direction");
    const board    = new Gameboard();
    const boardSize = 10;

    let direction      = directionSelect.value;
    let placedShipsCount = 0;
    const totalShips   = ships.length;

    // ── Shared drag state (used by both mouse and touch handlers) ────────────
    let dragLength = 0;
    let dragName   = '';

    directionSelect.addEventListener("change", () => {
        direction = directionSelect.value;
    });

    // ── BUILD THE PLACEMENT BOARD ─────────────────────────────────────────────
    for (let x = 0; x < boardSize; x++) {
        for (let y = 0; y < boardSize; y++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;
            boardElement.appendChild(cell);

            // Mouse drop target
            cell.addEventListener("dragover", (e) => e.preventDefault());
            cell.addEventListener("drop", (e) => {
                e.preventDefault();
                tryPlace(
                    parseInt(cell.dataset.x),
                    parseInt(cell.dataset.y),
                    parseInt(e.dataTransfer.getData("length")),
                    e.dataTransfer.getData("name")
                );
            });
        }
    }

    // ── MOUSE DRAG on ship panel items ────────────────────────────────────────
    ships.forEach(ship => {
        ship.addEventListener("dragstart", (e) => {
            dragLength = parseInt(ship.dataset.length);
            dragName   = ship.textContent.trim();
            e.dataTransfer.setData("length", dragLength);
            e.dataTransfer.setData("name",   dragName);
        });
    });

    // ── TOUCH DRAG-AND-DROP ───────────────────────────────────────────────────
    // iOS / Android do not fire HTML5 drag events.
    // We replicate the behaviour with touchstart → touchmove → touchend.

    let touchGhost = null;   // floating clone that follows the finger

    ships.forEach(ship => {

        ship.addEventListener("touchstart", (e) => {
            if (ship.dataset.placed === "true") return;

            dragLength = parseInt(ship.dataset.length);
            dragName   = ship.textContent.trim();

            // Build ghost
            touchGhost = document.createElement("div");
            touchGhost.textContent = ship.textContent;
            touchGhost.style.cssText = `
                position: fixed;
                z-index: 99999;
                pointer-events: none;
                opacity: 0.8;
                padding: 8px 14px;
                border-radius: 6px;
                background: var(--ship-color);
                color: var(--button-text, #fff);
                font-family: Capriola, sans-serif;
                font-size: 14px;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(touchGhost);
            positionGhost(e.touches[0]);

        }, { passive: true });

        ship.addEventListener("touchmove", (e) => {
            if (!touchGhost) return;
            e.preventDefault();           // prevent page scroll during drag
            positionGhost(e.touches[0]);
        }, { passive: false });

        ship.addEventListener("touchend", (e) => {
            if (!touchGhost) return;

            const touch  = e.changedTouches[0];

            // Temporarily hide ghost so elementFromPoint can see the cell beneath
            touchGhost.style.display = "none";
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            touchGhost.style.display = "";

            if (target && target.classList.contains("cell") && target.dataset.x !== undefined) {
                tryPlace(
                    parseInt(target.dataset.x),
                    parseInt(target.dataset.y),
                    dragLength,
                    dragName
                );
            }

            removeGhost();
        });

        ship.addEventListener("touchcancel", removeGhost);
    });

    function positionGhost(touch) {
        if (!touchGhost) return;
        // Centre the ghost on the fingertip
        touchGhost.style.left = (touch.clientX - touchGhost.offsetWidth  / 2) + "px";
        touchGhost.style.top  = (touch.clientY - touchGhost.offsetHeight / 2) + "px";
    }

    function removeGhost() {
        if (touchGhost) { touchGhost.remove(); touchGhost = null; }
    }

    // ── SHARED PLACEMENT LOGIC ────────────────────────────────────────────────
    function tryPlace(row, col, length, name) {
        if (!isValidPlacement(row, col, length, direction)) {
            alert("Invalid placement — ship goes out of bounds or overlaps another.");
            return;
        }

        try {
            const ship = new Ship(name, length);
            board.placeShip(ship, row, col, direction);

            // Paint cells on the board
            for (let i = 0; i < length; i++) {
                let r = row, c = col;
                if (direction === "horizontal") c += i;
                else r += i;
                boardElement.children[r * boardSize + c].classList.add("ship");
            }

            // Grey-out the placed ship in the panel
            // querySelector with :not([data-placed="true"]) handles two ships of length 3
            const panelShip = document.querySelector(
                `.ships-panel .ship[data-length="${length}"]:not([data-placed="true"])`
            );
            if (panelShip) {
                panelShip.draggable           = false;
                panelShip.dataset.placed      = "true";
                panelShip.style.opacity       = "0.5";
                panelShip.style.cursor        = "default";
                panelShip.style.pointerEvents = "none";
            }

            placedShipsCount++;
            if (placedShipsCount === totalShips) startButton.disabled = false;

        } catch (err) {
            alert("Invalid placement!");
        }
    }

    // ── VALIDATION ────────────────────────────────────────────────────────────
    function isValidPlacement(row, col, length, dir) {
        if (dir === "horizontal" && col + length > boardSize) return false;
        if (dir === "vertical"   && row + length > boardSize) return false;

        for (let i = 0; i < length; i++) {
            let r = row, c = col;
            if (dir === "horizontal") c += i;
            else r += i;
            if (board.board[r][c] !== null) return false;
        }
        return true;
    }

    // ── START GAME ────────────────────────────────────────────────────────────
    startButton.addEventListener("click", () => {
        document.querySelector(".setup-container").style.display = "none";
        document.querySelector(".game-container").style.display  = "flex";
        document.querySelector(".controls").style.display        = "flex";
        Game(board);
    });
}