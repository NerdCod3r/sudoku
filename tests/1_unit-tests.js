const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');

const server = require('../server');

chai.use(chaiHttp);

const Solver = require('../controllers/sudoku-solver.js');
let solver;
const sudokuObject = new Solver();
const validInput = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."; 
suite('Unit Tests', () => {
    suite("Basic Assertions", function(){
        // Test 1.
        test("Logic handles valid password of 81 characters", function(done){
            const validOutput = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
            let validBoard = sudokuObject.createBoard(validInput);
            assert.equal(sudokuObject.solve(validBoard), validOutput);
            done();
        });

        // Test 2.
        test("Logic handles a puzzle string with invalid characters NOT (1-9 OR .) ", function(done){
            const invalidInput = "1.5..2.84..63.12.7.2..5..g..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            chai
            .request(server)
            .post("/api/solve")
            .send({"puzzle": invalidInput})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
        });

        // Test 3.
        test("Logic handles a puzzle that is not 81 characters in length", function(done){
            const invalidLengthInput = "1.5..2.84..63.12.7.2..5.......9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
             chai
            .request(server)
            .post("/api/solve")
            .send({"puzzle": invalidLengthInput})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            });
        });

        // Test 4.
        test("Logic handles a valid row placement", function(done){
            assert.equal(sudokuObject.checkRowPlacement(validInput, 0, 1, "3"), false);
            done();
        }); 
        
        // Test 5.
        test("Logic handles invalid row plaement", function(done){
            assert.equal(sudokuObject.checkRowPlacement(validInput, 2, 1, "2"), true);
            done();
        });

        // Test 6.
        test("Logic handles a valid column placement", function(done){
            assert.equal(sudokuObject.checkColPlacement(validInput, 7, 6, "8" ), false);
            done();
        });

        // Test 7.
        test("Logic handles an invalid column placement", function(done){
            assert.equal(sudokuObject.checkColPlacement(validInput, 8 , 7, "7"), true);
            done();
        });

        // Test 8.
        test("Logic handles a valid region (3 x 3) grid placement", function(done){
            assert.equal(sudokuObject.checkRegionPlacement(validInput, 3, 2, "4"), false);
            done();
        });

        // Test 9.
        test("Logic handles an invalid region placement", function(done){
            assert.equal(sudokuObject.checkRegionPlacement(validInput, 3, 2, "9"), true);
            done();
        });

        // Test 10.
        test("Valid puzzle string pass the solver", function(done){
            let validBoard = sudokuObject.createBoard(validInput);
            const validOutput = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
            assert.equal(sudokuObject.solve(validBoard), validOutput );
            done();
        });

        // Test 11.
        test("Invalid puzzle strings fail the solver", function(done){
            const invalidNewInput = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            let invalidBoard = sudokuObject.createBoard(invalidNewInput);
            assert.equal(sudokuObject.solve(invalidBoard), '');
            done();
        });

        // Test 12.
        test("Solver returns the expected solution for an incomplete puzzle", function(done){
            let board = sudokuObject.createBoard("..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1");
            assert.equal(sudokuObject.solve(board), "218396745753284196496157832531672984649831257827549613962415378185763429374928561");
            done();
        });
    });
});
