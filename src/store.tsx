import { syncedStore, getYjsValue } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";

// (optional, define types for TypeScript)
type GameData = { answer : string, allAnswers : string[], maxTry : number, badAttempts: number, currentPlayerIndex: number, currentPlayerID: number};

// Create your SyncedStore store
export const store = syncedStore({ guesses: [] as string[], gameData : {} as GameData , players: [] as number[]});

// Create a document that syncs automatically using Y-WebRTC
const doc = getYjsValue(store);
export const webrtcProvider = new WebrtcProvider("syncedstore-hangman-ts", doc as any);

export const disconnect = () => webrtcProvider.disconnect();
export const connect = () => webrtcProvider.connect();
