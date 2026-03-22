import Character from "../Character";

export default class Undead extends Character {
  constructor(level) {
    super("undead");
    this.attack = 40;
    this.defence = 10;
    this.move = 4;
    this.rangeAttack = 1;

    if (level > 1) {
      this.levelUp(this.level - 1);
    }
  }
}
