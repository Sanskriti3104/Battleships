export default function Ship(name,length) {
    this.name = name;
    this.length = length;
    let hits = 0;

    this.hit = function() {
        if(hits < length) hits++;
    }
    this.isSunk = function() {
        return hits === length;
    }
}