/* eslint-disable max-classes-per-file */
class Cell {
  actualIsAlive;
  nextGenerationIsAlive;
  row;
  column;
  neighbors = [];

  constructor(actualIsAlive, row, column) {
    this.actualIsAlive = actualIsAlive;
    this.row = row;
    this.column = column;
  }

  getNeighbors(neighbors) {
    this.neighbors = neighbors.filter(
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

  setActualIsAlive(actualIsAlive) {
    this.actualIsAlive = actualIsAlive;
  }

  setNextGenerationIsAlive(nextGenerationIsAlive) {
    this.nextGenerationIsAlive = nextGenerationIsAlive;
  }

  checkNeighborsToLiveOrDie() {
    const aliveNeighbors = this.neighbors.filter(
      (neighbor) => neighbor.actualIsAlive === true
    );
    if (this.actualIsAlive === false && aliveNeighbors.length === 3) {
      this.nextGenerationIsAlive = true;
    } else if (
      this.actualIsAlive === true &&
      (aliveNeighbors.length === 3 || aliveNeighbors.length === 2)
    ) {
      this.nextGenerationIsAlive = true;
    } else {
      this.nextGenerationIsAlive = false;
    }
    return this.nextGenerationIsAlive;
  }
}

const expectedRows = 5;
const expectedColumns = 5;
const totalRows = expectedRows + 1;
const totalColumn = expectedColumns + 1;
const arrCells = [];

let intervalId;

const generateBoard = () => {
  for (let row = 1; row < totalRows; row++) {
    for (let column = 1; column < totalColumn; column++) {
      const newCell = new Cell(false, row, column);
      arrCells.push(newCell);
    }
  }
};

const OnClickCell = (positions) => {
  positions.forEach((position) => {
    const row = parseInt(position.getAttribute("data-row"), 10);
    const column = parseInt(position.getAttribute("data-column"), 10);
    position.addEventListener("click", () => {
      arrCells.forEach((cell) => {
        if (cell.row === row && cell.column === column) {
          if (cell.actualIsAlive === false) {
            cell.setActualIsAlive(true);
            position.classList.add("board-grid__cell--alive");
            position.classList.remove("board-grid__cell--dead");
          } else if (cell.actualIsAlive === true) {
            cell.setActualIsAlive(false);
            position.classList.add("board-grid__cell--dead");
            position.classList.remove("board-grid__cell--alive");
          }
        }
      });
    });
  });
};

const checkNeighbors = (actualCells) => {
  actualCells.forEach((cell, index, thisArray) => {
    cell.getNeighbors(thisArray);
  });
};

const checkIfNextGenLiveOrDie = (actualCells) => {
  actualCells.forEach((cell) => {
    cell.setNextGenerationIsAlive(cell.checkNeighborsToLiveOrDie());
  });
};

const changeCellActualStatus = (actualCells) => {
  actualCells.forEach((cell) => {
    cell.setActualIsAlive(cell.nextGenerationIsAlive);
  });
};

const updateGridDisplay = (positions, actualCells) => {
  positions.forEach((position) => {
    const row = parseInt(position.getAttribute("data-row"), 10);
    const column = parseInt(position.getAttribute("data-column"), 10);

    const cellFound = actualCells.find(
      (cell) => cell.row === row && cell.column === column
    );

    if (cellFound.actualIsAlive === true) {
      position.classList.add("board-grid__cell--alive");
      position.classList.remove("board-grid__cell--dead");
    } else if (cellFound.actualIsAlive === false) {
      position.classList.remove("board-grid__cell--alive");
      position.classList.add("board-grid__cell--dead");
    }
  });
};

const initGame = (positions, actualCells) => {
  intervalId = setInterval(() => {
    checkNeighbors(actualCells);
    checkIfNextGenLiveOrDie(actualCells);
    changeCellActualStatus(actualCells);
    updateGridDisplay(positions, actualCells);
  }, 1000);
};

const boardGrid = document.querySelector("[data-board-grid]");
generateBoard(boardGrid);

const positions = document.querySelectorAll("[data-position]");
OnClickCell(positions);

const startButton = document.querySelector("[data-start]");
startButton.addEventListener("click", () => {
  initGame(positions, arrCells);
});

const stopButton = document.querySelector("[data-stop]");
stopButton.addEventListener("click", () => {
  clearInterval(intervalId);
});
