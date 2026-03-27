// DOM manipulation and rendering logic for the Battleship game
const container = document.querySelector('.game-container');
const humanBoard = document.getElementById('human-board');
const computerBoard = document.getElementById('computer-board');
const resetButton = document.getElementById('restart-btn');
const resultPopupWindow = document.getElementById('resultPopupWindow');
const result = document.querySelector('.result');
const descriptionPopupWindow = document.getElementById('descriptionPopupWindow');
const description = document.querySelector('.description');

function renderBoard(gameboard, boardElement, isComputer) {
    boardElement.innerHTML = '';

    gameboard.board.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.x = rowIndex;
            cellElement.dataset.y = cellIndex;

            //show ships on human board only
            if (cell !== null && !isComputer) {
                cellElement.classList.add('ship');
            }

            if (gameboard.missedAttacks.some(coord => coord[0] === rowIndex && coord[1] === cellIndex)) {
                cellElement.classList.add('miss');
            }

            if (gameboard.hitAttacks.some(coord => coord[0] === rowIndex && coord[1] === cellIndex)) {
                cellElement.classList.add('hit');
            }

            boardElement.appendChild(cellElement);
        });
    });

}

function displayDescription() {
    descriptionPopupWindow.classList.add('active');

    descriptionPopupWindow.addEventListener('click', () => {
        descriptionPopupWindow.classList.remove('active');
    }, { once: true });
}

export { container, humanBoard, computerBoard, resetButton, resultPopupWindow, descriptionPopupWindow, result, displayDescription, renderBoard }