export default function Ship(length) {
    this.length = length;
    let hits = 0;

    this.hit = function() {
        if(hits < length) hits++;
    }
    this.isSunk = function() {
        return hits === length;
    }
}