import React, { useEffect, useState } from "react";
import "./Cell.css";

const Cell = ({
  start,
  finish,
  wall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  row,
  col,
}) => {
  const classnameEx = start
    ? "bgGreen"
    : finish
    ? "bgRed"
    : wall
    ? "bgWall"
    : "bgBlanco";
  return (
    <React.Fragment>
      <div
        className={`celda ${classnameEx}`}
        id={`node-${row}-${col}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    </React.Fragment>
  );
};

export default Cell;
