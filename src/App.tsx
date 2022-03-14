import React, { useEffect } from "react";
import { useSyncedStore } from "@syncedstore/react";
import { getYjsValue } from "@syncedstore/core";
import { store } from "./store"; // the store we defined above
import * as Y from "yjs";
import {words} from "./words";

function App() {
  
  const lettersString = "qwertzuiopőúöüóasdfghjkléáűíyxcvbnm";
  const arrayOfLetters = lettersString.split("");
  
  const maxTry = 9;
  
  const state = useSyncedStore(store);

  const doc = getYjsValue(state);

  const myClientID = (doc as Y.Doc).clientID

  let badAttempts = state.gameData.guesses !== undefined ? state.gameData.guesses!.filter(el => !state.gameData.answer?.split("").some(e => e === el)).length : 0
  
  useEffect(() => {
    state.players.push(myClientID)
    state.gameData.guesses = []
  },[state])

  const letterButtonsOnClick = (letter : string) => 
  {
    if (state.players[state.playerData.currentPlayerIndex!] === myClientID) {

      state.gameData.guesses!.push(letter);
      badAttempts = state.gameData.guesses!
      .filter(el => !state.gameData.answer?.split("").some(e => e === el)).length;
    
      if (state.players.length - 1 === state.playerData.currentPlayerIndex) {
            state.playerData.currentPlayerIndex = 0;
            
      }
      else
      {
          state.playerData.currentPlayerIndex!++;
      }
    }
  
  }

  const newGameButtonOnClick = () => { 

      state.playerData.currentPlayerIndex = state.players.indexOf(myClientID)
      state.gameData.answer =
        words[
          Math.floor(Math.random() * words.length)
        ];
      state.gameData.guesses!.splice(0, state.gameData.guesses!.length);
      badAttempts = 0;
  }

  const isWon = state.gameData.guesses !== undefined ? state.gameData.answer?.split("").map((e) => [...state.gameData.guesses!].some(el => el === e) ? e : " _ ").some(el => el === " _ ") || state.gameData.guesses!.length === 0 : false
  
  //const svgArray = [`<line x1="0" y1="99%" x2="100%" y2="99%" />`]
  return (
    <>
      <h1>Hangman game</h1>
      <p>{JSON.stringify(state)}</p>

      <div id="you-lose" hidden={badAttempts !== maxTry}>
        <span>You lose!</span>
      </div>
      <div id="you-won" hidden={isWon}>
        <span>You win</span>
      </div>
      <button
          id="newgame"
          onClick={newGameButtonOnClick}
        >
          New game
      </button>
      <div id="ative-game" hidden={badAttempts === maxTry}>
        <p>
          {state.gameData.answer
            ?.split("")
            .map((e) =>
            [...state.gameData.guesses!].some(el => el === e) ? e : " _ "
            )}
        </p>
        <h3 style={{color: "green"}}>{state.players[state.playerData.currentPlayerIndex!] === myClientID ? "Your turn!" : ""}</h3>
        <br />
        {arrayOfLetters.map((letter) => (
          <button
            onClick={
              () => letterButtonsOnClick(letter)
              }
            disabled={state.gameData.guesses !== undefined ? state.gameData.guesses!.filter((el) => el === letter).length > 0 : true}
          >
            {letter}
          </button>
        ))}
      </div>
      <div id="score">Bad attempts: {badAttempts}/9</div>

      <svg width="200px" height="200px" stroke="black" className="revealed" />
      <svg width="200px" height="200px" >
        <line x1="0" y1="99%" x2="100%" y2="99%" stroke= {badAttempts >= 1 ? "black" : "white"}/>
        <line x1="20%" y1="99%" x2="20%" y2="5%" stroke= {badAttempts >= 2 ? "black" : "white"}/>
        <line x1="20%" y1="5%" x2="60%" y2="5%" stroke= {badAttempts >= 3 ? "black" : "white"}/>
        <line x1="20%" y1="5%" x2="60%" y2="5%" className="show" stroke= {badAttempts >= 3 ? "black" : "white"}/>
        <line x1="60%" y1="5%" x2="60%" y2="20%" stroke= {badAttempts >= 4 ? "black" : "white"}/>
        <circle cx="60%" cy="30%" r="10%" fill= {badAttempts >= 5 ? "black" : "white"} stroke= {badAttempts >= 5 ? "black" : "white"}/>
        <line x1="60%" y1="30%" x2="60%" y2="70%" stroke= {badAttempts >= 6 ? "black" : "white"}/>
        <line x1="40%" y1="50%" x2="80%" y2="50%" stroke= {badAttempts >= 7 ? "black" : "white"}/>
        <line x1="60%" y1="70%" x2="50%" y2="90%" stroke= {badAttempts >= 8 ? "black" : "white"}/>
        <line x1="60%" y1="70%" x2="70%" y2="90%" stroke= {badAttempts >= 9 ? "black" : "white"}/>
      </svg>
    </>
  );
}

export default App;
