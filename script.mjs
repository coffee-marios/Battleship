import { Ship, Gameboard, Player } from "./src/utils.mjs";

const board_1 = document.getElementById("board_1");
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    const elem = document.createElement("div");
    elem.classList.add("board_block_1");
    board_1.appendChild(elem);
  }
}

console.log(board_1);
