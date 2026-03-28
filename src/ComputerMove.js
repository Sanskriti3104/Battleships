export default function ComputerMove(computerPlayer, humanPlayer) {

    let cx, cy;
    const queue = computerPlayer.targetQueue;
    const boardSize = humanPlayer.gameboard.board.length;

    const isEmpty = (arr) => arr.length === 0;

    const hitAttacks = humanPlayer.gameboard.hitAttacks;

    // Checks a valid push
    function validpush(x, y) {
        if (x >= 0 &&
            x < boardSize &&
            y >= 0 &&
            y < boardSize &&
            !humanPlayer.gameboard.isAlreadyAttacked(x, y)) {
            queue.push([x, y]);
        }
    }

    // If there was a hit, add neighbours which are not attacked 
    if (!isEmpty(hitAttacks)) {

        const [x, y] = hitAttacks[hitAttacks.length - 1];
        validpush(x - 1, y);
        validpush(x + 1, y);
        validpush(x, y - 1);
        validpush(x, y + 1);

    }

    // TARGET MODE
    while (!isEmpty(queue)) {

        [cx, cy] = queue.shift();

        if (!humanPlayer.gameboard.isAlreadyAttacked(cx, cy)) {
            return [cx, cy];
        }
    }

    // RANDOM SEARCH MODE
    do {

        cx = Math.floor(Math.random() * boardSize);
        cy = Math.floor(Math.random() * boardSize);

    } while (humanPlayer.gameboard.isAlreadyAttacked(cx, cy));

    return [cx, cy];
}