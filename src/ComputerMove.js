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

    // Functions to add neighbours 
    function pushVerticalFirst(x, y) {
        validpush(x - 1, y); //up
        validpush(x + 1, y); //down

    }

    function pushHorizontalFirst(x, y) {
        validpush(x, y - 1); //left
        validpush(x, y + 1); //right
    }

    // If there was a hit, add neighbours which are not attacked 
    if (!isEmpty(hitAttacks)) {
        const [x, y] = hitAttacks[hitAttacks.length - 1];

        if (hitAttacks.length > 1) {
            const [px, py] = hitAttacks[hitAttacks.length - 2];

            // Check if hits are adjacent
            if (Math.abs(px - x) + Math.abs(py - y) === 1) {

                //Vertical Direction
                if (py === y) {
                    pushVerticalFirst(x, y);
                    pushHorizontalFirst(x, y);
                }

                // Horizontal direction
                if (px === x) {
                    pushHorizontalFirst(x, y);
                    pushVerticalFirst(x, y);
                }
            } else {
                pushVerticalFirst(x, y);
                pushHorizontalFirst(x, y);
            }
        } else {
            pushVerticalFirst(x, y);
            pushHorizontalFirst(x, y);
        }

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