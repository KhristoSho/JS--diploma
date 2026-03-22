import { characterGenerator, generateTeam } from "../generators";
import Bowman from "../characters/Bowman";
import Swordsman from "../characters/Swordsman";
import Magician from "../characters/Magician";

test("func characterGenerator", () => {
  const playerTypes = [Bowman, Swordsman];
  const playerGenerator = characterGenerator(playerTypes, 3);
  const character = playerGenerator.next().value;
  expect(playerTypes.some((char) => character instanceof char)).toBe(true);
  expect([1, 2, 3]).toContain(character.level);
});

test("func generatorTeam check quantity", () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const team = generateTeam(playerTypes, 3, 4);
  expect(team.characters.length).toBe(4);
});

test("func generatorTeam check levels", () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const team = generateTeam(playerTypes, 3, 4);
  let levels = [];

  for (let i = 0; i < team.characters.length; i++) {
    levels.push(team.characters[i].level);
  }
  expect(levels.every((level) => [1, 2, 3, 4].includes(level))).toBe(true);
});
