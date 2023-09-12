const TicTacToe = (() => {
  let divBoard;
  let aiMode = false; // off = false, on = true
  let p1 = true;
  let p2 = false;
  let gameOver = false;

  // gameboard grid
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
    userInput();
    gameOver = false; // Reset gameOver flag
    p1 = true;
    p2 = false;
  };

  const attachEventListeners = () => {
    const modeButton = document.querySelector("#ai");
    const resetButton = document.querySelector("#reset");

    modeButton.removeEventListener("click", toggleAiMode);
    resetButton.removeEventListener("click", reset);

    modeButton.addEventListener("click", toggleAiMode);
    resetButton.addEventListener("click", reset);
  };

  // Convert the randomly chosen index to x and y values
  const convert1Dto2D = (num) => {
    let x = Math.floor(num / 3);
    let y = num % 3;
    return { x, y };
  };

  // Switch mode between Human and AI
  const toggleAiMode = () => {
    aiMode = !aiMode;
  };

  const switchPlayer = () => {
    p1 = !p1;
    p2 = !p2;
  };

  // Render divs that make up the grid
  const renderGrid = () => {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        const divCell = document.createElement("div");
        divCell.classList.add("cell");
        divBoard.appendChild(divCell);
      }
    }
  };

  const clearGrid = () => {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        gameboard[i][j] = null;
      }
    }

    let divToDelete = divBoard.lastElementChild;
    while (divToDelete) {
      divBoard.removeChild(divToDelete);
      divToDelete = divBoard.lastElementChild;
    }
  };

  const announceWinnerAndReset = (winnerString) => {
    setTimeout(() => initialize(), 800);
    setTimeout(() => alert(`Winner is ${winnerString[0]}`), 800);
    gameOver = true;
  };

  const endGame = () => {
    let winnerStrings = ["", "", "", ""];

    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0, m = 2; j < gameboard[i].length; j++, m--) {
        winnerStrings[0] += gameboard[i][j]; // Row
        winnerStrings[1] += gameboard[j][i]; // Column
        winnerStrings[2] += gameboard[j][j]; // Diagonal1
        winnerStrings[3] += gameboard[j][m]; // Diagonal2
      }

      for (const winnerString of winnerStrings) {
        if (winnerString === "XXX" || winnerString === "OOO") {
          announceWinnerAndReset(winnerString);
          return true;
        }
      }

      // Reset winnerStrings for the next iteration
      winnerStrings = ["", "", "", ""];
    }

    // Check for a tie by counting the used cells directly
    const isBoardFull = gameboard
      .flat()
      .every((cell) => cell === "X" || cell === "O");

    if (isBoardFull) {
      setTimeout(() => alert(`It's a tie!`), 800);
      setTimeout(() => initialize(), 800);
      gameOver = true;
      return true; // End the game here as well
    }

    return false;
  };

  const reset = () => {
    gameboard = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    initialize();
  };

  const userInput = () => {
    const cells = Array.from(document.querySelectorAll(".cell"));
    cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        if (gameOver) return;

        if (p1 && !cell.textContent) {
          cell.textContent = "X";
          gameboard[Math.floor(index / 3)][index % 3] = "X";
          if (!endGame()) {
            if (!aiMode) {
              switchPlayer();
            } else {
              p1 = false;
              p2 = false;
              computerPlayer(cell);
            }
          }
        } else if (p2 && !cell.textContent) {
          cell.textContent = "O";
          gameboard[Math.floor(index / 3)][index % 3] = "O";
          if (!endGame()) {
            switchPlayer();
          }
        }
      });
    });
  };

  const computerPlayer = (cell) => {
    let availableIndices = [];
    let flatGameboard = gameboard.flat(2);
    let randomIndex;
    let positionToPlay;

    for (let i = 0; i < flatGameboard.length; i++) {
      if (flatGameboard[i] === null) {
        availableIndices.push(i);
      }
      console.log(`Available: ${availableIndices}`);
    }

    if (availableIndices.length === 0) {
      endGame();
    }

    // Generate random playable index from availableIndices
    randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];

    // Convert the randomly chosen index to x and y values
    const points = convert1Dto2D(randomIndex);

    // Plot the O in the Gamboard array
    gameboard[points.x][points.y] = "O";

    // Reset available indices
    availableIndices = [];

    // Plot the O in the UI
    cell.parentNode.children[randomIndex].textContent = "O";

    if (!endGame()) {
      p1 = true;
    }

    return true;
  };

  return { initialize };
})();

document.addEventListener("DOMContentLoaded", () => {
  const init = TicTacToe.initialize();
});
