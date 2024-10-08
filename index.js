function Ship(lengthShip) {
  let hits = 0;
  return {
    lengthShip: lengthShip,
    hit() {
      hits += 1;
    },
    isSunk() {
      return lengthShip <= hits;
    },
  };
}

module.exports = { Ship };
