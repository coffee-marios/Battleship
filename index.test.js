const { Ship } = require("./index.js");

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
