import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  const winningSquareStyle = {
    backgroundColor: '#ccc'
  };
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board = [];
    for (let index = 0; index < 3; index++) {
      let row = []
      for (let i = 0; i < 3; i++) {
        row.push(this.renderSquare(index * 3 + i));
      }
      board.push(
      <div className="board-row">
        {row}
      </div>
      );
    }
    return (
      <div>
              {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isIncrease: true,
      colors: Array(9).fill('#f5d5ae')
    };
  }
  paintWinLine(winLine) {
    for (let count = 0; count < 3; count++) {
      this.state.colors[winLine[count]] = '#37d422';
    }

    winLine = [];
  }
  handleClick(i) {
    const value = i;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    console.log(current);
    this.setState({
      history: history.concat([
        {
          position: value,
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    var length = this.state.history.length;
    for (let i = 0; i < length; i++) {
      if (i === step) {
        document.getElementById(i).style.fontWeight = "900";
      }
      else {
        document.getElementById(i).style.fontWeight = "100";
      }
    };
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      colors: Array(9).fill('#f5d5ae')
    });
  }
  handleClickSort() {
    this.setState({
      isIncrease: !this.state.isIncrease,
    })
  }
  paintWinLine(winLine) {
    for (let count = 0; count < 3; count++) {
      this.state.colors[winLine[count]] = '#37d422';
    }

    winLine = [];
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const row = Math.floor(history[move].position / 3);
      const col = (history[move].position) % 3;      
      const desc = move ? `Go to move #${move} [${row},${col}]` : 'Go to game start';       
      return (
        <li key={move}>
          <button id={move} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if (!this.state.isIncrease)
      {
        moves.reverse();
      }
    let status;
    if (winner) {
      status = "Winner: " + winner.win;
      this.paintWinLine(winner.winline)
    } else {
      if (history.length===10){
        status="Draw"
      }
      else{  status = "Next player: " + (this.state.xIsNext ? "X" : "O");}
     
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            colors = {this.state.colors}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleClickSort()}> Sort </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return{
        win: squares[a],
        winline :lines[i]
      } 
    }
  }
  return null;
}
