import { Ship, Gameboard, Player } from "./src/utils.mjs";

const player = Gameboard();
console.log(player.myShips);

const createBoard = (elementId, elementClass, player = "person") => {
  const board_1 = document.getElementById(elementId);
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      const elem = document.createElement("div");
      const blockId = `${elementId}-[${i},${j}]`;
      elem.classList.add(elementClass);
      elem.id = blockId;
      const dot = document.createElement("div");
      elem.appendChild(dot);
      if (player === "person") {
        elem.addEventListener("click", () => {
          dot.classList.add("dot-strike");
          elem.classList.add("board_block_1-strike");
        });
      }

      board_1.appendChild(elem);
      //if (i === 4) console.log(elem.id);
    }
  }
};
createBoard("board_1", "board_block_1");
createBoard("board_2", "board_block_2", "computer");

console.log(player);

const boat_block = (board, boat) => {
  let boat_block_id;
  const blocks = boat.blocks;
  for (let i = 0; i < blocks.length; i++) {
    boat_block_id = board;
    boat_block_id += "-[" + blocks[i].toString() + "]";
    const elem = document.getElementById(boat_block_id);
    elem.classList.add("boat");
    console.log(boat_block_id);
  }
};

const ships_player = player.myShips;

for (let i = 0; i < ships_player.length; i++) {
  boat_block("board_1", ships_player[i]);
}

console.log(player.myShips);
