const { Ship, Gameboard } = require("./index.js");

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
    expect(board.ohMyShip()).toBe(true);
  });
});
