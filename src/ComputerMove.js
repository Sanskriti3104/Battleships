export default function ComputerMove(computerPlayer, humanPlayer) {

    const board = humanPlayer.gameboard;
    const queue = computerPlayer.targetQueue;   // [] persists on computerPlayer
    const N     = board.board.length;

    // ── Bootstrap persistent AI state (first call only) 
    if (!computerPlayer.aiState) {
        computerPlayer.aiState = {
            phase:    'HUNT',
            // DIRECTION_TEST
            firstHit: null,     // [x,y] – the shot that started this hunt
            tryOrder: [],       // neighbour probes remaining
            // LOCKED
            direction: null,    // 'vertical' | 'horizontal'
        };
    }
    const ai = computerPlayer.aiState;

    // Helpers 

    const inBounds = (x, y) => x >= 0 && x < N && y >= 0 && y < N;
    const attacked = (x, y) => board.isAlreadyAttacked(x, y);
    const wasHit   = (x, y) => board.hitAttacks.some(([hx, hy]) => hx === x && hy === y);
    const isMiss   = (x, y) => attacked(x, y) && !wasHit(x, y);

    function safeEnqueue(x, y) {
        if (inBounds(x, y) && !attacked(x, y) &&
            !queue.some(([qx, qy]) => qx === x && qy === y)) {
            queue.push([x, y]);
        }
    }

    function drainToValid() {
        while (queue.length > 0) {
            const cell = queue.shift();
            if (!attacked(cell[0], cell[1])) return cell;
        }
        return null;
    }

    function resetToHunt() {
        ai.phase     = 'HUNT';
        ai.firstHit  = null;
        ai.tryOrder  = [];
        ai.direction = null;
        queue.length = 0;
    }

    //  What happened on the PREVIOUS move? 
    const allAttacked = board.attackedCells;
    const lastCell    = allAttacked.length > 0
        ? allAttacked[allAttacked.length - 1]
        : null;
    const lastWasHit  = lastCell && wasHit(lastCell[0], lastCell[1]);

    // Sink check (runs every call when not in HUNT) 
    if (ai.phase !== 'HUNT' && ai.firstHit) {
        const ship = board.getShipAt(ai.firstHit[0], ai.firstHit[1]);
        if (ship && ship.isSunk()) {
            resetToHunt();
            // fall through to HUNT section below
        }
    }

    //  PHASE: DIRECTION_TEST
    //  We have a firstHit; try neighbours one at a time to find the axis.
    if (ai.phase === 'DIRECTION_TEST') {

        if (lastWasHit && lastCell) {
            const [lx, ly] = lastCell;
            const [fx, fy] = ai.firstHit;

            // Second adjacent hit → lock axis
            if (Math.abs(lx - fx) + Math.abs(ly - fy) === 1) {
                ai.phase     = 'LOCKED';
                ai.direction = (lx === fx) ? 'horizontal' : 'vertical';
                queue.length = 0;   // discard leftover DIRECTION_TEST probes

                if (ai.direction === 'vertical') {
                    const minX = Math.min(lx, fx), maxX = Math.max(lx, fx);
                    safeEnqueue(minX - 1, fy);
                    safeEnqueue(maxX + 1, fy);
                } else {
                    const minY = Math.min(ly, fy), maxY = Math.max(ly, fy);
                    safeEnqueue(fx, minY - 1);
                    safeEnqueue(fx, maxY + 1);
                }

                const cell = drainToValid();
                if (cell) return cell;
                resetToHunt();
                // fall through to HUNT
            }
        }

        // Still in DIRECTION_TEST (last shot was a miss, or no 2nd hit yet)
        if (ai.phase === 'DIRECTION_TEST') {
            while (ai.tryOrder.length > 0) {
                const [tx, ty] = ai.tryOrder.shift();
                if (!attacked(tx, ty)) return [tx, ty];
            }
            // All probes exhausted without finding the axis → give up
            resetToHunt();
        }
    }

    //  PHASE: LOCKED
    //  Extend both ends of the confirmed hit-line after each new hit.
    if (ai.phase === 'LOCKED') {

        if (lastWasHit && lastCell) {
            const [lx, ly] = lastCell;

            if (ai.direction === 'vertical') {
                // Collect all hits in this column (y === firstHit[1])
                const col    = ai.firstHit[1];
                const colHits = board.hitAttacks
                    .filter(([, hy]) => hy === col)
                    .map(([hx]) => hx);
                const minX = Math.min(...colHits);
                const maxX = Math.max(...colHits);
                safeEnqueue(minX - 1, col);
                safeEnqueue(maxX + 1, col);
            } else {
                // Collect all hits in this row (x === firstHit[0])
                const row    = ai.firstHit[0];
                const rowHits = board.hitAttacks
                    .filter(([hx]) => hx === row)
                    .map(([, hy]) => hy);
                const minY = Math.min(...rowHits);
                const maxY = Math.max(...rowHits);
                safeEnqueue(row, minY - 1);
                safeEnqueue(row, maxY + 1);
            }
        }

        const cell = drainToValid();
        if (cell) return cell;

        // Queue exhausted, ship not sunk → lost the trail, go random
        resetToHunt();
    }

    //  PHASE: HUNT
    //  Check if the previous HUNT shot was a hit → enter DIRECTION_TEST.
    if (ai.phase === 'HUNT' && lastWasHit && lastCell) {
        const [lx, ly] = lastCell;
        const ship = board.getShipAt(lx, ly);

        if (ship && !ship.isSunk()) {
            ai.phase    = 'DIRECTION_TEST';
            ai.firstHit = [lx, ly];

            // Build ordered probe list: up → down → left → right
            ai.tryOrder = [
                [lx - 1, ly],
                [lx + 1, ly],
                [lx, ly - 1],
                [lx, ly + 1],
            ].filter(([nx, ny]) => inBounds(nx, ny) && !attacked(nx, ny));

            if (ai.tryOrder.length > 0) {
                return ai.tryOrder.shift();
            }
            resetToHunt(); // All neighbours already attacked (edge case)
        }
    }

    // HUNT: choose next shot 

    const unsunkShips = board.ships.filter(s => !s.isSunk());

    // Last remaining ship → probability density search
    if (unsunkShips.length === 1) {
        return probabilityDensityShot(N, unsunkShips[0].length, attacked, isMiss);
    }

    // Multi-ship hunt → checkerboard parity (halves expected search moves)
    return parityHunt(N, attacked);
}

