import Team from "./Team";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);
    const level = levels[Math.floor(Math.random() * levels.length)];
    let character =
      allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    character = new character(level);
    yield character;
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);
  let characters = [];

  for (let i = 0; i < characterCount; i++) {
    characters.push(playerGenerator.next().value);
  }
  return new Team(characters);
}
