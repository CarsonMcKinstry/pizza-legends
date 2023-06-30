import { TILE_SIZE } from "../constants";
import { Direction } from "../types";

export const nextPosition = (
  initialX: number,
  initialY: number,
  direction: Direction
) => {
  let x = initialX;
  let y = initialY;
  const size = TILE_SIZE;
  if (direction === "left") {
    x -= size;
  } else if (direction === "right") {
    x += size;
  } else if (direction === "up") {
    y -= size;
  } else if (direction === "down") {
    y += size;
  }
  return { x, y };
};
