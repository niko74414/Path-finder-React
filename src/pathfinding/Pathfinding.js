import React, { useEffect, useState } from "react";
import "./Pathfinding.css";
import { dijkstra, getNodesInShortestPathOrder } from "./algoritms/dijkstra";
// import Cell from "./Cell";
import "./Cell.css";

const Pathfinding = () => {
  const [grid, setGrid] = useState([]);
  const [mousePress, setMousePress] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [antCol, setAntCol] = useState(false);
  const [antRow, setAntRow] = useState(false);
  const [startRow, setStartRow] = useState(
    parseInt((window.innerHeight / 25 - 2) * 0.5)
  );
  const [startCol, setStartCol] = useState(
    parseInt((window.innerWidth / 25 - 2) * 0.1)
  );
  const [finishRow, setFinishRow] = useState(
    parseInt((window.innerHeight / 25 - 2) * 0.5)
  );
  const [finishCol, setFinishCol] = useState(
    parseInt((window.innerWidth / 25 - 2) * 0.9)
  );
  useEffect(() => {
    initGrid(true);
    window.addEventListener("resize", (e) => {
      initGrid(false);
    });
  }, []);
  const initGrid = (vari) => {
    const varGrid = [];
    for (let i = 0; i < window.innerHeight / 25 - 2; i++) {
      const actualRow = [];
      for (let j = 0; j < window.innerWidth / 25 - 2; j++) {
        actualRow.push(createCell(j, i, vari));
      }
      varGrid.push(actualRow);
    }
    setGrid(varGrid);
    setStartRow(parseInt((window.innerHeight / 25 - 2) * 0.5));
    setStartCol(parseInt((window.innerWidth / 25 - 2) * 0.1));
    setFinishRow(parseInt((window.innerHeight / 25 - 2) * 0.5));
    setFinishCol(parseInt((window.innerWidth / 25 - 2) * 0.9));
  };
  const createCell = (col, row, vari) => {
    if (vari) {
      return {
        col,
        row,
        isStart: col == startCol && row == startRow,
        isFinish: col == finishCol && row == finishRow,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
      };
    } else {
      return {
        col,
        row,
        isStart:
          col == parseInt((window.innerWidth / 25 - 2) * 0.1) &&
          row == parseInt((window.innerHeight / 25 - 2) * 0.5),
        isFinish:
          col == parseInt((window.innerWidth / 25 - 2) * 0.9) &&
          row == parseInt((window.innerHeight / 25 - 2) * 0.5),
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
      };
    }
  };
  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(
      grid,
      row,
      col,
      isStart,
      isFinish
    );
    setGrid(newGrid.newGrid);
    setIsStart(newGrid.PIsStart);
    setIsFinish(newGrid.PIsFinish);
    setMousePress(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mousePress) return;
    const newGrid = getNewGridWithWallToggled(
      grid,
      row,
      col,
      isStart,
      isFinish
    );
    setGrid(newGrid.newGrid);
  };
  const handleMouseUp = (row, col) => {
    setMousePress(false);
    setIsStart(false);
    setIsFinish(false);
  };
  const getNewGridWithWallToggled = (gridI, row, col, PIsStart, PIsFinish) => {
    const newGrid = gridI.slice();
    const node = newGrid[row][col];
    let antNode;
    if (antCol && antRow) {
      antNode = newGrid[antRow][antCol];
    }
    if (node.isStart && !PIsStart) {
      setAntCol(col);
      setAntRow(row);
      return { newGrid: newGrid, PIsStart: true, PIsFinish: false };
    } else if (node.isFinish && !PIsFinish) {
      setAntCol(col);
      setAntRow(row);
      return { newGrid: newGrid, PIsStart: false, PIsFinish: true };
    } else if (PIsStart) {
      const antNodeN = {
        ...antNode,
        isStart: false,
        isFinish: false,
        isWall: false,
      };
      const newNode = {
        ...node,
        isStart: true,
        isFinish: false,
        isWall: false,
      };
      newGrid[row][col] = newNode;
      newGrid[antRow][antCol] = antNodeN;
      setAntCol(col);
      setAntRow(row);
      setStartRow(row);
      setStartCol(col);
      return { newGrid: newGrid, PIsStart: true, PIsFinish: false };
    } else if (PIsFinish) {
      const antNodeN = {
        ...antNode,
        isStart: false,
        isFinish: false,
        isWall: false,
      };
      const newNode = {
        ...node,
        isStart: false,
        isFinish: true,
        isWall: false,
      };
      newGrid[row][col] = newNode;
      newGrid[antRow][antCol] = antNodeN;
      setAntCol(col);
      setAntRow(row);
      setFinishRow(row);
      setFinishCol(col);
      return { newGrid: newGrid, PIsStart: false, PIsFinish: true };
    } else {
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
      return { newGrid: newGrid, PIsStart: false, PIsFinish: false };
    }
  };
  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "celda node-visited";
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "celda node-shortest-path";
      }, 50 * i);
    }
  };

  const visualizeDijkstra = () => {
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };
  const celdas = () => {
    return grid.map((row, i) => {
      return (
        <div key={i} className="column">
          {row.map((node, index) => {
            const { row, col, isFinish, isStart, isWall } = node;
            const classnameEx = isStart
              ? "bgGreen"
              : isFinish
              ? "bgRed"
              : isWall
              ? "bgWall"
              : "bgBlanco";
            return (
              <div
                key={index}
                className={`celda ${classnameEx}`}
                id={`node-${row}-${col}`}
                onMouseDown={() => handleMouseDown(row, col)}
                onMouseEnter={() => handleMouseEnter(row, col)}
                onMouseUp={() => handleMouseUp(row, col)}
              ></div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      <section className="container">{celdas()}</section>
      <button onClick={() => visualizeDijkstra()}>Dijkstra's Algorithm</button>
    </React.Fragment>
  );
};

export default Pathfinding;
