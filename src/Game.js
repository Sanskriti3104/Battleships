import Ship from './ship.js';
import Player from './Player.js';
import * as DOM from './DOM.js';
import autoPlaceShip from './ShipPlacement.js';

export default function Game() {
    // Ships
    const ships = [
        new Ship("Carrier", 5),
        new Ship("Battleship", 4),
        new Ship("Cruiser", 3),
        new Ship("Submarine", 3),
        new Ship("Destroyer", 2)
    ];

    // Create players
    const humanPlayer = new Player('Human');
    const computerPlayer = new Player('Computer');

    // Flag to track if the game is over
    let gameOver = false;

    // Place ships randomly for both players
    ships.forEach(ship => {
        autoPlaceShip(humanPlayer.gameboard, ship);
    });

    ships.forEach(ship => {
        autoPlaceShip(computerPlayer.gameboard, new Ship(ship.name, ship.length));
    });

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
            DOM.status.textContent = 'You win! Click Restart to play again.';
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
            DOM.status.textContent = 'Computer wins! Click Restart to play again.';
            gameOver = true; // Set game over flag
            return;
        }

        switchPlayer();
    });

}