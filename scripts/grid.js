import { Cell } from "./cell.js";


const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE*GRID_SIZE;

export class Grid {
  constructor(gridElement) {
    this.cells = [];
    for (let index = 0; index < CELLS_COUNT; index++) {
      
      this.cells.push(
        new Cell(gridElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
      )
      
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();
    this.cellsGroupedByRow = this.groupCellsByRow();
    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column => [...column].reverse())
    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(column => [...column].reverse())
  }
  getRandomEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.isEmpty())
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    return emptyCells[randomIndex]
  }

  groupCellsByColumn() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;
      return groupedCells;
    }, []); 
  }

  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, []); 
  }
}