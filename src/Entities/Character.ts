import { Entity, EntityConfig, EntityStateUpdate } from "@/Entity";
import { Direction } from "@/types";

export type PersonConfig = Omit<EntityConfig, "src"> & {
  spriteName: string;
  isPlayerControlled?: true;
};

type DirectionUpdate = ["x" | "y", 1 | -1];

type DirectionUpdates = Record<Direction, DirectionUpdate>;

export class Character extends Entity {
  isPlayerControlled = false;

  private directionUpdateMap: DirectionUpdates = {
    up: ["y", -1],
    right: ["x", 1],
    down: ["y", 1],
    left: ["x", -1],
  };

  private movingProgressRemaining = 0;

  constructor({
    spriteName,
    isPlayerControlled,
    ...entityConfig
  }: PersonConfig) {
    super({
      ...entityConfig,
      src: `/images/characters/people/${spriteName}.png`,
    });

    this.isPlayerControlled = isPlayerControlled ?? this.isPlayerControlled;
  }

  override update({ directionInput }: EntityStateUpdate) {
    this.updatePosition();

    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      directionInput.direction
    ) {
      this.direction = directionInput.direction;
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [prop, val] = this.directionUpdateMap[this.direction];
      this[prop] += val;
      this.movingProgressRemaining -= 1;
    }
  }
}
