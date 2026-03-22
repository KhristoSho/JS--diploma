import Bowman from "../characters/Bowman";
import Daemon from "../characters/Daemon";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";
import Character from "../Character";

test("error for create Character", () => {
  expect(() => {
    new Character(1);
  }).toThrow("Cannot instantiate class 'Character'");
});

test("create Bowman", () => {
  const bowman = new Bowman(1);
  expect([bowman.attack, bowman.defence]).toEqual([25, 25]);
});

test("create Daemon", () => {
  const daemon = new Daemon(1);
  expect([daemon.attack, daemon.defence]).toEqual([10, 10]);
});

test("create Magician", () => {
  const magician = new Magician(1);
  expect([magician.attack, magician.defence]).toEqual([10, 40]);
});

test("create Swordsman", () => {
  const swordsman = new Swordsman(1);
  expect([swordsman.attack, swordsman.defence]).toEqual([40, 10]);
});

test("create Undead", () => {
  const undead = new Undead(1);
  expect([undead.attack, undead.defence]).toEqual([40, 10]);
});

test("create Vampire", () => {
  const vampire = new Vampire(1);
  expect([vampire.attack, vampire.defence]).toEqual([25, 25]);
});
