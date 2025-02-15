export function Ship(lengthShip, name) {
  let hits = 0;
  let blocks = [];
  let adjacentBlocks = [];
  let reachedBlocks = [];
  let reachedAdjBlocks = [];
  let movementShip = new Map();
  movementShip.set("axis_x", undefined);
  movementShip.set("axis_y", undefined);
  movementShip.set("direction", undefined);
  let blockedDirection = new Map();

  let direction = "NOT SET";
  let moving = false;

  return {
    name: name,
    lengthShip: lengthShip,
    blocks: blocks,
    blockedDirection: blockedDirection,
    collisionUpdate() {
      blockedDirection.set("collision", false);
      blockedDirection.set("move-x-negative", undefined);
      blockedDirection.set("move-x-positive", undefined);
      blockedDirection.set("move-y-negative", undefined);
      blockedDirection.set("move-y-positive", undefined);
    },
    adjacentBlocks: adjacentBlocks,
    reachedAdjBlocks: reachedAdjBlocks,
    direction: direction,
    movementShip: movementShip,
    reachedBlocks: reachedBlocks,
    moving: moving,
    blockShiftUpdate() {
      movementShip.set("axis_x", undefined);
      movementShip.set("axis_y", undefined);
      movementShip.set("direction", undefined);
    },

    resetBlockedMovement(label_direction, criticalBlock) {
      blockedDirection.set(label_direction, criticalBlock);
    },
    blockChange(arr) {
      this.reachedBlocks = [...arr];
    },
    clearBlocks() {
      this.blocks = [];
      this.adjacentBlocks = [];
      this.reachedBlocks = [];
      this.reachedAdjBlocks = [];
    },
    hit() {
      hits += 1;
    },
    isSunk() {
      return lengthShip <= hits;
    },
  };
}

// Get the ships ready

