import { Grid } from "./grid.js";
import { Tile } from "./tile.js";
const gameBoard = document.querySelector('.game-board')
const grid = new Grid(gameBoard);
const losePopup = document.querySelector('.popup_type_lose')

let moves = 0;
const scoreElement = document.querySelector('.score__value')
function increaseMoves() {
  moves++;
  scoreElement.textContent = moves;

}

let touchStartCoordinateX = null;
let touchStartCoordinateY = null;


grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard))
setKeydownListenerOnce();


function handleTouchMove(event) {
  let touchCoordinateX = event.changedTouches[0].clientX 
  let touchCoordinateY = event.changedTouches[0].clientY 
  if (touchStartCoordinateX === touchCoordinateX || touchStartCoordinateY === touchCoordinateY) {
    setSwipeListenerOnce();
    return false;
  }

  
  console.log(touchCoordinateX, touchCoordinateY)

  let xDiff = touchStartCoordinateX - touchCoordinateX;
  let yDiff = touchStartCoordinateY - touchCoordinateY;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      if (!canMoveLeft()) {
        setSwipeListenerOnce();
        return;
      }
      moveLeft();
      increaseMoves()
    }
    else {
      if (!canMoveRight()) {
        setSwipeListenerOnce();
        return;
      }
      moveRight();
      increaseMoves()
    }
  }
  else {
    if (yDiff > 0) {
      if (!canMoveUp()) {
        setSwipeListenerOnce();
        return;
      }
      moveUp();
      increaseMoves()
    }
    else {
      if (!canMoveDown()) {
        setSwipeListenerOnce();
        return;
      }
      moveDown();
      increaseMoves()
    }
  }

  

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);
  
  if (!canMoveDown() && !canMoveLeft() && !canMoveRight()  && !canMoveUp()) {
    losePopup.classList.add('popup_opened')
    return
  }


  setSwipeListenerOnce();
}


function handleTouchStart(event) {
  const firstTouch = event.touches[0];

  touchStartCoordinateX = firstTouch.clientX;
  touchStartCoordinateY = firstTouch.clientY;
  console.log(touchStartCoordinateX, touchStartCoordinateY)
} 

function setSwipeListenerOnce() {
  window.addEventListener('touchstart', handleTouchStart, {once : true});
  window.addEventListener('touchend', handleTouchMove, {once : true});
}





setSwipeListenerOnce();

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
      increaseMoves()
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setKeydownListenerOnce();
        return;
      }
      moveDown()
      increaseMoves()
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setKeydownListenerOnce();
        return;
      }
      moveLeft()
      increaseMoves()
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setKeydownListenerOnce();
        return;
      }
      moveRight();
      increaseMoves()
      break;
    default:
      setKeydownListenerOnce();
      return;
  }

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveDown() && !canMoveLeft() && !canMoveRight()  && !canMoveUp()) {
    losePopup.classList.add('popup_opened')
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