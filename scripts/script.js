import { Grid } from "./grid.js";
import { Tile } from "./tile.js";
const gameBoard = document.querySelector('.game-board')
const grid = new Grid(gameBoard);

grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
setKeydownListenerOnce();

function setKeydownListenerOnce()  {
  window.addEventListener('keydown', handleInput, {once: true} )
}

function handleInput(event) {
  
  switch (event.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setKeydownListenerOnce();
        return;
      }
      moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setKeydownListenerOnce();
        return;
      }
      moveDown()
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setKeydownListenerOnce();
        return;
      }
      moveLeft()
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setKeydownListenerOnce();
        return;
      }
      moveRight();
      break;
    default:
      setKeydownListenerOnce();
      return;
  }

  
  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveDown() && !canMoveLeft() && !canMoveRight()  && !canMoveUp()) {
    alert('Не получилось. Попробуйте еще раз. Обновите страницу для новой игры.')
    return
  }
  

  setKeydownListenerOnce();
}


function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn)
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow)
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn)
}
function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow)
}

function canMove(groupedCells) {
  return groupedCells.some(group => camMoveInGroup(group))
}

function camMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1]
    return targetCell.canAccept(cell.linkedTile);
  })
}

function moveUp() {
  slideTiles(grid.cellsGroupedByColumn)
}

function moveDown() {
  slideTiles(grid.cellsGroupedByReversedColumn)
}

function moveLeft() {
  slideTiles(grid.cellsGroupedByRow)
}

function moveRight() {
  slideTiles(grid.cellsGroupedByReversedRow)
  
}

function slideTiles(groupedCells) {
  groupedCells.forEach(group => slideTilesInGroup(group))

  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
  })
}

function slideTilesInGroup(group) {
  for (let i=1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let checkIndex = i - 1;
    while (checkIndex >= 0 && group[checkIndex].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[checkIndex];
      checkIndex--;
    }
    
    if (!targetCell) {
      continue;
    }

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    }
    else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile)
    }

    cellWithTile.unlinkTile();
  }
}