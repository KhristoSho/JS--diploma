/**
 * Entry point of app: don't change this
 */
import GamePlay from "./GamePlay";
import GameState from "./GameState";
import GameController from "./GameController";
import GameStateService from "./GameStateService";

const gamePlay = new GamePlay();
const gameState = new GameState();
gamePlay.bindToDOM(document.querySelector("#game-container"));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService, gameState);
gameCtrl.init();

// don't write your code here
