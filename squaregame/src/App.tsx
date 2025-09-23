import React, { useEffect, useMemo, useState } from 'react';
import startCol from "./startCol";
import logo from './logo.svg';
import './App.css';

const colors = [
  "white",
  "blue",
  "orange",
  "coral",
  "black",
];
const Square = (props: any) => {
  const [col, setCol] = useState(props.initialCol)
  const [clicks, setClicks] = useState(props.initialClicks)
  const increaseColor = () => {
    let newCol = (col+1) % colors.length;
    setCol(newCol);
    props.onNewCol(newCol);
  }
  useEffect(() => {
    props.setColorListener(setCol)
  }, [])

  useEffect(() => {
    if (props.showsNumber) {
      props.setClickListener(setClicks)
    }
  })
  return <div onClick={increaseColor} className="square" style={{backgroundColor: colors[col]}}>{props.showsNumber ? clicks.toString()[props.id] : ""}</div>
}

const numSquares = 4000
let initialState = localStorage.getItem("state");
let initialCols = initialState ? JSON.parse(initialState) : startCol;
let squareListeners = Array(numSquares);
let currentColors = [...initialCols]
localStorage.setItem("state", JSON.stringify(currentColors))
let initialClicks = localStorage.getItem("clicks");
let clicks = initialClicks ? Number.parseInt(initialClicks) : 0;
let clickListeners = Array(numSquares / 100);
function App() {
  let squares = [];
  for (let i = 0; i < numSquares; i++) {
    squares.push(
      <Square key={i} 
        id={i}
        initialCol={initialCols[i]}
        setColorListener={(colorChangeListener: any) => {
          squareListeners[i] = colorChangeListener
        }}
        onNewCol={(newCol: number) => {
          currentColors[i] = newCol;
          clicks += 1;
          for (let j = 0; j < (numSquares / 100); j++) {
            clickListeners[j](clicks);
          }
          localStorage.setItem("state", JSON.stringify(currentColors));
          localStorage.setItem("clicks", clicks.toString());
        }}
        showsNumber={i < 40}
        setClickListener={(clickListener: any) => {
          clickListeners[i] = clickListener;
        }}
        initialClicks={clicks}
      />
    )
  }
  useEffect(() => {
    for (let i = 0; i < numSquares; i++) {
      squareListeners[i](initialCols[i])
    }
  }, [])
  return (
    <div className="App">
      {squares}
    </div>
  );
}

export default App;
