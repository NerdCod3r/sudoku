let InnerBoxes = [
  ["A1", "A2", "A3", "B1","B2", "B3", "C1", "C2", "C3"],
  ["A4", "A5", "A6", "B4","B5", "B6", "C4", "C5", "C6"],
  ["A7", "A8", "A9", "B7","B8", "B9", "C7", "C8", "C9"],
  
  ["D1", "D2", "D3", "E1","E2", "E3", "F1", "F2", "F3"],
  ["D4", "D5", "D6", "E4","E5", "E6", "F4", "F5", "F6"],
  ["D7", "D8", "D9", "E7","E8", "E9", "F7", "F8", "F9"],

  ["G1", "G2", "G3", "H1","H2", "H3", "I1", "I2", "I3"],
  ["G4", "G5", "G6", "H4","H5", "H6", "I4", "I5", "I6"],
  ["G7", "G8", "G9", "H7","H8", "H9", "I7", "I8", "I9"],

];

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
    if (puzzleLength != 81){
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let Board = this.createBoard(puzzleString);
    let clash = false;
    //  Loop through the columns to find clashes
    for (let col =0; col < 9; col++){
      if (col !== column){
        if(Board[row][col] === parseInt(value)){
          clash = true;
          break;
        }
      }
    }
    return clash;

  }

  checkColPlacement(puzzleString, row, column, value) {
    let Board = this.createBoard(puzzleString);
    let clash = false;
    //  Loop through the rows to find clashes
    for (let rows =0; rows < 9; rows++){
      if (rows !== row){
        if(Board[rows][column] === parseInt(value)){
          clash = true;
          break;
        }
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
  /**
   * finalSolve method is used to solve for the missing spaces on the board.
   * basically
   * @param {*} board 
   * @returns {string} boardString
   */
  finalSolve(board){
    const TOTAL = 45;
    const boardRowTotals = [];

    for (let row = 0; row < board.length; row++){
      let total = 0;
      for (let col = 0; col < board[row].length; col++)
      {
        if (board[row][col] !== '.'){
          total += board[row][col];
        }
      }
      boardRowTotals.push(total);
    }
    
    // Edit the board and insert the missing values
    for (let row = 0; row < board.length; row++){
      const currTotal = boardRowTotals[row];
      const difference = TOTAL - currTotal;

      for (let cols = 0; cols< board[row].length; cols++){
        if (board[row][cols] === '.') {
          board[row][cols] = difference;
          continue;
        }
      }
    }
    return board;
  }
  /**
   * Converts the board to a string
   * @param {*} board 
   * @returns boardString
   */
  stringify(board){
    let boardString = ""

    for (let rows= 0; rows < board.length; rows++){
      for(let cols = 0; cols< board[rows].length; cols++){
        boardString += board[rows][cols].toString();
      }
    }
    return boardString;
  }

  solve(board, solve=true) {
   for (let row = 0; row < board.length; row++ ) {
    for (let col = 0; col < board[row].length; col++)
    {
      if (board[row][col] === '.'){
        for (let num = 1; num <= 9; num++){
          const safe = this.isSafe(board, row, col, num);
          if (safe){
            board[row][col] = parseInt(num);
            break;
          }
        }
      }
    }
   }
   
   // Call the method that will put the final missing
   // values in the board array.
   board = this.finalSolve(board);
   if(!solve){
    return board;
   }
   return this.stringify(board);
  }
}

module.exports = SudokuSolver;

