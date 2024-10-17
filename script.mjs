import { Ship, Gameboard, Player } from "./src/utils.mjs";

const createBoard = (elementId, elementClass, player = "person") => {
  const board_1 = document.getElementById(elementId);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
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

console.log();
