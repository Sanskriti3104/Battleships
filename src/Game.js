import Ship from './ship.js';
import Player from './Player.js';
import * as DOM from './DOM.js';
import autoPlaceShip from './ShipPlacement.js';

export default function Game() {
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
    const computerPlayer = new Player('Computer');

    // Flag to track if the game is over
    let gameOver = false;

    // Place ships randomly for both players
    function placeShipsRandomly(player) {
        ships.forEach(ship => {
            autoPlaceShip(player.gameboard, new Ship(ship.name, ship.length));
        });
    }

    //Initial placement
    placeShipsRandomly(humanPlayer);
    placeShipsRandomly(computerPlayer);

    // Render the boards
    DOM.renderBoard(humanPlayer.gameboard, DOM.humanBoard, false);
    DOM.renderBoard(computerPlayer.gameboard, DOM.computerBoard, true);

    // Set the active player 
    let activePlayer = humanPlayer;

    // Function to switch active player
    const switchPlayer = () => {
        activePlayer = activePlayer === humanPlayer ? computerPlayer : humanPlayer;
    }

    // Start the game loop
    DOM.computerBoard.addEventListener('click', (event) => {
        if (gameOver) return; // Do nothing if the game is already over

        if (activePlayer !== humanPlayer) return; // Only allow human player to click

        if (!event.target.dataset.x) return;

        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        if (isNaN(x) || isNaN(y)) return; // Clicked outside of a cell
        if (computerPlayer.gameboard.isAlreadyAttacked(x, y)) return;

        computerPlayer.gameboard.receiveAttack(x, y);
        DOM.renderBoard(computerPlayer.gameboard, DOM.computerBoard, true);

        if (computerPlayer.gameboard.allShipsSunk()) {
            displayResult(humanPlayer);
            gameOver = true; // Set game over flag
            return;
        }

        switchPlayer();

        // turn switched
        if (activePlayer !== computerPlayer) return; // Only allow computer player to attack

        let cx, cy;

        do {
            cx = Math.floor(Math.random() * humanPlayer.gameboard.board.length);
            cy = Math.floor(Math.random() * humanPlayer.gameboard.board[0].length);
        } while (
            humanPlayer.gameboard.isAlreadyAttacked(cx, cy)
        );

        humanPlayer.gameboard.receiveAttack(cx, cy);
        DOM.renderBoard(humanPlayer.gameboard, DOM.humanBoard, false);

        if (humanPlayer.gameboard.allShipsSunk()) {
            gameOver = true; // Set game over flag
            displayResult(computerPlayer);
            return;
        }

        switchPlayer();
    });

    DOM.resetButton.addEventListener('click', () => {
        // Reset game state
        humanPlayer.gameboard.reset();
        computerPlayer.gameboard.reset();

        gameOver = false;
        activePlayer = humanPlayer;

        // Place ships randomly again
        placeShipsRandomly(humanPlayer);
        placeShipsRandomly(computerPlayer);

        // Re-render the boards
        DOM.renderBoard(humanPlayer.gameboard, DOM.humanBoard, false);
        DOM.renderBoard(computerPlayer.gameboard, DOM.computerBoard, true);
    });

    // Function to display (popup)
    function displayResult(player) {
        DOM.popupWindow.classList.add('active');
        DOM.result.textContent = (player === humanPlayer) ? "You Win!" : "Computer Wins!";
        setTimeout(() => {
            DOM.popupWindow.classList.remove('active');
            DOM.resetButton.click();   // restart game automatically
        }, 3000);
    }
}