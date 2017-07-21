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
    console.log('CCCC', c); 
    return (grid[c.y][c.x] !== '◯');
  }).length;

const hasCoord = (coords, x, y) => coords.filter(c => {
  return (c.x === x && c.y === y);
}).length;

const placeRandom = (len, grid) => {
  const dirs = ['l', 'r', 'u', 'd'];
  const x = Math.floor(Math.random() * 9);
  const y = Math.floor(Math.random() * 9);
  const dir = dirs[Math.floor(Math.random() * 3)];	
  const updated = placeBoat(x, y, len, dir, grid);

  if (!updated) {
    return placeRandom(len, grid);
  } else {
    return updated;
  }
}

const placeBoat = (x, y, len, dir, grid) => {
  const coords = getCoords(x, y, len, dir, []);
  const _illegal =  outOfBounds(coords, grid) > 0 || collision(coords, grid) > 0 ;

  if (!_illegal) {
    return grid.map((row, y) => {
      return row.map((val, x) => {
        return (hasCoord(coords, x, y)) ? '●' : val;
      });
    });
  }

  return false;
}

// (int, int, Matrix) => bool
const updateOpponentBoardPublic = (x, y, hit, grid) => {
  return grid.map( (row, _y) => {
    if (_y === y) {
        console.log('row', row);
      return row.map((val, _x) => {
        console.log('val', val, hit);
        if (_x === x) {
         console.log('MEH', hit);
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

const fire = (x, y, opponentBoardHidden, opponentBoardPublic) => {
  const hit = collision([{x: x, y: y}], opponentBoardHidden);
  console.log('HIT', hit);
  const newB = updateOpponentBoardPublic(x, y, hit, opponentBoardPublic);
  console.log("NN", newB);
  return newB;
}

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
  	console.log('Get Coords');
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
}

// runTests();

/**
 * Game 1
 **/
const initBoard = makeBoard(gx, gy);
const opponentBoardHidden = makeBoard(gx, gy);
const opponentBoardPublic = makeBoard(gx, gy);

// @@TODO placeFleet func
const p1_1 = placeRandom(5, initBoard);
const p1_2 = placeRandom(4, p1_1);
const p1_3 = placeRandom(4, p1_2);
const p1_4 = placeRandom(3, p1_3);
const p1_5 = placeRandom(3, p1_4);
const p1_6 = placeRandom(2, p1_5);
const p1_7 = placeRandom(2, p1_6);

// @@TODO placeFleet func
const p2_1 = placeRandom(5, opponentBoardHidden);
const p2_2 = placeRandom(4, p2_1);
const p2_3 = placeRandom(4, p2_2);
const p2_4 = placeRandom(3, p2_3);
const p2_5 = placeRandom(3, p2_4);
const p2_6 = placeRandom(2, p2_5);
const p2_7 = placeRandom(2, p2_6);

const p1_r1 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2_7, opponentBoardPublic);
const p1_r2 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2_7, p1_r1);
const p1_r3 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2_7, p1_r2);
const p1_r4 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2_7, p1_r3);
const p1_r5 = fire(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9), p2_7, p1_r4);

React.render( <Game grid={p1_7} cols={gx} idxs={gy} opponentBoardPublic={p1_r5} opponentBoardHidden={p2_7} />, document.body );