//  HUNT HELPERS

/**
 * Checkerboard parity hunt.
 * Every ship of length ≥ 2 covers at least one (x+y)%2===0 cell,
 * so we only need to probe half the board to guarantee a first hit.
 */
function parityHunt(N, attacked) {
    const candidates = [];
    for (let x = 0; x < N; x++)
        for (let y = 0; y < N; y++)
            if (!attacked(x, y) && (x + y) % 2 === 0)
                candidates.push([x, y]);

    const pool = candidates.length > 0 ? candidates : allUnattacked(N, attacked);
    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Probability Density Search.
 *
 * Counts how many valid placements of a ship of length `shipLen` pass
 * through each cell (a placement is valid if it contains no miss cells).
 * Fires at the highest-scoring unattacked cell.
 */
function probabilityDensityShot(N, shipLen, attacked, isMiss) {
    const score = Array.from({ length: N }, () => new Array(N).fill(0));

    // Horizontal placements
    for (let x = 0; x < N; x++) {
        for (let startY = 0; startY <= N - shipLen; startY++) {
            let valid = true;
            for (let k = 0; k < shipLen; k++) {
                if (isMiss(x, startY + k)) { valid = false; break; }
            }
            if (valid)
                for (let k = 0; k < shipLen; k++) score[x][startY + k]++;
        }
    }

    // Vertical placements
    for (let startX = 0; startX <= N - shipLen; startX++) {
        for (let y = 0; y < N; y++) {
            let valid = true;
            for (let k = 0; k < shipLen; k++) {
                if (isMiss(startX + k, y)) { valid = false; break; }
            }
            if (valid)
                for (let k = 0; k < shipLen; k++) score[startX + k][y]++;
        }
    }

    // Collect highest-scoring unattacked cells
    let best = -1, bestCells = [];
    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            if (attacked(x, y)) continue;
            if (score[x][y] > best) {
                best = score[x][y];
                bestCells = [[x, y]];
            } else if (score[x][y] === best) {
                bestCells.push([x, y]);
            }
        }
    }

    return bestCells[Math.floor(Math.random() * bestCells.length)];
}

function allUnattacked(N, attacked) {
    const cells = [];
    for (let x = 0; x < N; x++)
        for (let y = 0; y < N; y++)
            if (!attacked(x, y)) cells.push([x, y]);
    return cells;
}