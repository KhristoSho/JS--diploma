import themes from "./themes";
import cursors from "./cursors";
import { generateTeam } from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import Bowman from "./characters/Bowman";
import Daemon from "./characters/Daemon";
import Magician from "./characters/Magician";
import Swordsman from "./characters/Swordsman";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";
import { getUniqueItems } from "./support";
import GamePlay from "./GamePlay";

export default class GameController {
  constructor(gamePlay, stateService, gameState) {
    this.gamePlay = gamePlay;
    this.gameState = gameState;
    this.stateService = stateService;
    this.positions = [];
    this.selectedCharacter = null;

    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.gamePlay.addCellEnterListener(this.onCellEnterOnCharacter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeaveOnCharacter.bind(this));
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.createTeam("own", 3, 1 + this.gameState.currLevel);
    this.createTeam("enemy", 3, 1 + this.gameState.currLevel);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  newLevel() {
    this.gameState.currLevel += 1;
    const levelThemes = {
      1: themes.prairie,
      2: themes.desert,
      3: themes.arctic,
      4: themes.mountain,
    };

    this.levelUpTeam();
    this.gamePlay.drawUi(levelThemes[this.gameState.currLevel]);

    const ownPositions = getUniqueItems(
      this.getAllPositionForStart("own"),
      this.positions.length,
    );

    for (let i = 0; i < ownPositions.length; i++) {
      this.positions[i].position = ownPositions[i];
      console.log("Смена точек");
    }

    this.createTeam("enemy", 3, 1 + this.gameState.currLevel);
  }

  onCellClick(index) {
    if (this.gameState.ownTurn) {
      const character = this.positions.find((pos) => pos.position === index);

      // Выбор персонажа
      if (!this.selectedCharacter) {
        if (character) {
          if (
            ["bowman", "swordsman", "magician"].includes(
              character.character.type,
            )
          ) {
            this.gamePlay.selectCell(index);
            this.gameState.onCharacter = true;
            this.selectedCharacter = character;
          } else {
            GamePlay.showError("Это не ваш персонаж");
          }
        }
      }
      // Смена персонажа
      if (this.selectedCharacter) {
        if (character) {
          if (
            ["bowman", "swordsman", "magician"].includes(
              character.character.type,
            )
          ) {
            this.clearBoard();
            this.gamePlay.selectCell(index);
            this.gameState.onCharacter = true;
            this.selectedCharacter = character;
          }
        }
      }
      // Перемещение персонажа
      if (this.selectedCharacter) {
        const availableMoves = this.getAllIndexForAction(
          this.selectedCharacter,
          "own",
        ).avaiableMoves;

        if (availableMoves.includes(index)) {
          this.moveCharacter(this.selectedCharacter, index);
          this.clearBoard();
          this.selectedCharacter = null;
          this.gameState.onCharacter = false;
          this.gameState.ownTurn = false;
          this.makeEnemyMove();
        }
      }
      // Атака персонажей
      if (this.selectedCharacter) {
        const availableEnemies = this.getAllIndexForAction(
          this.selectedCharacter,
          "own",
        ).availableEnemies;

        if (availableEnemies.includes(index)) {
          this.attackCharacter(this.selectedCharacter, character);
          this.clearBoard();
          this.selectedCharacter = null;
          this.gameState.onCharacter = false;
          this.gameState.ownTurn = false;
          this.makeEnemyMove();
        }
      }
    }
  }

  onCellEnter(index) {
    const character = this.positions.find((pos) => pos.position === index);

    if (character) {
      this.gamePlay.showCellTooltip(
        this.getCharacterInfo(character.character),
        index,
      );
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  onCellEnterOnCharacter(index) {
    if (this.gameState.onCharacter) {
      const allActions = this.getAllIndexForAction(
        this.selectedCharacter,
        "own",
      );

      if (allActions.avaiableMoves.includes(index)) {
        this.gamePlay.selectCell(index, "green");
        this.gamePlay.setCursorCell(index, cursors.pointer);
      }
      if (allActions.availableEnemies.includes(index)) {
        this.gamePlay.selectCell(index, "red");
        this.gamePlay.setCursorCell(index, cursors.crosshair);
      }
      if (allActions.ownCharacters.includes(index)) {
        this.gamePlay.setCursorCell(index, cursors.pointer);
      }
      if (allActions.notAvailableEnemies.includes(index)) {
        this.gamePlay.setCursorCell(index, cursors.notallowed);
      }
    }
  }

  onCellLeaveOnCharacter(index) {
    if (this.gameState.onCharacter) {
      const allActions = this.getAllIndexForAction(
        this.selectedCharacter,
        "own",
      );

      if (
        allActions.allAction.includes(index) &&
        this.selectedCharacter.position !== index
      ) {
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor(cursors.auto);
      }
    }
  }

  onNewGameClick() {
    this.resetGame();
    this.init();
  }

  onLoadGameClick() {
    const loadData = this.stateService.load();
    const levelThemes = {
      1: themes.prairie,
      2: themes.desert,
      3: themes.arctic,
      4: themes.mountain,
    };
    this.gameState.currLevel = loadData.currLevel;
    this.positions = loadData.positions;

    this.gamePlay.drawUi(levelThemes[loadData.currLevel]);
    this.gamePlay.redrawPositions(this.positions);
  }

  onSaveGameClick() {
    const savedData = {
      positions: this.positions,
      currLevel: this.gameState.currLevel,
    };
    this.stateService.save(savedData);
  }

  resetGame() {
    this.positions = [];
    this.selectedCharacter = null;
    this.ownTurn = true;
    this.onCharacter = false;
    this.currLevel = 1;
  }

  createTeam(team = "own", numChar, maxLevel) {
    const positionsCharacters = [];
    const setTeam =
      team === "own"
        ? [Bowman, Swordsman, Magician]
        : [Daemon, Vampire, Undead];

    const genTeam = generateTeam(setTeam, maxLevel, numChar);
    const ownPositions = getUniqueItems(
      this.getAllPositionForStart(team),
      numChar,
    );

    for (let i = 0; i < numChar; i++) {
      positionsCharacters.push(
        new PositionedCharacter(genTeam.characters[i], ownPositions[i]),
      );
    }

    this.positions.push(...positionsCharacters);
    this.gamePlay.redrawPositions(this.positions);
  }

  levelUpTeam() {
    for (const char of this.positions) {
      char.character.levelUp(1);
    }
  }

  getAllPositionForStart(team) {
    let allPos = [];

    if (team === "own") {
      for (let i = 0; i < this.gamePlay.boardSize; i++) {
        allPos.push(i * this.gamePlay.boardSize);
        allPos.push(i * this.gamePlay.boardSize + 1);
      }
    }
    if (team === "enemy") {
      for (let i = 0; i < this.gamePlay.boardSize; i++) {
        allPos.push(i * this.gamePlay.boardSize + this.gamePlay.boardSize - 1);
        allPos.push(i * this.gamePlay.boardSize + this.gamePlay.boardSize - 2);
      }
    }
    return allPos;
  }

  getCharacterInfo(char) {
    const { level, attack, defence, health } = char;
    return `🎖${level} ⚔${attack} 🛡${defence} ❤${health}`;
  }

  getAllIndexForAction(character, side = "own") {
    let allActions = {
      ownCharacters: null,
      enemyCharacters: null,
      avaiableMoves: null,
      availableEnemies: null,
      notAvailableEnemies: null,
      allAction: null,
    };
    let ownTeam;
    let enemyTeam;

    if (side === "own") {
      ownTeam = ["bowman", "swordsman", "magician"];
      enemyTeam = ["vampire", "undead", "daemon"];
    } else {
      ownTeam = ["vampire", "undead", "daemon"];
      enemyTeam = ["bowman", "swordsman", "magician"];
    }
    // Позиции своих персонажей
    const ownCharacters = this.positions.filter((pos) => {
      return ownTeam.includes(pos.character.type);
    });
    allActions.ownCharacters = ownCharacters.map((char) => char.position);

    // Позиции вражеских персонажей
    const enemyCharacters = this.positions.filter((pos) => {
      return enemyTeam.includes(pos.character.type);
    });
    allActions.enemyCharacters = enemyCharacters.map((char) => char.position);

    // Позиции перемещения
    const avaiableMoves = this.getAvaiableMoves(character, [
      ...allActions.ownCharacters,
      ...allActions.enemyCharacters,
    ]);
    allActions.avaiableMoves = avaiableMoves;

    // Позиции для атаки
    const availableEnemies = this.getAvailableEnemies(
      character,
      allActions.enemyCharacters,
    );
    allActions.availableEnemies = availableEnemies;

    // Позиции, недоступные для атаки
    const notAvailableEnemies = allActions.enemyCharacters.filter((enemy) => {
      return !allActions.availableEnemies.includes(enemy);
    });
    allActions.notAvailableEnemies = notAvailableEnemies;

    // Все доступные клетки для действия
    allActions.allAction = [
      ...allActions.ownCharacters,
      ...allActions.enemyCharacters,
      ...allActions.avaiableMoves,
    ];

    return allActions;
  }

  getAvaiableMoves(character, blockedCells = []) {
    const position = character.position;
    const char = character.character;
    const moves = [];

    const startRow = Math.floor(position / this.gamePlay.boardSize);
    const startCol = position % this.gamePlay.boardSize;
    const direction = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (const [dRow, dCol] of direction) {
      for (let step = 1; step <= char.move; step++) {
        const newRow = startRow + dRow * step;
        const newCol = startCol + dCol * step;

        if (
          newRow < 0 ||
          newRow >= this.gamePlay.boardSize ||
          newCol < 0 ||
          newCol >= this.gamePlay.boardSize
        ) {
          break;
        }
        const targetIndex = newRow * this.gamePlay.boardSize + newCol;

        if (targetIndex === position || blockedCells.includes(targetIndex)) {
          break;
        }
        moves.push(targetIndex);
      }
    }
    return moves;
  }

  getAvailableEnemies(character, enemies) {
    const attackerPos = character.position;
    const range = character.character.rangeAttack;
    const startRow = Math.floor(attackerPos / this.gamePlay.boardSize);
    const startCol = attackerPos % this.gamePlay.boardSize;

    return enemies.filter((enemy) => {
      const enemyPos = enemy;
      const enemyRow = Math.floor(enemyPos / this.gamePlay.boardSize);
      const enemyCol = enemyPos % this.gamePlay.boardSize;

      const diffRow = enemyRow - startRow;
      const diffCol = enemyCol - startCol;

      const isSameRow = diffRow === 0;
      const isSameCol = diffCol === 0;
      const isDiagonal = Math.abs(diffRow) === Math.abs(diffCol);

      if (!isSameRow && !isSameCol && !isDiagonal) {
        return false;
      }

      const distance = Math.max(Math.abs(diffRow), Math.abs(diffCol));

      if (distance > range || distance === 0) {
        return false;
      }

      return true;
    });
  }

  clearBoard() {
    this.positions.map((pos) => {
      this.gamePlay.deselectCell(pos.position);
    });
    for (let i = 0; i < this.gamePlay.boardSize ** 2; i++) {
      this.gamePlay.setCursorCell(i, cursors.auto);
      this.gamePlay.deselectCell(i);
    }
  }

  moveCharacter(character, newPos) {
    character.position = newPos;
    this.gamePlay.redrawPositions(this.positions);
  }

  async attackCharacter(ownChar, enemyChar) {
    const attacker = ownChar.character;
    const target = enemyChar.character;
    const damage = Math.max(
      attacker.attack - target.defence * attacker.attack * 0.01,
    );

    target.health = target.health - damage;
    await this.gamePlay.showDamage(enemyChar.position, damage);
    if (target.health < 1) {
      this.positions = this.positions.filter((pos) => {
        return pos.character !== target;
      });
    }
    this.gamePlay.redrawPositions(this.positions);
  }

  makeEnemyMove() {
    this.gamePlay.setCursor(cursors.notallowed);

    setTimeout(() => {
      const enemyTeam = ["vampire", "undead", "daemon"];
      const ownTeam = ["bowman", "swordsman", "magician"];
      const enemyChars = this.positions.filter((p) =>
        enemyTeam.includes(p.character.type),
      );
      const ownChars = this.positions.filter((p) =>
        ownTeam.includes(p.character.type),
      );

      if (ownChars.length === 0) {
        this.gameState.ownTurn = true;
        return;
      }

      if (enemyChars.length === 0) {
        this.gameState.ownTurn = true;
        this.newLevel();
        return;
      }
      let actionTaken = false;

      for (const enemy of enemyChars) {
        if (enemy.character.health <= 0) continue;
        const actions = this.getAllIndexForAction(enemy, "enemy");

        if (actions.availableEnemies && actions.availableEnemies.length > 0) {
          const targetPos = actions.availableEnemies[0];
          const targetCharObj = this.positions.find(
            (p) => p.position === targetPos,
          );

          if (targetCharObj) {
            this.attackCharacter(enemy, targetCharObj);
            actionTaken = true;
            break;
          }
        }
      }

      if (!actionTaken) {
        let bestMover = null;
        let bestMoveIndex = -1;
        let minDistanceToHero = Infinity;

        for (const enemy of enemyChars) {
          if (enemy.character.health <= 0) continue;
          const actions = this.getAllIndexForAction(enemy, "enemy");
          if (actions.avaiableMoves && actions.avaiableMoves.length > 0) {
            for (const moveIndex of actions.avaiableMoves) {
              const moveRow = Math.floor(moveIndex / this.gamePlay.boardSize);
              const moveCol = moveIndex % this.gamePlay.boardSize;
              let distToNearestHero = Infinity;

              for (const hero of ownChars) {
                if (hero.character.health <= 0) continue;
                const heroRow = Math.floor(
                  hero.position / this.gamePlay.boardSize,
                );
                const heroCol = hero.position % this.gamePlay.boardSize;

                const d = Math.max(
                  Math.abs(heroRow - moveRow),
                  Math.abs(heroCol - moveCol),
                );
                if (d < distToNearestHero) {
                  distToNearestHero = d;
                }
              }

              if (distToNearestHero < minDistanceToHero) {
                minDistanceToHero = distToNearestHero;
                bestMover = enemy;
                bestMoveIndex = moveIndex;
              }
            }
          }
        }

        if (bestMover && bestMoveIndex !== -1) {
          this.moveCharacter(bestMover, bestMoveIndex);
          actionTaken = true;
        }
      }

      // this.gamePlay.redrawPositions(this.positions);

      this.gameState.ownTurn = true;
      this.gamePlay.setCursor(cursors.auto);
    }, 800);
  }
}
