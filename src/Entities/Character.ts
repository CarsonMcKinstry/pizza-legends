import {
  SceneBehaviorType,
  SceneBehaviors,
  isSceneBehavior,
} from "@/Behaviors/SceneBehaviors";
import { Entity, EntityConfig, EntityStateUpdate } from "@/Entity";
import { globalEvents } from "@/Inputs/GlobalEvents";
import { TILE_SIZE } from "@/constants";
import { Direction } from "@/types";
import { nextPosition } from "@/utils";

export type CharacterConfig = Omit<EntityConfig, "src"> & {
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

  intentPosition?: {
    x: number;
    y: number;
  };

  constructor({
    spriteName,
    isPlayerControlled,
    talking,
    ...entityConfig
  }: CharacterConfig) {
    super({
      ...entityConfig,
      src: `/images/characters/people/${spriteName}.png`,
    });

    this.isPlayerControlled = isPlayerControlled ?? this.isPlayerControlled;
    this.talking = talking ?? this.talking;
  }

  override update(state: EntityStateUpdate) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      const { directionInput } = state;
      if (
        !state.scene.isCutscenePlaying &&
        this.isPlayerControlled &&
        directionInput?.direction
      ) {
        this.startBehavior(
          state,
          SceneBehaviors.walk({ direction: directionInput.direction })
        );
      }

      this.updateSprite();
    }
  }

  startBehavior(state: EntityStateUpdate, behavior: SceneBehaviorType) {
    if (!this.isMounted) {
      return;
    }

    if (isSceneBehavior("walk", behavior)) {
      const { direction, retry, who } = behavior.details;
      this.direction = direction;
      if (state.scene.isSpaceTaken(this.x, this.y, this.direction)) {
        if (retry) {
          setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 20);
        } else {
          globalEvents.emit("PersonWalkingComplete", {
            whoId: who ?? this.id,
          });
        }
        return;
      }

      this.movingProgressRemaining = TILE_SIZE;

      this.intentPosition = nextPosition(this.x, this.y, this.direction);

      this.updateSprite();
    }

    if (isSceneBehavior("stand", behavior)) {
      const { direction, who, time } = behavior.details;
      this.direction = direction;

      setTimeout(() => {
        globalEvents.emit("PersonStandComplete", {
          whoId: who,
        });
      }, time ?? 0);
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(`walk-${this.direction}`);
      return;
    }

    this.sprite.setAnimation(`idle-${this.direction}`);
  }

  updatePosition() {
    const [prop, val] = this.directionUpdateMap[this.direction];

    this[prop] += val;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      delete this.intentPosition;
      globalEvents.emit("PersonWalkingComplete", {
        whoId: this.id,
      });
    }
  }
}
