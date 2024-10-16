import { Ship, Gameboard, Player } from "./src/utils.mjs";

const createBoard = (elementId) => {
  const board_1 = document.getElementById(elementId);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const elem = document.createElement("div");
      const blockId = `${elementId}-[${i},${j}]`;
      elem.classList.add("board_block_1");
      elem.id = blockId;
      board_1.appendChild(elem);
      // if (i === 4) console.log(elem.id);
    }
  }
};
createBoard("board_1");
createBoard("board_2");

console.log();
