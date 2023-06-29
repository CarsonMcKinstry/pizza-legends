import {
  GameObject,
  GameObjectConfig,
  GameObjectStateUpdate,
} from "../GameObject";
import { Direction } from "../types";
import { BuildBehaviorType, createBehaviors } from "../utils/createBehaviors";

export interface PersonConfig extends Omit<GameObjectConfig, "src"> {
  spriteName: string;
  isPlayerControlled?: true;
}

export interface PersonStateUpdate extends GameObjectStateUpdate {}

type DirectionUpdate = ["x" | "y", 1 | -1];

type DirectionUpdates = Record<Direction, DirectionUpdate>;

const behaviors = createBehaviors<{
  walk: {
    direction: Direction;
  };
}>("walk");

export type Behavior = BuildBehaviorType<typeof behaviors>;

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
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      if (this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, behaviors.walk({ direction: state.arrow }));
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state: PersonStateUpdate, behavior: Behavior) {
    if (behavior.type === "walk") {
      this.direction = behavior.direction;
      if (state.scene.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }

      state.scene.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    const [prop, val] = this.directionUpdate[this.direction];

    this[prop] += val;
    this.movingProgressRemaining -= 1;
  }

  updateSprite(_state: PersonStateUpdate) {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(`walk-${this.direction}`);
      return;
    }
    this.sprite.setAnimation(`idle-${this.direction}`);
  }
}
