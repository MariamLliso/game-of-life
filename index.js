/* eslint-disable max-classes-per-file */
class Cell {
  isAlive;
  row;
  column;
  neighbors = [];

  constructor(isAlive, row, column) {
    this.isAlive = isAlive;
    this.row = row;
    this.column = column;
  }

  getNeighbors(arrCells) {
    this.neighbors = arrCells.filter(
      (cell) =>
        (cell.column === this.column - 1 && cell.row === this.row - 1) ||
        (cell.column === this.column && cell.row === this.row - 1) ||
        (cell.column === this.column + 1 && cell.row === this.row - 1) ||
        (cell.column === this.column + 1 && cell.row === this.row) ||
        (cell.column === this.column + 1 && cell.row === this.row + 1) ||
        (cell.column === this.column && cell.row === this.row + 1) ||
        (cell.column === this.column - 1 && cell.row === this.row + 1) ||
        (cell.column === this.column - 1 && cell.row === this.row)
    );
  }
}

const expectedRows = 3;
const expectedColumns = 3;
const totalRows = expectedRows + 1;
const totalColumn = expectedColumns + 1;
const arrCells = [];

const generateBoard = () => {
  for (let row = 1; row < totalRows; row++) {
    for (let column = 1; column < totalColumn; column++) {
      const newCell = new Cell(false, row, column);
      arrCells.push(newCell);
    }
  }

  arrCells.forEach((cell, index, thisArray) => {
    cell.getNeighbors(thisArray);
  });
};

const OnClickCell = (positions) => {
  positions.forEach((position) => {
    const row = parseInt(position.getAttribute("data-row"), 10);
    const column = parseInt(position.getAttribute("data-column"), 10);
    position.addEventListener("click", () => {
      const cellFound = arrCells.find(
        (cell) => cell.row === row && cell.column === column
      );

      if (cellFound.isAlive === false) {
        cellFound.isAlive = true;
        position.classList.add("board-grid__cell--alive");
        position.classList.remove("board-grid__cell--dead");
      } else if (cellFound.isAlive === true) {
        cellFound.isAlive = false;
        position.classList.remove("board-grid__cell--alive");
        position.classList.add("board-grid__cell--dead");
      }
    });
  });
};

window.onload = () => {
  const boardGrid = document.querySelector("[data-board-grid]");
  generateBoard(boardGrid);

  const positions = document.querySelectorAll("[data-position]");
  OnClickCell(positions);
};
