import { Direction } from "../types";

const directionOpposites: Record<Direction, Direction> = {
  up: "down",
  left: "right",
  down: "up",
  right: "left",
};

export const oppositeDrection = (direction: Direction) => {
  return directionOpposites[direction];
};
