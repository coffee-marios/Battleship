export function Ship(lengthShip, name) {
  let hits = 0;
  let blocks = [];
  let adjacentBlocks = [];
  return {
    name: name,
    lengthShip: lengthShip,
    blocks: blocks,
    adjacentBlocks: adjacentBlocks,
    clearBlocks() {
      this.blocks = [];
      this.adjacentBlocks = [];
    },
    hit() {
      hits += 1;
    },
    isSunk() {
      return lengthShip <= hits;
    },
  };
}

const carrier = Ship(3, "Carrier");
const battleship = Ship(3, "Battleship");
const destroyer = Ship(2, "Destroyer");
const submarine = Ship(1, "Submarine");
const patrolBoat = Ship(1, "Patrol");

const allShips = [carrier, battleship, destroyer, submarine, patrolBoat];

export function Gameboard() {
  const myShips = [];
  const occupiedBlocks = new Map();
  const surroundBlocks = new Map();

  const getRandomInt = (max) => {
    const x = Math.floor(Math.random() * max);
    const y = Math.floor(Math.random() * max);
    return [x, y];
  };

  const fitBoard = (len) => {
    // For a board of ten blocks
    const [x, y] = getRandomInt(10);
    if (x + len <= 10 && y + len <= 10) return [x, y];
    return fitBoard(len);
  };

  function placeShip(nameShip) {
    const len = nameShip.lengthShip;
    const random_int = getRandomInt(2)[0];
    const [x_pos, y_pos] = fitBoard(len);
    const direction_boat = random_int === 0 ? "vertical" : "horizontal";

    const boat_blocks = (x, y, direction) => {
      const shipBlocks = [];
      const aroundBlocks = [];
      if (direction === "horizontal") {
        for (let i = 0; i < len; i++) {
          // Ship blocks
          const x_block = i + x;
          const key = [x_block, y].toString();
          shipBlocks.push(key);

          // Adjacent blocks

          // In all cases we have above and below adjacent blocks

          let above = y - 1;
          let below = y + 1;

          let adjAbove = [x_block, above].toString();
          let adjBelow = [x_block, below].toString();

          if (above >= 0) aroundBlocks.push(adjAbove);
          if (below <= 9) aroundBlocks.push(adjBelow);

          if (i === 0) {
            let left = x_block - 1;
            let adjLeft = [left, y].toString();
            if (left >= 0) {
              aroundBlocks.push(adjLeft);

              // Diagonal blocks
              let upLeft = y - 1;
              let downLeft = y + 1;
              let upDiagonalLeft = [left, upLeft].toString();
              let downDiagonalLeft = [left, downLeft].toString();
              if (upLeft >= 0) aroundBlocks.push(upDiagonalLeft);
              if (downLeft <= 9) aroundBlocks.push(downDiagonalLeft);
            }
          }
          if (i === len - 1) {
            let right = x_block + 1;
            console.log("right: ", right);
            let adjRight = [right, y].toString();
            if (right <= 9) {
              aroundBlocks.push(adjRight);

              // Diagonal blocks
              let upRight = y - 1;
              let downRight = y + 1;
              let upDiagonalRight = [right, upRight].toString();
              let downDiagonalRight = [right, downRight].toString();
              if (upRight >= 0) aroundBlocks.push(upDiagonalRight);
              if (downRight <= 9) aroundBlocks.push(downDiagonalRight);
            }
          }
        }
      }
      if (direction === "vertical") {
        for (let i = 0; i < len; i++) {
          // Ship blocks
          const y_block = i + y;
          const key = [x, y_block].toString();
          shipBlocks.push(key);

          // Adjacent blocks

          // In all cases we have left and right adjacent blocks
          let left = x - 1;
          let right = x + 1;
          let adjLeft = [left, y_block].toString();
          let adjRight = [right, y_block].toString();

          if (left >= 0) aroundBlocks.push(adjLeft);
          if (right <= 9) aroundBlocks.push(adjRight);

          if (i === 0) {
            let above = y_block - 1;
            let adjAbove = [x, above].toString();
            if (above >= 0) {
              aroundBlocks.push(adjAbove);

              // Diagonal blocks
              let upLeft = x - 1;
              let upRight = x + 1;
              let upDiagonalLeft = [upLeft, above].toString();
              let upDiagonalRight = [upRight, above].toString();
              if (upLeft >= 0) aroundBlocks.push(upDiagonalLeft);
              if (upRight <= 9) aroundBlocks.push(upDiagonalRight);
            }
          }
          if (i === len - 1) {
            let below = y_block + 1;
            let adjBelow = [x, below].toString();
            if (below <= 9) {
              aroundBlocks.push(adjBelow);

              // Diagonal blocks
              let belowLeft = x - 1;
              let belowRight = x + 1;
              let belowDiagonalLeft = [belowLeft, below].toString();
              let belowDiagonalRight = [belowRight, below].toString();
              if (belowLeft >= 0) aroundBlocks.push(belowDiagonalLeft);
              if (belowRight <= 9) aroundBlocks.push(belowDiagonalRight);
            }
          }
        }
      }
      return [shipBlocks, aroundBlocks];
    };

    const testBlocks = (test_blocks, test_adjacent) => {
      let testing_unit;
      for (let i = 0; i < test_blocks.length; i++) {
        testing_unit = test_blocks[i];
        if (occupiedBlocks.has(testing_unit)) return false;
        for (let i = 0; i < test_adjacent.length; i++) {
          if (surroundBlocks.has(testing_unit)) return false;
        }
      }

      return true;
    };

    // Arrays of the ship and the adjacent blacks
    const [ship_blocks, around_blocks] = boat_blocks(
      x_pos,
      y_pos,
      direction_boat
    );

    if (testBlocks(ship_blocks, around_blocks)) {
      for (let i = 0; i < ship_blocks.length; i++) {
        let block_ship = ship_blocks[i];
        occupiedBlocks.set(block_ship, nameShip);
        nameShip.blocks.push(block_ship);
      }

      for (let i = 0; i < around_blocks.length; i++) {
        let adjacent_block = around_blocks[i];
        surroundBlocks.set(adjacent_block, nameShip);
        nameShip.adjacentBlocks.push(adjacent_block);
      }
      myShips.push(nameShip);
    } else {
      return placeShip(nameShip);
    }
  }

  return {
    occupiedBlocks: occupiedBlocks,
    carrier: carrier,
    battleship: battleship,
    myShips: myShips,
    allShips: allShips,
    setBoats(_allShips = allShips) {
      console.log(_allShips);
      occupiedBlocks.clear();
      surroundBlocks.clear();

      for (let i = 0; i < _allShips.length; i++) {
        _allShips[i].clearBlocks();
        placeShip(_allShips[i]);
      }
    },

    receiveAttack(x_axis, y_axis) {
      const key = [x_axis, y_axis].toString();
      const target = occupiedBlocks.get(key);
      if (target !== undefined) {
        target.hit();
      }
      return target === undefined ? false : true;
    },
    ohMyShip() {
      for (let i = 0; i < myShips.length; i++) {
        if (!myShips[i].isSunk()) return false;
      }
      return true;
    },
    collisionShip(myShip) {
      for (let i = 0; i < myShip.length; i++) {
        const key = myShip[i];
        if (occupiedBlocks.has(key)) return true;
      }
      return false;
    },
  };
}

export function Player(human = true) {
  const gboard = Gameboard();
  const win = false;

  return {
    human: human,
    win: win,
    gboard: gboard,
  };
}
