import { calcTileType } from "../utils";

test.each([
  [0, 8, "top-left"],
  [1, 8, "top"],
  [63, 8, "bottom-right"],
  [7, 7, "left"],
])("func calcTileType", (index, boardsize, expected) => {
  expect(calcTileType(index, boardsize)).toBe(expected);
});
