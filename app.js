const TicTacToe = (() => {
  const X = "X";
  const O = "O";
  let divBoard;
  let aiMode = false;
  let currentPlayer = X;
  let gameOver = false;

  let gameboard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const initialize = () => {
    divBoard = document.querySelector("#board");
    clearGrid();
    renderGrid();
    attachEventListeners();
    gameOver = false;
    currentPlayer = X;
  };

  const attachEventListeners = () => {
    document.querySelector("#ai").addEventListener("click", toggleAiMode);
    document.querySelector("#reset").addEventListener("click", initialize);
    divBoard.addEventListener("click", handleCellClick);
  };

  const toggleAiMode = () => {
    aiMode = !aiMode;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === X ? O : X;
  };

  const renderGrid = () => {
    for (let i = 0; i < 9; i++) {
      const divCell = document.createElement("div");
      divCell.classList.add("cell");
      divBoard.appendChild(divCell);
    }
  };

  const clearGrid = () => {
    gameboard = gameboard.map((row) => row.fill(null));
    while (divBoard.firstChild) {
      divBoard.removeChild(divBoard.firstChild);
    }
  };

  const announceWinnerAndReset = (winner) => {
    setTimeout(initialize, 800);
    setTimeout(() => alert(`Winner is ${winner}`), 800);
    gameOver = true;
  };

  const checkWinner = () => {
    // Check rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
      if (
        gameboard[i][0] === gameboard[i][1] &&
        gameboard[i][1] === gameboard[i][2] &&
        gameboard[i][0]
      ) {
        announceWinnerAndReset(gameboard[i][0]);
        return true;
      }
      if (
        gameboard[0][i] === gameboard[1][i] &&
        gameboard[1][i] === gameboard[2][i] &&
        gameboard[0][i]
      ) {
        announceWinnerAndReset(gameboard[0][i]);
        return true;
      }
    }
    if (
      gameboard[0][0] === gameboard[1][1] &&
      gameboard[1][1] === gameboard[2][2] &&
      gameboard[0][0]
    ) {
      announceWinnerAndReset(gameboard[0][0]);
      return true;
    }
    if (
      gameboard[0][2] === gameboard[1][1] &&
      gameboard[1][1] === gameboard[2][0] &&
      gameboard[0][2]
    ) {
      announceWinnerAndReset(gameboard[0][2]);
      return true;
    }

    // Check for a tie
    if (gameboard.flat().every((cell) => cell === X || cell === O)) {
      setTimeout(() => alert(`It's a tie!`), 800);
      setTimeout(initialize, 800);
      gameOver = true;
      return true;
    }

    return false;
  };

  const handleCellClick = (event) => {
    if (gameOver) return;
    const index = Array.from(divBoard.children).indexOf(event.target);
    const row = Math.floor(index / 3);
    const col = index % 3;

    if (gameboard[row][col] || !event.target.classList.contains("cell")) return;

    gameboard[row][col] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (!checkWinner()) {
      switchPlayer();
      if (aiMode && currentPlayer === O) {
        computerPlay();
      }
    }
  };

  const computerPlay = () => {
    const availableCells = gameboard
      .flatMap((row, i) => {
        return row.map((cell, j) => {
          if (cell === null) {
            return { row: i, col: j };
          }
          return null;
        });
      })
      .filter((cell) => cell !== null);

    if (availableCells.length === 0) {
      checkWinner();
      return;
    }

    const randomCell =
      availableCells[Math.floor(Math.random() * availableCells.length)];
    gameboard[randomCell.row][randomCell.col] = O;

    const index = randomCell.row * 3 + randomCell.col;
    divBoard.children[index].textContent = O;

    if (!checkWinner()) {
      switchPlayer();
    }
  };

  return { initialize };
})();

document.addEventListener("DOMContentLoaded", TicTacToe.initialize);
