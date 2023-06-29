import { TILE_SIZE } from "../constants";

export const asGridCoords = (x: number, y: number) =>
  `${x * TILE_SIZE},${y * TILE_SIZE}`;
