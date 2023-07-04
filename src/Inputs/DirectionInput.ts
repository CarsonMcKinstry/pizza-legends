import { Direction } from "@/types";

export class DirectionInput {
  heldDirections: Direction[] = [];

  private directionMap: Record<string, Direction> = {
    ArrowUp: "up",
    KeyW: "up",
    ArrowRight: "right",
    KeyD: "right",
    ArrowDown: "down",
    KeyS: "down",
    ArrowLeft: "left",
    KeyA: "left",
  };

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", (e) => {
      const dir = this.directionMap[e.code];

      if (dir && !this.heldDirections.includes(dir)) {
        this.heldDirections.unshift(dir);
      }
    });

    document.addEventListener("keyup", (e) => {
      const dir = this.directionMap[e.code];

      if (dir && this.heldDirections.includes(dir)) {
        this.heldDirections = this.heldDirections.filter((d) => d !== dir);
      }
    });
  }

  isPressed(direction: Direction) {
    return this.heldDirections.includes(direction);
  }
}
