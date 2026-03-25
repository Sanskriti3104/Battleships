import Ship from './ship.js';
import Player from './Player.js';
import * as DOM from './DOM.js';

export default function Game() {
    // Create players
    const humanPlayer = new Player('Human');
    const computerPlayer = new Player('Computer');

    // Place ships for both players
    humanPlayer.gameboard.placeShip(new Ship(1), 1, 1);
    humanPlayer.gameboard.placeShip(new Ship(1), 2, 2);

    computerPlayer.gameboard.placeShip(new Ship(1), 0, 0);
    computerPlayer.gameboard.placeShip(new Ship(1), 3, 1);

    // Render the boards
    DOM.renderBoard(humanPlayer.gameboard, DOM.humanBoard);
    DOM.renderBoard(computerPlayer.gameboard, DOM.computerBoard);

    // Set the active player 
    let activePlayer = humanPlayer;
    console.log(`Game started! It's ${activePlayer.name}'s turn.`);

    // Function to switch active player
    const switchPlayer = () => {
        activePlayer = activePlayer === humanPlayer ? computerPlayer : humanPlayer;
        console.log(`It's now ${activePlayer.name}'s turn.`);
    }

    // Start the game loop
    DOM.computerBoard.addEventListener('click', (event) => {
        if (activePlayer !== humanPlayer) return; // Only allow human player to click

        if (!event.target.dataset.x) return;

        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        if (isNaN(x) || isNaN(y)) return; // Clicked outside of a cell
        if (computerPlayer.gameboard.isAlreadyAttacked(x, y)) return;

        computerPlayer.gameboard.receiveAttack(x, y);
        DOM.renderBoard(computerPlayer.gameboard, DOM.computerBoard);

        if (computerPlayer.gameboard.allShipsSunk()) {
            console.log('Human player wins!');
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
        DOM.renderBoard(humanPlayer.gameboard, DOM.humanBoard);

        if (humanPlayer.gameboard.allShipsSunk()) {
            console.log('Computer wins');
            return;
        }

        switchPlayer();
    });

}