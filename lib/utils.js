"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gameboard = Gameboard;
exports.Player = Player;
exports.Ship = Ship;
function Ship(lengthShip, name) {
  let hits = 0;
  let blocks = [];
  return {
    name: name,
    lengthShip: lengthShip,
    blocks: blocks,
    hit() {
      hits += 1;
    },
    isSunk() {
      return lengthShip <= hits;
    }
  };
}
const carrier1 = Ship(5, "Carrier");
const battleship1 = Ship(4, "Battleship");
const destroyer1 = Ship(3, "Destroyer");
const submarine1 = Ship(3, "Submarine");
const patrolBoat1 = Ship(2, "Patrol");
function Gameboard(carrier = carrier1, battleship = battleship1, destroyer = destroyer1, submarine = submarine1, patrolBoat = patrolBoat1) {
  //const myShips = [carrier, battleship, destroyer];
  const myShips = [];
  const occupiedBlocks = new Map();
  function placeShip(x, y, direction = "horizontal", nameShip) {
    let len = nameShip.lengthShip;
    const shipBlocks = [];
    if (direction === "horizontal") {
      const lastBlock = len + x - 1;
      for (let i = 0; i < lastBlock; i++) {
        const x_block = i + x;
        const key = [x_block, y].toString();
        if (occupiedBlocks.has(key)) return false;
        shipBlocks.push(key);
      }
    }
    if (direction === "vertical") {
      const lastBlock = len + y - 1;
      for (let i = 0; i < lastBlock; i++) {
        const y_block = i + y;
        const key = [x, y_block].toString();
        //console.log(occupiedBlocks);
        //console.log(key, occupiedBlocks.has(key));
        if (occupiedBlocks.has(key)) return false;
        shipBlocks.push(key);
      }
    }
    for (let i = 0; i < shipBlocks.length; i++) {
      let key_ship = shipBlocks[i];
      occupiedBlocks.set(key_ship, nameShip);
      nameShip.blocks.push(key_ship);
    }
    myShips.push(nameShip);
  }
  placeShip(1, 1, "horizontal", carrier);
  placeShip(3, 5, "horizontal", battleship);
  placeShip(0, 3, "vertical", destroyer);
  placeShip(4, 3, "horizontal", submarine);
  placeShip(3, 7, "horizontal", patrolBoat);
  return {
    occupiedBlocks: occupiedBlocks,
    carrier: carrier,
    battleship: battleship,
    myShips: myShips,
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
    }
  };
}
function Player(human = true) {
  const gboard = Gameboard();
  const win = false;
  return {
    human: human,
    win: win,
    gboard: gboard
  };
}