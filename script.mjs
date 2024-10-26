import { Gameboard, Player } from "./src/utils.mjs";

const player = Gameboard();
const blocksBoats = [];

player.setBoats();

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
          console.log("id", blockId);
          dot.classList.add("dot-strike");
          elem.classList.add("board_block_1-strike");
        });
      }

      board_1.appendChild(elem);
    }
  }
};
createBoard("board_1", "board_block_1");
createBoard("board_2", "board_block_2", "computer");

console.log("player: ", player);

const boat_block = (board, boat) => {
  let boat_block_id;
  const blocks = boat.blocks;
  for (let i = 0; i < blocks.length; i++) {
    boat_block_id = board;
    boat_block_id += "-[" + blocks[i].toString() + "]";
    const elem = document.getElementById(boat_block_id);
    elem.classList.add("boat");
    blocksBoats.push(elem);
  }
};

const drawShips = () => {
  const ships_player = player.allShips;
  for (let i = 0; i < ships_player.length; i++) {
    boat_block("board_1", ships_player[i]);
  }
};

drawShips();

const button_random_1 = document.getElementById("random-1");

button_random_1.addEventListener("click", () => {
  for (let i = 0; i < blocksBoats.length; i++) {
    blocksBoats[i].classList.remove("boat");
  }
  player.setBoats();
  drawShips();
});
