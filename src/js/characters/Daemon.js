import Character from "../Character";

export default class Daemon extends Character {
  constructor(level) {
    super(level, "daemon");
    this.attack = 10;
    this.defence = 10;
    this.move = 1;
    this.rangeAttack = 4;

    if (this.level > 1) {
      this.levelUp(this.level - 1);
    }
  }
}
