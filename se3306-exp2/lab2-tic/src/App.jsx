import { useState } from 'react';
import './App.css';

// 1. Square 组件：纯展示组件，没有自己的 state
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 2. Board 组件：渲染九宫格
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // 如果已经有胜者，或者这个格子已经被点过，就不做任何操作
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // 不可变更新：复制一份新数组，再修改，保证历史记录不被污染
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  // 计算当前状态（谁赢了或者轮到谁）
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = '获胜者: ' + winner;
  } else {
    status = '下一步: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// 3. Game 组件：顶层组件，管理全局 state，实现时间旅行
export default function Game() {
  // history 存下每一步的棋盘状态，currentMove 记录现在看到的是第几步
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  
  // 根据当前步数推算轮到谁，偶数步是 X，奇数步是 O
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // 落子后触发，更新历史记录
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // 时间旅行：跳转到第 move 步
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 生成时间旅行按钮列表
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '回到第 ' + move + ' 步';
    } else {
      description = '重新开始游戏';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// 4. 辅助函数：判断胜负
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}