import Character from "../Character";

export default class Vampire extends Character {
  constructor(level) {
    super(level, "vampire");
    this.attack = 25;
    this.defence = 25;
    this.move = 2;
    this.rangeAttack = 2;

    if (this.level > 1) {
      this.levelUp(this.level - 1);
    }
  }
}
