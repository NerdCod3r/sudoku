'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const sudokuObject = new SudokuSolver();

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (req.body.puzzle && req.body.coordinate && req.body.value) {
        const puzzleString = req.body.puzzle;
        const value = req.body.value;
        const coordinate = req.body.coordinate;

        const coordinateRegExp = /^[A-I]\d$/;
        const valueRegExp = /^[1-9]$/;
        const puzzleRegExp = /^[1-9\.]{81}$/;

        if ( !value.match(valueRegExp) ) {
          res.json({
            "error":"Invalid value"
          });
        } else if (!coordinate.match(coordinateRegExp)) {
          res.json({
            "error":"Invalid coordinate"
          });
        } else if (!puzzle.match(puzzleRegExp)) {
          res.json({
            "error": "Invalid characters in puzzle"
          });
        } else if (puzzle.length != 81){
          res.json({
            "error":"Expected puzzle to be 81 characters long"
          });
        }

        // Continue with what is required in this endpoint.

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
        const regEx = /^[1-9\.]{81}/;
        if (solveString.match(regEx)){
          const inputLength = sudokuObject.validate(solveString);
          if (!inputLength) {
            res.json({
              "error": "Expected puzzle to be 81 characters long"
            });
          } else {
              sudokuObject.solve(solveString);
          }
        } else {
          res.json({
            "error": "Invalid characters in puzzle"
          });
        }
      }
      
    });
};
