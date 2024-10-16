const { Ship, Gameboard } = require("./lib/utils.js");

describe("Ship conflict", () => {
  const player = Gameboard();
  test("Ship's collision carrier", () => {
    expect(player.collisionShip(player.carrier)).toBe(false);
  });
  test("Ship's collision battleship", () => {
    expect(player.collisionShip(player.battleship)).toBe(false);
  });
  test("Ship blocks", () => {
    expect(player.carrier.blocks.length).toBe(5);
    expect(player.carrier.blocks).toContain("5,1");
  });
});

describe("Hitting the ship", () => {
  test("Sink the ship with one strike", () => {
    const lengthShip = 1;
    const player = Ship(lengthShip);
    player.hit();
    expect(player.isSunk()).toBe(true);
  });

  test("Sink the ship with two strikes", () => {
    const lengthShip = 2;
    const player = Ship(lengthShip);
    player.hit();
    player.hit();
    expect(player.isSunk()).toBe(true);
  });

  test("The ship doesn't sink with four strikes", () => {
    const lengthShip = 5;
    const player = Ship(lengthShip);
    player.hit();
    player.hit();
    player.hit();
    player.hit();
    expect(player.isSunk()).toBe(false);
  });
});

describe("Placing the ship", () => {
  test("Striking the ship", () => {
    const board = Gameboard();
    expect(board.receiveAttack(1, 1)).toBe(true);
    expect(board.receiveAttack(5, 1)).toBe(true);
  });
  test("Missing the ship", () => {
    const board = Gameboard();
    expect(board.receiveAttack(6, 1)).toBe(false);
    expect(board.receiveAttack(5, 2)).toBe(false);
  });
  test("Sink a ship", () => {
    const board = Gameboard();
    for (let i = 1; i <= 5; i++) {
      board.receiveAttack(i, 1);
    }
    for (let i = 3; i <= 6; i++) {
      board.receiveAttack(i, 5);
    }
    for (let i = 7; i <= 88; i++) {
      board.receiveAttack(8, i);
    }

    expect(board.ohMyShip()).toBe(true);
  });
});
