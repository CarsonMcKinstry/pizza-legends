import {
  GameObject,
  GameObjectConfig,
  GameObjectStateUpdate,
} from "../GameObject";
import { Direction } from "../types";

export interface PersonConfig extends Omit<GameObjectConfig, "src"> {
  spriteName: string;
  isPlayerControlled?: true;
}

export interface PersonStateUpdate extends GameObjectStateUpdate {}

type DirectionUpdate = ["x" | "y", 1 | -1];

type DirectionUpdates = Record<Direction, DirectionUpdate>;

export class Person extends GameObject {
  movingProgressRemaining = 0;
  directionUpdate: DirectionUpdates = {
    up: ["y", -1],
    down: ["y", 1],
    left: ["x", -1],
    right: ["x", 1],
  };
  isPlayerControlled = false;

  constructor(config: PersonConfig) {
    super({
      ...config,
      src: `/images/characters/people/${config.spriteName}.png`,
    });

    this.isPlayerControlled =
      config.isPlayerControlled ?? this.isPlayerControlled;
  }

  override update(state: PersonStateUpdate) {
    this.updatePosition();

    // I have access to the held directions here...

    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      state.lastPressed
    ) {
      this.direction = state.lastPressed;
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [prop, val] = this.directionUpdate[this.direction];

      this[prop] += val;
      this.movingProgressRemaining -= 1;
    }
  }
}
