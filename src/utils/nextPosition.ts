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

  switch (direction) {
    case "left":
      x -= size;
      break;
    case "right":
      x += size;
      break;
    case "up":
      y -= size;
      break;
    case "down":
      y += size;
      break;
  }
  return { x, y };
};
