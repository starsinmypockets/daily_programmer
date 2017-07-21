/**
 * some named constants
 */
const gx = _.range(0, 10, 1);
const gy = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

/**
 * UTILS
 **/
const makeBoard = (cols, rowIdxs) => rowIdxs.map(row => cols.map(col => '◯'));

const getCoords = (x, _y, len, dir, coords = []) => {
  const y = (typeof _y === 'number') ? _y : gy.indexOf(_y);

  if (coords.length === 0) {
    return getCoords(x, y, len, dir, [{
      x: x,
      y: y
    }]);
  } else if (coords.length > 0 && coords.length < len) {
    switch (dir) {
      case 'l':
        return getCoords(x - 1, y, len, dir, coords.concat([{
          x: x - 1,
          y: y
        }]));
      case 'r':
        return getCoords(x + 1, y, len, dir, coords.concat([{
          x: x + 1,
          y: y
        }]));
      case 'u':
        return getCoords(x, y - 1, len, dir, coords.concat([{
          x: x,
          y: y - 1
        }]));
      case 'd':
        return getCoords(x, y + 1, len, dir, coords.concat([{
          x: x,
          y: y + 1
        }]));
      default:
        console.log('Invalid direction! Nothing changed');
        return {
          x: x,
          y: y
        }
    }
  } else {
    return coords;
  }
}

const coordsFromKey = (grid, key) => {
  const g1 = grid.map( (row, y) => {
    return row.map( (val, x) => {
      if (val === key) return [{x: x, y: y}];
    }).filter( v => v )
  }).filter( row => row.length > 0 )

  const flatten = g1[0].map( r => r[0]);
  return flatten;
}

const outOfBounds = (coords, grid) => {
  const oob = coords.filter(c => {
    return (
      c.x > grid[0].length-1 ||
      c.x < 0 ||
      c.y > grid.length-1 ||
      c.y < 0
    )
  });

  return oob.length;
}

const collision = (coords, grid) =>  coords.filter(c =>  { 
    return (grid[c.y][c.x] !== '◯');
  }).length;

const hasCoord = (coords, x, y) => coords.filter(c => {
  return (c.x === x && c.y === y);
}).length;

const placeRandom = (len, key, grid) => {
  const dirs = ['l', 'r', 'u', 'd'];
  const x = Math.floor(Math.random() * 9);
  const y = Math.floor(Math.random() * 9);
  const dir = dirs[Math.floor(Math.random() * 3)];	
  const updated = placeBoat(x, y, len, dir, key, grid);

  if (!updated) {
    return placeRandom(len, key, grid);
  } else {
    return updated;
  }
}

const placeBoat = (x, y, len, dir, key, grid) => {
  const coords = getCoords(x, y, len, dir, []);
  const _illegal =  outOfBounds(coords, grid) > 0 || collision(coords, grid) > 0 ;

  if (!_illegal) {
    return grid.map((row, y) => {
      return row.map((val, x) => {
        return (hasCoord(coords, x, y)) ? key : val;
      });
    });
  }

  return false;
}

// (int, int, Matrix) => bool
const updateOpponentBoardPublic = (x, y, hit, grid) => {
  return grid.map( (row, _y) => {
    if (_y === y) {
      return row.map((val, _x) => {
        if (_x === x) {
         return (hit) ? '*' : '-';
        } else {
          return val;
        }
      });
    } else {
      return row;
    }
  });
}

const isSunk = (x, y, grid) => {
  // get x,y key
  const pubCoords = [];
  const privCoords = [];
  // compare - if all are hits it is sunk
  const sunk = pubCoords.length === privCoords.length;
  return sunk;
}

const fire = (x, y, opponentBoardHidden, opponentBoardPublic) => {
  const hit = collision([{x: x, y: y}], opponentBoardHidden);
  const newB = updateOpponentBoardPublic(x, y, hit, opponentBoardPublic);
  const sunk = isSunk(x, y, newB);
  return newB;
}

const fleet = () => ({
  C: 5,
  B: 4,
  b: 4,
  R: 3,
  r: 3,
  D: 2,
  d: 2,
})

/**
 * COMPONENTS
 */
var Header = React.createClass({
  render: function() {
    return ( <div className = "grid-header">
      <div className="cell"> . </div>
        { this.props.cols.map(val => <div className = "cell" >{val}</div>) }
      </div>
    )
  }
})
var Row = React.createClass({
  render: function() {
    return ( <div className = "row" >
      <div className = "cell idx" > {
        this.props.idxs[this.props.idx]
      } </div> {
        this.props.row.map(val => {
          return ( <div className = "cell" > {
            val
          } </div>)
        })
      } </div>
    )
  }
});

var Grid = React.createClass({
  render: function() {
    return ( 
      <div id="grid">
      <h1>{this.props.title}</h1> 
      <Header cols={this.props.cols}></Header> {
        this.props.grid.map((row, i) => {
          return <Row row = {
            row
          }
          idx = {
            i
          }
          idxs = {
            this.props.idxs
          }
          />
        })
      } </div>
    )
  }
});

var Game = React.createClass({
  render: function () {
    return (
      <div id="game">
        <Grid {...this.props} title="Opponent Public" grid={this.props.opponentBoardPublic} />
        <Grid {...this.props} title="Opponent Private / debug" grid={this.props.opponentBoardHidden} />
      </div>
    )
  }
});

const runTests = function() {
/*  	console.log('Get Coords');
  	console.log(getCoords(4, 'd', 3, 'l'));
  	console.log(getCoords(2, 'd', 13, 'r'));
  	console.log(getCoords(5, 'e', 5, 'u'));
  	console.log(getCoords(5, 'f', 4, 'd'));
    
    console.log('In Bounds');
    console.log(outOfBounds([{x:0, y:9}, {x:0, y:8}])); // 0
    console.log(outOfBounds([{x:9, y:0}, {x:10, y:0}])); // 1
    console.log(outOfBounds([{x:0, y:9}, {x:0, y:8}, {x:0, y:11}, {x:0, y:12}])); // 2
    console.log('Place Boat');
    console.log(placeBoat(5, 'b', 3, 'd', makeBoard(gx, gy))); // valid
*/
}

// runTests();

/**
 * Game 1
 **/
const initBoard = makeBoard(gx, gy);
const opponentBoardHidden = makeBoard(gx, gy);
const opponentBoardPublic = makeBoard(gx, gy);

const p1Board = Object.keys(fleet()).reduce( (acc, key) => {
  const len = fleet()[key];
  return placeRandom(len, key, acc)
}, initBoard);

// @@TODO placeFleet func
const p2Board = Object.keys(fleet()).reduce( (acc, key) => {
  const len = fleet()[key];
  return placeRandom(len, key, acc)
}, initBoard);

console.log('CC', coordsFromKey(p2Board, 'C'));

const p1_r1 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2Board, opponentBoardPublic);
const p1_r2 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2Board, p1_r1);
const p1_r3 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2Board, p1_r2);
const p1_r4 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2Board, p1_r3);
const p1_r5 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2Board, p1_r4);

React.render( <Game grid={p1Board} cols={gx} idxs={gy} opponentBoardPublic={p1_r5} opponentBoardHidden={p2Board} />, document.body );