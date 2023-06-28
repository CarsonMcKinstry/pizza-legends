import { Direction } from "../types";

type DirectionMap = Record<string, Direction>;

export type DirectionsHeld = Record<Direction, boolean>;

export class DirectionInput {
  heldDirection: Direction[] = [];

  map: DirectionMap = {
    ArrowUp: "up",
    KeyW: "up",
    ArrowDown: "down",
    KeyS: "down",
    ArrowLeft: "left",
    KeyA: "left",
    ArrowRight: "right",
    KeyD: "right",
  };

  directionsHeld: Record<Direction, boolean> = {
    down: false,
    up: false,
    left: false,
    right: false,
  };

  get direction() {
    return this.heldDirection[0];
  }

  init() {
    document.addEventListener("keydown", (e) => {
      const dir = this.map[e.code];

      if (dir) {
        // this.heldDirectionsAlt[dir] = true;
      }

      if (dir && !this.heldDirection.includes(dir)) {
        this.heldDirection.unshift(dir);
      }
    });

    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.code];

      if (dir) {
        // this.heldDirectionsAlt[dir] = false;
      }

      if (dir && this.heldDirection.includes(dir)) {
        this.heldDirection = this.heldDirection.filter((d) => d !== dir);
      }
    });
  }
}