export function Gameboard(human = true) {
  let carrier, battleship, destroyer, submarine, patrolBoat;
  if (human === true) {
    carrier = Ship(3, "Carrier");
    battleship = Ship(3, "Battleship");
    destroyer = Ship(2, "Destroyer");
    submarine = Ship(1, "Submarine");
    patrolBoat = Ship(1, "Patrol");
  } else {
    carrier = Ship(3, "Carrier_comp");
    battleship = Ship(3, "Battleship_comp");
    destroyer = Ship(2, "Destroyer_comp");
    submarine = Ship(1, "Submarine_comp");
    patrolBoat = Ship(1, "Patrol_comp");
  }

  let allShips = [carrier, battleship, destroyer, submarine, patrolBoat];

  const myShips = [];
  let occupiedBlocks = new Map();
  let surroundBlocks = new Map();

  // Moving the boat
  let temporary_occupiedBlocks = new Map();
  let temporary_surroundBlocks = new Map();
  let temporary_data_boat = new Map();

  // Reset the blocks
  function tempPermanent() {
    //console.clear();
    //  console.log(1, occupiedBlocks);
    //  console.log(2, temporary_occupiedBlocks);
    if (temporary_occupiedBlocks.size === 10) {
      occupiedBlocks.clear();
      surroundBlocks.clear();
      // console.log("size", temporary_occupiedBlocks.size);
      for (const [key, value] of temporary_occupiedBlocks) {
        occupiedBlocks.set(key, value);
      }
      for (const [key, value] of temporary_surroundBlocks) {
        surroundBlocks.set(key, value);
      }
      temporary_occupiedBlocks.clear();
      temporary_surroundBlocks.clear();
    }
  }

  const getRandomInt = (max) => {
    const x = Math.floor(Math.random() * max);
    const y = Math.floor(Math.random() * max);
    return [x, y];
  };

  // Randomly pick the position of the first block
  const fitBoard = (len) => {
    // For a board of ten blocks
    const [x, y] = getRandomInt(10);
    if (x + len <= 10 && y + len <= 10) return [x, y];
    return fitBoard(len);
  };

  // All the blocks (including surrounding blocks) of the boat
  const boat_blocks = (x, y, len, direction) => {
    const shipBlocks = [];
    const aroundBlocks = [];
    if (direction === "horizontal") {
      for (let i = 0; i < len; i++) {
        // Ship blocks
        const x_block = i + x;
        const sqr_board = [x_block, y];
        shipBlocks.push(sqr_board);

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
        const sqr_board = [x, y_block];
        shipBlocks.push(sqr_board);

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
    return [shipBlocks, aroundBlocks, direction];
  };

  const testBlocks = (
    test_blocks,
    test_adjacent,
    testShip,
    map_Blocks = occupiedBlocks,
    mapAdj = surroundBlocks
  ) => {
    //console.log("Testing:", testShip);
    let testing_unit;
    let ships_blocks_copy = [...test_blocks];
    for (let i = 0; i < ships_blocks_copy.length; i++) {
      testing_unit = ships_blocks_copy[i];
      if (testing_unit[0] >= 10 || testing_unit[1] >= 10) return false;
      if (testing_unit[0] < 0 || testing_unit[1] < 0) return false;

      testing_unit = ships_blocks_copy[i].toString();

      if (map_Blocks.has(testing_unit)) {
        testShip.blockedDirection.set("collision", true);
        return false;
      }
      for (let i = 0; i < test_adjacent.length; i++) {
        if (mapAdj.has(testing_unit)) {
          testShip.blockedDirection.set("collision", true);

          return false;
        }
      }
    }
    return true;
  };

  // For when we manually shift the ship
  function reset_occupiedBlocks(blocks, adj_blocks, moving_ship) {
    temporary_occupiedBlocks.clear();
    temporary_surroundBlocks.clear();

    // Temporary map of the blocks of ships that we initially don't move
    for (const [sqr_board, obj_ship] of occupiedBlocks) {
      if (obj_ship.name !== moving_ship.name) {
        temporary_occupiedBlocks.set(sqr_board, obj_ship);
      }
    }

    for (const [sqr_board, obj_ship] of surroundBlocks) {
      let valid_ships = [];
      if (!obj_ship.includes(moving_ship.name)) {
        valid_ships = [...obj_ship];
      } else if (obj_ship.includes(moving_ship.name) && obj_ship.length > 1) {
        valid_ships = [];
        for (let i = 0; i < obj_ship.length; i++) {
          if (obj_ship[i] !== moving_ship.name) valid_ships.push(obj_ship[i]);
        }
      }
      if (valid_ships.length >= 1) {
        temporary_surroundBlocks.set(sqr_board, valid_ships);
      }
    }

    const possibleMove = testBlocks(
      blocks,
      adj_blocks,
      moving_ship,
      temporary_occupiedBlocks,
      temporary_surroundBlocks
    );

    if (possibleMove === false) {
      //console.clear();
      //console.log("Stop", occupiedBlocks);
      moving_ship.moving = false;
    } else {
      moving_ship.moving = true;
      moving_ship.reachedBlocks = blocks;
      moving_ship.reachedAdjBlocks = adj_blocks;
    }
  }

  // For manually moving a ship
  // let new_blocks;
  let first_block;

  // Update the array for the new squares that the ship occupies
  function prepareShift(hovering) {
    first_block = [...hovering];
  }

  let x_first, y_first;

  function manuallyShiftShip(ship, hover_block) {
    // Find the new blocks of the ship
    if (hover_block === undefined) return;

    const direction = ship.direction;
    const all_blocks = [...ship.blocks];
    const len = ship.lengthShip;
    let shift_x = ship.movementShip.get("axis_x");
    let shift_y = ship.movementShip.get("axis_y");
    if (shift_x === undefined) x_first = all_blocks[0][0];
    if (shift_y === undefined) y_first = all_blocks[0][1];

    if (first_block !== hover_block) {
      let diff_x = hover_block[0] - first_block[0];
      let diff_y = hover_block[1] - first_block[1];

      if (diff_x !== 0 && diff_y == 0) {
        x_first = all_blocks[0][0] + diff_x;
        ship.movementShip.set("axis_x", diff_x);
        if (diff_x > 0) {
          ship.movementShip.set("direction", "move-x-positive");
        }
        if (diff_x < 0) {
          ship.movementShip.set("direction", "move-x-negative");
        }
      } else if (diff_x === 0 && diff_y !== 0) {
        y_first = all_blocks[0][1] + diff_y;
        ship.movementShip.set("axis_y", diff_y);
        if (diff_y > 0) {
          ship.movementShip.set("direction", "move-y-negative");
        }
        if (diff_y < 0) {
          ship.movementShip.set("direction", "move-y-positive");
        }
      } else return;

      const [new_blocks, new_adj_blocks] = boat_blocks(
        x_first,
        y_first,
        len,
        direction
      );
      temporary_data_boat.set("blocks", new_blocks);
      temporary_data_boat.set("adjBlocks", new_adj_blocks);
      temporary_data_boat.set("ship", ship);

      reset_occupiedBlocks(new_blocks, new_adj_blocks, ship);
    }
  }

  const mapBlocks = (
    objShip,
    set_ship_blocks,
    set_around_blocks,
    mapInside,
    mapAdj,
    movingBlock = false
  ) => {
    let ships_blocks_copy = [...set_ship_blocks];
    let set_around_blocks_copy = [...set_around_blocks];

    for (let i = 0; i < ships_blocks_copy.length; i++) {
      let block_ship = ships_blocks_copy[i].toString();
      mapInside.set(block_ship, objShip);
    }

    if (movingBlock === false) {
      objShip.blocks = [...set_ship_blocks];
    }

    for (let i = 0; i < set_around_blocks_copy.length; i++) {
      let adjacent_block = set_around_blocks_copy[i];
      const map_has_block = mapAdj.has(adjacent_block);
      let registered_ship;
      if (map_has_block) {
        registered_ship = mapAdj.get(adjacent_block);
        registered_ship.push(objShip.name);
      } else {
        registered_ship = [objShip.name];
      }
      mapAdj.set(adjacent_block, registered_ship);
      objShip.adjacentBlocks.push(adjacent_block);
    }
  };

  function placeShip(objShip) {
    // It uses the first block to determine all the blocks we need
    const len = objShip.lengthShip;
    let x_pos;
    let y_pos;
    let direction_boat;

    const random_int = getRandomInt(2)[0];
    [x_pos, y_pos] = fitBoard(len);
    direction_boat = random_int === 0 ? "vertical" : "horizontal";
    objShip.direction = direction_boat;

    // Arrays of the ship and the adjacent blacks
    const [ship_blocks, around_blocks] = boat_blocks(
      x_pos,
      y_pos,
      len,
      direction_boat
    );

    if (testBlocks(ship_blocks, around_blocks, objShip)) {
      mapBlocks(
        objShip,
        ship_blocks,
        around_blocks,
        occupiedBlocks,
        surroundBlocks
      );
      objShip.collisionUpdate();
    } else {
      objShip.direction = "NOT SET";
      return placeShip(objShip);
    }
  }

  return {
    occupiedBlocks: occupiedBlocks,
    surroundBlocks: surroundBlocks,
    temporary_occupiedBlocks,
    temporary_surroundBlocks,
    mapBlocks: mapBlocks,
    temporary_data_boat,

    battleship: battleship,

    allShips: allShips,
    prepareShift: prepareShift,
    manuallyShiftShip: manuallyShiftShip,
    reset_occupiedBlocks: reset_occupiedBlocks,
    tempPermanent: tempPermanent,

    setBoats(_allShips = allShips) {
      occupiedBlocks.clear();
      surroundBlocks.clear();
      // console.clear();
      for (let i = 0; i < _allShips.length; i++) {
        _allShips[i].clearBlocks();
        _allShips[i].collisionUpdate();
        //console.log(_allShips[i].blockedDirection);

        placeShip(_allShips[i]);
      }
    },

    receiveAttack(x_axis, y_axis) {
      const sqr_board = [x_axis, y_axis].toString();
      const target = occupiedBlocks.get(sqr_board);
      if (target !== undefined) {
        target.hit();
      }
      return target === undefined ? false : target;
    },
    ohMyShip() {
      for (let i = 0; i < myShips.length; i++) {
        if (!myShips[i].isSunk()) return false;
      }
      return true;
    },
    collisionShip(myShip) {
      for (let i = 0; i < myShip.length; i++) {
        const sqr_board = myShip[i];
        if (occupiedBlocks.has(sqr_board)) return true;
      }
      return false;
    },
  };
}

export function Player(human) {
  const gboard = Gameboard(human);
  const win = false;

  return {
    human: human,
    win: win,
    gboard: gboard,
  };
}
