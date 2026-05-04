import Ship from './ship.js';
import Player from './Player.js';
import * as DOM from './DOM.js';
import ComputerMove from './ComputerMove.js';
import autoPlaceShip from './ShipPlacement.js';
import setupShips from './setUpShips.js';

export default function Game(humanBoard) {
    // Ships
    const ships = [
        { name: "Carrier", length: 5 },
        { name: "Battleship", length: 4 },
        { name: "Cruiser", length: 3 },
        { name: "Submarine", length: 3 },
        { name: "Destroyer", length: 2 }
    ];

    // Create players
    const humanPlayer = new Player('Human');

    if (humanBoard) {
        humanPlayer.gameboard = humanBoard;
    } else {
        placeShipsRandomly(humanPlayer);
    }
    
    const computerPlayer = new Player('Computer');

    // Flag to track if the game is over
    let gameOver = false;

    // Place ships randomly for computer
    function placeShipsRandomly(player) {
        ships.forEach(ship => {
            autoPlaceShip(player.gameboard, new Ship(ship.name, ship.length));
        });
    }

    placeShipsRandomly(computerPlayer);

    // Render the boards
    DOM.renderBoard(humanPlayer.gameboard, DOM.humanBoard, false);
    DOM.renderBoard(computerPlayer.gameboard, DOM.computerBoard, true);

    // Set the active player
    let activePlayer = humanPlayer;

    const switchPlayer = () => {
        activePlayer = activePlayer === humanPlayer ? computerPlayer : humanPlayer;
    };

    // Game loop
    DOM.computerBoard.addEventListener('click', (event) => {
        if (gameOver) return;
        if (activePlayer !== humanPlayer) return;
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

    // ── RESTART: go back to the ship placement screen ────────────────────────
    // Remove any old listener first to prevent stacking across game instances
    const newRestartBtn = DOM.resetButton.cloneNode(true);
    DOM.resetButton.parentNode.replaceChild(newRestartBtn, DOM.resetButton);

    newRestartBtn.addEventListener('click', () => {
        // Hide game UI
        const gameContainer = document.querySelector('.game-container');
        const controls      = document.querySelector('.controls');
        const setupContainer = document.querySelector('.setup-container');

        gameContainer.style.display  = 'none';
        controls.style.display       = 'none';

        // Reset both gameboards
        humanPlayer.gameboard.reset();
        computerPlayer.gameboard.reset();

        // Reset AI state so the next game starts clean
        computerPlayer.aiState    = null;
        computerPlayer.targetQueue = [];

        // Re-initialise the setup screen with a fresh board + draggable ships
        // Read the player name that was set on the board title during setup
        const boardTitle = document.querySelector('.placement-area .board-container h2');
        const playerName = boardTitle
            ? boardTitle.textContent.replace("'s Fleet", '').trim()
            : 'Player';

        // Clear the placement board so setupShips can rebuild it
        const placementBoard = document.getElementById('placement-board');
        placementBoard.innerHTML = '';

        // Reset ship panel items to draggable
        document.querySelectorAll('.ships-panel .ship').forEach(ship => {
            ship.draggable = true;
            ship.dataset.placed = 'false';
            ship.style.opacity  = '1';
        });

        // Reset direction dropdown
        const directionSelect = document.getElementById('ship-direction');
        if (directionSelect) directionSelect.value = 'horizontal';

        // Show setup screen
        setupContainer.style.display = 'flex';

        // Re-run setupShips to wire up fresh drag-drop + start button
        setupShips(playerName);
    });

    // Function to display result popup
    function displayResult(player) {
        DOM.resultPopupWindow.classList.add('active');
        DOM.result.textContent = (player === humanPlayer) ? "You Win!" : "Computer Wins!";
        setTimeout(() => {
            DOM.resultPopupWindow.classList.remove('active');
            newRestartBtn.click();   // auto-redirect to setup after 3s
        }, 3000);
    }
}