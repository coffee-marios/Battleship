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

function Gameboard() {
  const carrier = Ship(5);

  const occupiedBlocks = new Map();
  for (let i = 1; i <= 5; i++) {
    // map uses strict equality; so, [1, 1] === [1, 1] => false
    const key = [i, 1].toString();
    occupiedBlocks.set(key, carrier);
  }

  // const strikes = [];

  return {
    receiveAttack(x_axis, y_axis) {
      const key = [x_axis, y_axis].toString();
      const target = occupiedBlocks.get(key);
      if (target !== undefined) {
        target.hit();
      }
      return target === undefined ? false : true;
    },
    ohMyShip() {
      return carrier.isSunk();
    },
  };
}

module.exports = { Ship, Gameboard };
