import Ship from './ship.js';
import Player from './Player.js';
import * as DOM from './DOM.js';
import ComputerMove from './ComputerMove.js';
import autoPlaceShip from './ShipPlacement.js';
import setupShips from './setUpShips.js';

export default function Game(humanBoard) {

    const ships = [
        { name: "Carrier",    length: 5 },
        { name: "Battleship", length: 4 },
        { name: "Cruiser",    length: 3 },
        { name: "Submarine",  length: 3 },
        { name: "Destroyer",  length: 2 },
    ];

    const humanPlayer    = new Player('Human');
    const computerPlayer = new Player('Computer');

    if (humanBoard) {
        humanPlayer.gameboard = humanBoard;
    } else {
        placeShipsRandomly(humanPlayer);
    }

    let gameOver     = false;
    let activePlayer = humanPlayer;

    function placeShipsRandomly(player) {
        ships.forEach(ship => {
            autoPlaceShip(player.gameboard, new Ship(ship.name, ship.length));
        });
    }

    placeShipsRandomly(computerPlayer);

    DOM.renderBoard(humanPlayer.gameboard,    DOM.humanBoard,    false);
    DOM.renderBoard(computerPlayer.gameboard, DOM.computerBoard, true);

    const switchPlayer = () => {
        activePlayer = activePlayer === humanPlayer ? computerPlayer : humanPlayer;
    };

    // ── Game loop ────────────────────────────────────────────────────────────
    DOM.computerBoard.addEventListener('click', (event) => {
        if (gameOver || activePlayer !== humanPlayer) return;
        if (!event.target.dataset.x) return;

        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);
        if (isNaN(x) || isNaN(y)) return;
        if (computerPlayer.gameboard.isAlreadyAttacked(x, y)) return;

        computerPlayer.gameboard.receiveAttack(x, y);
        DOM.renderBoard(computerPlayer.gameboard, DOM.computerBoard, true);

        if (computerPlayer.gameboard.allShipsSunk()) {
            displayResult(humanPlayer);
            gameOver = true;
            return;
        }

        switchPlayer();
        if (activePlayer !== computerPlayer) return;

        const [cx, cy] = ComputerMove(computerPlayer, humanPlayer);
        humanPlayer.gameboard.receiveAttack(cx, cy);
        DOM.renderBoard(humanPlayer.gameboard, DOM.humanBoard, false);

        if (humanPlayer.gameboard.allShipsSunk()) {
            gameOver = true;
            displayResult(computerPlayer);
            return;
        }

        switchPlayer();
    });

    // ── Restart — redirect to setup screen ───────────────────────────────────
    // Clone the button to wipe any listener attached by a previous Game() call
    const oldBtn    = document.getElementById('restart-btn');
    const restartBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(restartBtn, oldBtn);

    restartBtn.addEventListener('click', goToSetup);

    function goToSetup() {
        // Hide game UI
        document.querySelector('.game-container').style.display = 'none';
        document.querySelector('.controls').style.display       = 'none';

        // Reset state
        humanPlayer.gameboard.reset();
        computerPlayer.gameboard.reset();
        computerPlayer.aiState     = null;
        computerPlayer.targetQueue = [];
        gameOver     = false;
        activePlayer = humanPlayer;

        // Read player name from the board title set during setup
        const boardTitle = document.querySelector('.placement-area .board-container h2');
        const playerName = boardTitle
            ? boardTitle.textContent.replace("'s Fleet", '').trim()
            : 'Player';

        // ── KEY FIX: replace ship panel HTML with brand-new elements ─────────
        // The old .ship nodes still have touchstart/dragstart listeners from the
        // previous setupShips() call. Re-using them causes doubled handlers and
        // broken drag on the second game. Replacing the innerHTML gives us clean
        // DOM nodes that setupShips() can attach to without any stale state.
        const shipsPanel = document.querySelector('.ships-panel');
        shipsPanel.innerHTML = `
            <h2>Drag Your Ships</h2>

            <div class="ship" draggable="true" data-length="5">Carrier (5)</div>
            <div class="ship" draggable="true" data-length="4">Battleship (4)</div>
            <div class="ship" draggable="true" data-length="3">Cruiser (3)</div>
            <div class="ship" draggable="true" data-length="3">Submarine (3)</div>
            <div class="ship" draggable="true" data-length="2">Destroyer (2)</div>

            <div class="setup-controls">
                <label for="ship-direction">Direction:</label>
                <select id="ship-direction">
                    <option value="horizontal" selected>Horizontal</option>
                    <option value="vertical">Vertical</option>
                </select>
                <button id="start-game-btn" disabled>Start Game</button>
            </div>
        `;

        // Clear the placement board grid
        document.getElementById('placement-board').innerHTML = '';

        // Show setup screen and wire it up fresh
        document.querySelector('.setup-container').style.display = 'flex';
        setupShips(playerName);
    }

    // ── Result popup ─────────────────────────────────────────────────────────
    function displayResult(player) {
        DOM.resultPopupWindow.classList.add('active');
        DOM.result.textContent = player === humanPlayer ? "You Win!" : "Computer Wins!";
        setTimeout(() => {
            DOM.resultPopupWindow.classList.remove('active');
            restartBtn.click();
        }, 3000);
    }
}