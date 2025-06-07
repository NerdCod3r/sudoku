class SudokuSolver {
  /*
  * isSafe function used to check if placement in a certain box
  * is safe or not.  
  */
  isSafe(puzzleString, row, column, value){
  // console.log('isSafe');
    // Check row
  for (let x = 0; x < 9; x++) {
    if (puzzleString[row][x] === value) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (puzzleString[x][column] === value) return false;
  }

  // Check 3x3 subgrid
  const startRow = row - (row % 3);
  const startCol = column - (column % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (puzzleString[i + startRow][j + startCol] === value) return false;
    }
  }

  return true;
  }

  
  /**
   * createBoard method takes a string and returns an array of the sudoku
   * puzzle spread out.
   * @param {*} puzzleString 
   * @returns board
   */

  createBoard(puzzleString){
    let board = [];
    let index = 0;

    for ( let outerIndex = 0; outerIndex < 9; outerIndex++ ){
      let insideBoard = [];
      for( let pushIndex = 0; pushIndex < 9; pushIndex++)
      {
        if (puzzleString[index] == '.') {
          insideBoard.push(puzzleString[index]);
        } else {
          insideBoard.push(parseInt(puzzleString[index]));
        }
        index++;
      }

      board.push(insideBoard);
    }
    return board;
  }

  validate(puzzleString) {
    const puzzleLength = puzzleString.length;
    if (puzzleLength !== 81){
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let Board = this.createBoard(puzzleString);
    
    if ( Board[row].indexOf(parseInt(value)) === -1 ){
      return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let Board = this.createBoard(puzzleString);
    let clash = false;
    //  Loop through the rows to find clashes
    for (let rows =0; rows < 9; rows++){
        if(Board[rows][column] === parseInt(value)){
          clash = true;
          break;
        }

    }
    return clash;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let Board = this.createBoard(puzzleString);
    let clash = false;
    let subgrids = Array.from({ length: 9 }, () => []);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const subgridIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      subgrids[subgridIndex].push(Board[row][col]);
    }
  }
  let boxNumber = -1;

  // Find the box/ index to check in.
  if (row < 3 && column < 3){
    boxNumber = 0;
  } else if ( row < 3 && (column >= 3 && column < 6)){
    boxNumber = 1;
  } else if (row < 3 && (column >=6 && column < 9)){
    boxNumber = 2;
  } else if ((row >=3 && row < 6) && column < 3){
    boxNumber = 3;
  } else if ((row >=3 && row < 6) && (column >= 3 && column < 6)){
    boxNumber = 4;
  } else if ((row >= 3 && row < 6) && (column >= 6 && column < 9)){
    boxNumber = 5;
  } else if ((row >=6 && row < 9) && column < 3) {
    boxNumber = 6;
  } else if ((row >= 6 && row < 9) && (column >= 3 && column < 6)){
    boxNumber = 7;
  } else if ((row >= 6 && row < 9) && (column >=6 && column < 9)){
    boxNumber = 8;
  }

  // Do the findings
  for (let i = 0; i < subgrids[boxNumber].length; i++){
    if(subgrids[boxNumber][i] === parseInt(value)){
      clash = true;
    }
  }
  return clash;

  }
solvePuzzle(Board, row, col){
  const N = 9;

  if ( row === N - 1 && col === N ){
    return Board;
  }
  if ( col === N ) {
    row++;
    col = 0;
  }

  if ( Board[row][col] != '.' ){
    return this.solvePuzzle(Board, row, col + 1);
  }

  for ( let num = 1; num < 10; num++ ){
    if( this.isSafe(Board, row, col, num) ){
      Board[row][col] = num;

      if (this.solvePuzzle(Board, row, col + 1)){
        return Board;
      }
    }
    Board[row][col] = '.';
  }
  return false;
}
solve(board){
 let solvedBoard = this.solvePuzzle(board, 0, 0);
 let solved = true;
 // Check that it is solved.
 if ( solvedBoard === false){
  return "";
 } else {
    for ( let rows = 0; rows < 9; rows++ ){
      if ( solvedBoard[rows].indexOf(".") !== -1 ){
        solved = false;
      }
    }
    let stringSolution = "";
    // Stringify the board
    if ( solved ){
        stringSolution = solvedBoard.flat().join("");
    }
    return stringSolution;
    }
 }
 
}

module.exports = SudokuSolver;

