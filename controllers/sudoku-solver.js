class SudokuSolver {

  validate(puzzleString) {
    const puzzleLength = puzzleString.length;
    if (puzzleLength != 81){
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

