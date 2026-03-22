/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(type = "generic") {
    if (new.target === Character) {
      throw new Error("Cannot instantiate class 'Character'");
    }
    this.level = 1;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }

  levelUp(level) {
    this.level += level;
    this.health = 50;
    for (let i = 0; i < level; i++) {
      this.attack = Math.round(
        (this.attack + this.attack * (80 + this.health)) / 100,
      );
      this.defence = Math.round(
        (this.defence + this.defence * (80 + this.health)) / 100,
      );
    }
  }
}
