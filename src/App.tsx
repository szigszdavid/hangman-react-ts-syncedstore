import React from "react";
import { useSyncedStore } from "@syncedstore/react";
import { getYjsValue } from "@syncedstore/core";
import { store } from "./store"; // the store we defined above
import * as Y from "yjs";

function App() {
  //Játék állapottér
  const lettersString = "qwertzuiopőúöüóasdfghjkléáűíyxcvbnm";
  const arrayOfLetters = lettersString.split("");
  //SyncedStore
  const state = useSyncedStore(store);

  const doc = getYjsValue(state);
  //const array = getYjsValue(state.guesses);
  //const map = state.guesses.length ? getYjsValue(state.guesses[0]) : undefined;
  //console.log((doc as Y.Doc).clientID);

  const myClientID = (doc as Y.Doc).clientID
   
  //state.gameData.currentPlayerIndex = 0

  if(!([...state.players].includes(myClientID)))
  {
    state.players.push(myClientID)
    state.gameData.currentPlayerIndex = 0
    state.gameData.currentPlayerID = state.players[state.gameData.currentPlayerIndex]
  }

  const letterButtonsOnClick = (letter : string) => 
  {
    if (state.gameData.currentPlayerID === myClientID) {

      state.guesses.push(letter);
      state.gameData.badAttempts = state.guesses
      .filter(el => !state.gameData.answer?.split("").some(e => e === el)).length;
    
      if (state.players.length - 1 === state.gameData.currentPlayerIndex) {
            state.gameData.currentPlayerID = state.players[0];
            state.gameData.currentPlayerIndex = 0;
            
      }
      else
      {
          state.gameData.currentPlayerIndex!++;
          state.gameData.currentPlayerID = state.players[state.gameData.currentPlayerIndex!];
      }
    }
  
  }

  const newGameButtonOnClick = () => {
      state.gameData.allAnswers = [
        "alma",
        "körte",
        "cseresznye",
        "szilva",
        "szótár",
      ];
      state.gameData.answer =
        state.gameData.allAnswers[
          Math.floor(Math.random() * state.gameData.allAnswers.length)
        ];
      state.guesses.splice(0, state.guesses.length);
      state.gameData.badAttempts = 0;
      state.gameData.maxTry = 9;
  }

  const isWon = state.gameData.answer?.split("").map((e) => [...state.guesses].some(el => el === e) ? e : " _ ").some(el => el === " _ ") || state.guesses.length === 0
  
  return (
    <>
      <h1>Hangman game</h1>
      <p>{JSON.stringify(state)}</p>

      <div id="you-lose" hidden={state.gameData.badAttempts !== state.gameData.maxTry || !state.gameData.badAttempts}>
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
      <div id="ative-game" hidden={state.gameData.badAttempts === state.gameData.maxTry}>
        <p>
          {state.gameData.answer
            ?.split("")
            .map((e) =>
            [...state.guesses].some(el => el === e) ? e : " _ "
            )}
        </p>
        <h3 style={{color: "green"}}>{state.gameData.currentPlayerID === myClientID ? "Your turn!" : ""}</h3>
        <br />
        {arrayOfLetters.map((letter) => (
          <button
            onClick={
              () => letterButtonsOnClick(letter)
              }
            disabled={state.guesses.filter((el) => el === letter).length > 0}
          >
            {letter}
          </button>
        ))}
      </div>
      <div id="score">Bad attempts: {state.gameData.badAttempts}/9</div>

      <svg width="200px" height="200px" stroke="black" className="revealed" />
      <svg width="200px" height="200px" stroke="black">
        <line x1="0" y1="99%" x2="100%" y2="99%" />
        <line x1="20%" y1="99%" x2="20%" y2="5%" />
        <line x1="20%" y1="5%" x2="60%" y2="5%" />
        <line x1="20%" y1="5%" x2="60%" y2="5%" className="show" />
        <line x1="60%" y1="5%" x2="60%" y2="20%" />
        <circle cx="60%" cy="30%" r="10%" />
        <line x1="60%" y1="30%" x2="60%" y2="70%" />
        <line x1="40%" y1="50%" x2="80%" y2="50%" />
        <line x1="60%" y1="70%" x2="50%" y2="90%" />
        <line x1="60%" y1="70%" x2="70%" y2="90%" />
      </svg>
    </>
  );
}

export default App;
