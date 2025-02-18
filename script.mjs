import { Player } from "./src/utils.mjs";

const player_1 = Player(true);
const player = player_1.gboard;

const player_2 = Player(false);
const computer = player_2.gboard;
// console.clear();
console.log(computer);

// all dom blocks of boats
let allBlocks = [];
let movingShip;
let hoverBlock;

// Prevent the ship from jumping over other ships

let blockMemory = undefined;

// the first movement of the ship is special
let shipHasMoved = false;

let criticalBlock_x_greater;
let criticalBlock_x_smaller;
let criticalBlock_y_greater;
let criticalBlock_y_smaller;

// We need to remove the ship-name from dom block elements when we move a boat
const checkBlocksEmpty = new Set();

// Place the blocks we need
player.setBoats();
computer.setBoats();

console.log("You have the ships: ", player.allShips);

const createBoard = (elementId, elementClass, user = "person") => {
  const myBoard = document.getElementById(elementId);

  const content = document.createElement("div");
  myBoard.appendChild(content);

  if (user === "person") content.setAttribute("id", "removable1");
  if (user === "computer") content.setAttribute("id", "stable");

  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      const elem = document.createElement("div");
      const blockId = `${elementId}-[${i},${j}]`;
      elem.classList.add(elementClass);
      elem.id = blockId;
      const dot = document.createElement("div");
      elem.appendChild(dot);
      if (user === "computer") {
        elem.addEventListener("click", () => {
          dot.classList.add("dot-strike");
          dot.classList.add("hit-boat");

          elem.classList.add("board_block_2-strike");
        });
      }

      elem.addEventListener("mouseover", (x) => {
        const block_id = x.srcElement.id;

        const test_match = block_id.match(/\[(.*)\]$/);
        const block_array = test_match ? JSON.parse(test_match[0]) : null;
        hoverBlock = block_array;
      });

      content.appendChild(elem);
    }
  }
};
createBoard("board_1", "board_block_1", "person");
createBoard("board_2", "board_block_2", "computer");
// console.log("player: ", player);

const drawShips = (common = true) => {
  // Human
  const ships_player = player.allShips;
  for (let i = 0; i < ships_player.length; i++) {
    boat_block("board_1", ships_player[i]);
    ships_player[i].moving = false;
  }
  if (!common) return;

  // Computer

  const ships_computer = computer.allShips;
  console.log("XXXXXXXXXXXxx");
  console.log(ships_computer);
  for (let i = 0; i < ships_computer.length; i++) {
    boat_block("board_2", ships_computer[i]);
    ships_computer[i].moving = false;
  }
};

