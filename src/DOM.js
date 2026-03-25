// DOM manipulation and rendering logic for the Battleship game
const container = document.querySelector('.container');
const humanBoard = document.querySelector('.humanboard');
const computerBoard = document.querySelector('.computerboard');

function renderBoard(gameboard, boardElement) {
    boardElement.innerHTML = '';

    gameboard.board.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.x = rowIndex;
            cellElement.dataset.y = cellIndex;
    
            if (cell !== null) {
                cellElement.classList.add('ship');
            }

            boardElement.appendChild(cellElement);
        });
    });

}
  
export { container, humanBoard, computerBoard, renderBoard }