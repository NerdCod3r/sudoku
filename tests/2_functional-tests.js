const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
// Test 1
test('Solve a POST request with a valid puzzle string', function(done){
    const validInputPuzzle = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    chai
    .request(server)
    .post("/api/solve")
    .send({"puzzle": validInputPuzzle})
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, "568913724342687519197254386685479231219538467734162895926345178473891652851726943");
        done();
    });
});
// Test 2
test("Solve a puzzle with a missing puzzle string", function(done){
    chai
    .request(server)
    .post("/api/solve")
    .send({"puzzle": null})
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
    });
});
// Test 3
test("Solve a puzzle with invalid characters", function(done){
    const puzzleWithInvalidChars = "..121.5..2.84..63.12.7.2..5..g..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
    .request(server)
    .post("/api/solve")
    .send({"puzzle": puzzleWithInvalidChars})
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
    });
});
// Test 4
test("Solve a puzzle with incorrect length", function(done){
    const puzzleWithIncorrectLength = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72";
    chai
    .request(server)
    .post("/api/solve")
    .send({"puzzle": puzzleWithIncorrectLength})
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
    });
});
// Test 5
test("Solve a puzzle that CANNOT BE SOLVED", function(done){
    const unsolveablePuzzleString = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
    .request(server)
    .post("/api/solve")
    .send({"puzzle":unsolveablePuzzleString })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, '');
        done();
    });
});
// Test 6
test("Check a puzzle with all fields using POST", function(done){
    const validPuzzleString = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const coordinate = "F3";
    const value = "3";

    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":validPuzzleString,
        "coordinate": coordinate,
        "value": value 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
    });
});
// Test 7
test("Check a puzzle with a single placement conflict using POST", function(done){
    const validPuzzleString = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const coordinate = "A1";
    const value = "1";

    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":validPuzzleString,
        "coordinate": coordinate,
        "value": value 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        done();
    });
});
// Test 8
test("Check a puzzle with multiple placement conflicts",  function(done){
    const validInputPuzzle = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const coordinate = "D2";
    const value = "9";

    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":validInputPuzzle,
        "coordinate": coordinate,
        "value": value 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        done();
    });

});
// Test 9
test("Check a puzzle with all placement conflicts", function(done){
    const validInputPuzzle = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const coordinate = "A2";
    const value = "5";

    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":validInputPuzzle,
        "coordinate": coordinate,
        "value": value 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        done();
    });
});
// Test 10
test("Check a puzzle placement with missing required fields", function(done){
    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":"",
        "coordinate": "",
        "value":"" 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
    });

});
// Test 11
test("Check a puzzle placement with invalid characters", function(done){
    const validInputPuzzle = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const coordinate = "L2";
    const value = ".";

    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":validInputPuzzle,
        "coordinate": coordinate,
        "value": value 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
    });
});
// Test 12
test("Check a puzzle with invalid length using POST method", function(done){
    const validInputPuzzle = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916";
    const coordinate = "A2";
    const value = "5";

    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":validInputPuzzle,
        "coordinate": coordinate,
        "value": value 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.exists(res.body.error);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
    });
});
// Test 13
test("Check a puzzle placement with invalid placement coordinate", function(done){
    const validInputPuzzle = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const coordinate = "02";
    const value = "5";

    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":validInputPuzzle,
        "coordinate": coordinate,
        "value": value 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.exists(res.body.error);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
    });
});
// Test 14
test("Check a puzzle placement with invalid value", function(done){
    const validInputPuzzle = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    const coordinate = "A2";
    const value = "-5";

    chai
    .request(server)
    .post("/api/check")
    .send({"puzzle":validInputPuzzle,
        "coordinate": coordinate,
        "value": value 
    })
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
    });
})
});

