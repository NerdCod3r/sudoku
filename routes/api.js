'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const sudokuObject = new SudokuSolver();

module.exports =  function (app) {

  app.route('/api/check')
    .post((req, res) => {
      if (req.body.puzzle && req.body.coordinate && req.body.value) {
        const puzzleString = req.body.puzzle;
        console.log(puzzleString);
        const value = req.body.value;
        //  console.log(value)
        const coordinate = req.body.coordinate;
        //  console.log(coordinate);

        const coordinateRegExp = /^[A-I][123456789]$/;
        const valueRegExp = /^[123456789]$/;
        const puzzleRegExp = /^[123456789.]*$/;

        if ( !value.match(valueRegExp) ) {
          res.json({
            "error":"Invalid value"
          });
        } else if (!coordinate.match(coordinateRegExp)) {
          res.json({
            "error":"Invalid coordinate"
          });
        } else if (!puzzleString.match(puzzleRegExp)) {
          res.json({
            "error": "Invalid characters in puzzle"
          });
        } else if (!sudokuObject.validate(puzzleString)){
          res.json({
            "error":"Expected puzzle to be 81 characters long"
          });
        } else if ( (puzzleString.length === 81) && (puzzleString.match(puzzleRegExp)) && (coordinate.match(coordinateRegExp)) && (value.match(valueRegExp))){
          // Continue with what is required in this endpoint.
        const ROW = coordinate[0];
        let rowIndex = -1;

        switch(ROW){
          case 'A':
            rowIndex = 0;
            break;
          case 'B':
            rowIndex = 1;
            break;
          case 'C':
            rowIndex = 2;
            break;
          case 'D':
            rowIndex = 3;
            break;
          case 'E':
            rowIndex = 4;
            break;
          case 'F':
              rowIndex = 5;
              break;
          case 'G':
              rowIndex = 6;
              break;
          case 'H':
              rowIndex = 7;
              break;
          case 'I':
              rowIndex = 8;
              break;
        }
        let colIndex = parseInt(coordinate[1]) - 1;

        // Check if the value is already in the board
        const placedBoard = sudokuObject.createBoard(puzzleString);
        if (placedBoard[rowIndex][colIndex] === parseInt(value)){
          res.json({
            "valid": true
          });
        } else {
          const rowClash = sudokuObject.checkRowPlacement(puzzleString, rowIndex, colIndex, value);
        //console.log("row:", rowClash);
        const colClash = sudokuObject.checkColPlacement(puzzleString, rowIndex, colIndex, value);
        //console.log("col:", colClash);
        const subGridsClash = sudokuObject.checkRegionPlacement(puzzleString, rowIndex, colIndex, value);
        //console.log("box:", subGridsClash);
        let clashes = []

        if (rowClash){
          clashes.push("row");
        } 
        if (colClash){
          clashes.push("column");
        }
        if (subGridsClash){
          clashes.push("region");
        }

        if (clashes.length === 0){
          res.json({
            "valid": true
          });
        } else {
          res.json({
            "valid": false,
            "conflict": clashes
          });
        }
      }
      // end of checks
      }

      } else {
        res.json({
          "error":"Required field(s) missing"
        })
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.puzzle) {
        res.json({
          "error":"Required field missing"
        });
      } else {
        const solveString = req.body.puzzle;
        const regEx = /^[123456789.]*$/;
        if (solveString.match(regEx)){
          const inputLength = sudokuObject.validate(solveString);
          if (!inputLength) {
            res.json({
              "error": "Expected puzzle to be 81 characters long"
            });
          } else {
              // Replace . with 0
              let sudokuBoard = sudokuObject.createBoard(solveString);
              const sudokuSolution = sudokuObject.solve(sudokuBoard);
              console.log("Solved");
              res.json({
                "solution": sudokuSolution
              });
          }
        } else {
          res.json({
            "error": "Invalid characters in puzzle"
          });
        }
      }
      
    });
};