// Define the blocks of a boat
const boat_block = (board, boat) => {
  let boat_block_id;
  let currentTarget;
  const blocksBoat = boat.blocks;

  const onMouseUp = () => {
    movingShip = null;
    blockMemory = undefined;
    checkBlocksEmpty.clear();
    boat.blockShiftUpdate();
    boat.collisionUpdate();

    shipHasMoved = false;

    // Stop the movement and clean up
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    // As we manually move a boat, we add blocks to reached blocks
    if (boat.reachedBlocks.length !== 0) {
      // I have to clear the blocks and add the new blocks
      // console.clear();

      boat.blocks = boat.reachedBlocks;
      boat.reachedBlocks = [];
      boat.adjacentBlocks = boat.reachedAdjBlocks;
      boat.reachedAdjBlocks = [];
    }
    boat.moving = false;
    if (currentTarget) {
      console.log("");
    } else {
      console.log("No element found under the cursor.");
    }
  };

  let elementsBoats;

  const onMouseMove = () => {
    elementsBoats = [];
    const nameShip = boat.name;
    let boatElement = document.getElementsByClassName(nameShip);
    let collision = boat.blockedDirection.get("collision");

    if (blockMemory === undefined && hoverBlock !== undefined)
      blockMemory = [...hoverBlock];

    if (collision && hoverBlock !== undefined) {
      const criticalBlock_x_greater =
        boat.blockedDirection.get("move-x-positive");
      const criticalBlock_x_smaller =
        boat.blockedDirection.get("move-x-negative");
      const criticalBlock_y_greater =
        boat.blockedDirection.get("move-y-positive");
      const criticalBlock_y_smaller =
        boat.blockedDirection.get("move-y-negative");
      // console.log(boat.blockedDirection);
      console.log(
        criticalBlock_x_greater,
        criticalBlock_x_smaller,
        criticalBlock_y_greater,
        criticalBlock_y_smaller
      );
      console.log(blockMemory, hoverBlock);
      if (
        criticalBlock_x_greater !== undefined &&
        (blockMemory[1] !== hoverBlock[1] || blockMemory[0] > hoverBlock[0])
      ) {
        boat.collisionUpdate();
      }
      if (
        criticalBlock_x_smaller !== undefined &&
        (blockMemory[1] !== hoverBlock[1] || blockMemory[0] < hoverBlock[0])
      ) {
        boat.collisionUpdate();
      }
      if (
        criticalBlock_y_greater !== undefined &&
        (blockMemory[0] !== hoverBlock[0] || blockMemory[1] > hoverBlock[1])
      ) {
        boat.collisionUpdate();
      }
      if (
        criticalBlock_y_smaller !== undefined &&
        (blockMemory[0] !== hoverBlock[0] || blockMemory[1] < hoverBlock[1])
      ) {
        boat.collisionUpdate();
      }
    }

    if (!collision && hoverBlock !== undefined) {
      player.manuallyShiftShip(boat, hoverBlock);

      collision = boat.blockedDirection.get("collision");

      if (collision && blockMemory !== undefined) {
        if (blockMemory[0] > hoverBlock[0]) {
          criticalBlock_x_greater = blockMemory[0];
          boat.resetBlockedMovement("move-x-negative", criticalBlock_x_greater);
        }
        if (blockMemory[0] < hoverBlock[0]) {
          criticalBlock_x_smaller = blockMemory[0];
          boat.resetBlockedMovement("move-x-positive", criticalBlock_x_smaller);
        }
        if (blockMemory[1] > hoverBlock[1]) {
          criticalBlock_y_greater = blockMemory[1];
          boat.resetBlockedMovement("move-y-negative", criticalBlock_y_greater);
        }
        if (blockMemory[1] < hoverBlock[1]) {
          criticalBlock_y_smaller = blockMemory[1];
          boat.resetBlockedMovement("move-y-positive", criticalBlock_y_smaller);
        }
      }

      if (boat.moving === true) {
        blockMemory = [...hoverBlock];
        shipHasMoved = true;

        for (let i = 0; i < boatElement.length; i++) {
          let boatElementCheck = boatElement[i];
          boatElement[i].classList.remove("moving-boat");
          boatElement[i].classList.remove("boat");
          checkBlocksEmpty.add(boatElementCheck);

          let temporary_blocks_boat = player.temporary_data_boat.get("blocks");
          let temporary_blocks_adjBoat =
            player.temporary_data_boat.get("adjBlocks");

          player.mapBlocks(
            boat,
            temporary_blocks_boat,
            temporary_blocks_adjBoat,
            player.temporary_occupiedBlocks,
            player.temporary_surroundBlocks,
            true
          );
          checkBlocksEmpty.forEach((element) => {
            const match = element.id.match(/\[(.*?)\]/);
            let testBlock = player.occupiedBlocks.get(match[1]);
            if (testBlock === undefined) removeClassBoats(element);
          });
        }

        for (let i = 0; i < allBlocks.length; i++) {
          let classBoat = allBlocks[i].classList.contains(nameShip);
          if (!classBoat) {
            elementsBoats.push(allBlocks[i]);
          }
        }

        let new_squares = [...boat.reachedBlocks];

        addBlocks(new_squares, "moving-boat", elementsBoats);
        boat.moving = false;

        allBlocks = [...elementsBoats];
        if (player.temporary_occupiedBlocks.size >= 9) {
          player.tempPermanent();
          allBlocks = [...elementsBoats];
        }
      } else {
        console.log("The boat is not moving");
      }
    }
  };

  const addBlocks = (
    selectBlock,
    typeBoat = "boat",
    allElementBoats = allBlocks
  ) => {
    for (let i = 0; i < selectBlock.length; i++) {
      boat_block_id = board;
      boat_block_id += "-[" + selectBlock[i].toString() + "]";
      let elem = document.getElementById(boat_block_id);

      elem.classList.add(typeBoat);
      if (typeBoat === "moving-boat") elem.classList.add("moving-boat-border");
      const nameShip = boat.name;
      let boatBlocksCopy = [...boat.blocks];
      elem.classList.add(nameShip);

      allElementBoats.push(elem);

      elem.addEventListener("mousedown", (e) => {
        // console.clear();
        e.preventDefault();
        //   if (boat.isSunk) return;
        // console.log("Down", e.srcElement);
        console.log(hoverBlock);
        blockMemory = [...hoverBlock];
        boat.hit();

        player_2.commentState();
        if (boat.isSunk()) {
          player_2.addSunkBoat(boat);

          console.log(1, player_2);
        }
        const didILose = player_2.testLost();
        console.log("lost?", didILose);
        console.log(2, player_2.commentState());

        // let a = player.testLost();
        // console.log("lost?", a);

        // console.clear();
        // console.log("down", boat.name.match(/comp/));
        if (boat.name.match(/comp/) !== null) {
          console.log("Computer ship");

          console.log(elem.id);
          elem.textContent = "X";
          elem.classList.add("hit-boat");
        }
        let hereBoat = false;

        // Check if the click is on a boat
        for (let i = 0; i < boatBlocksCopy.length; i++) {
          if (hoverBlock.toString() === boat.blocks[i].toString()) {
            hereBoat = true;
          }
        }
        if (!hereBoat) return;

        player.prepareShift(hoverBlock);

        movingShip = boat;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    }
  };

  addBlocks(blocksBoat);
};

const button_random_1 = document.getElementById("random-1");

function removeClassBoats(elem) {
  elem.classList.remove("moving-boat");
  elem.classList.remove("boat");
  elem.classList.remove("Carrier");
  elem.classList.remove("Submarine");
  elem.classList.remove("Patrol");
  elem.classList.remove("Destroyer");
  elem.classList.remove("Battleship");
}

// New random positions of boats
button_random_1.addEventListener("click", () => {
  const element = document.getElementById("removable1");
  element.remove();
  createBoard("board_1", "board_block_1");
  player.setBoats();

  drawShips(false);
});

drawShips();
