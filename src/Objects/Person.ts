import { Behavior, BehaviorMap, behavior } from "./../Behaviors";

import { globalEvents } from "./../GlobalEvents";

import {
  GameObject,
  GameObjectConfig,
  GameObjectStateUpdate,
} from "../GameObject";

import { CutsceneConfig, Direction } from "../types";
import { TILE_SIZE } from "../constants";
import { nextPosition } from "../utils/nextPosition";

export interface PersonConfig extends Omit<GameObjectConfig, "src"> {
  spriteName: string;
  isPlayerControlled?: true;
  talking?: CutsceneConfig[];
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
  override isStanding = false;
  intentPosition: [number, number] | null = null;
  talking: CutsceneConfig[] = [];

  constructor(config: PersonConfig) {
    super({
      ...config,
      src: `/images/characters/people/${config.spriteName}.png`,
    });

    this.isPlayerControlled =
      config.isPlayerControlled ?? this.isPlayerControlled;

    this.talking = config.talking ?? this.talking;
  }

  override update(state: PersonStateUpdate) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      if (
        !state.scene.isCutscenePlaying &&
        this.isPlayerControlled &&
        state.arrow
      ) {
        this.startBehavior(state, behavior.walk({ direction: state.arrow }));
      }
      this.updateSprite(state);
    }
  }

  override startBehavior(state: PersonStateUpdate, behavior: Behavior) {
    if (!this.isMounted) {
      return;
    }

    const behaviorMap: BehaviorMap<PersonStateUpdate> = {
      walk: (state, behavior) => {
        this.direction = behavior.direction;
        if (state.scene.isSpaceTaken(this.x, this.y, this.direction)) {
          if (behavior.retry) {
            setTimeout(() => {
              this.startBehavior(state, behavior);
            }, 20);
          } else {
            globalEvents.emit("PersonWalkingComplete", {
              whoId: this.id,
            });
          }

          return;
        }

        this.movingProgressRemaining = TILE_SIZE;

        const intentPosition = nextPosition(this.x, this.y, this.direction);
        this.intentPosition = [intentPosition.x, intentPosition.y];

        this.updateSprite();
      },
      stand: (_state, behavior) => {
        this.direction = behavior.direction;
        this.isStanding = true;
        setTimeout(() => {
          globalEvents.emit("PersonStandComplete", {
            whoId: this.id,
          });
          this.isStanding = false;
        }, behavior.time ?? 0);
      },
    };

    const handler = behaviorMap[behavior.type];

    if (handler) {
      handler(state, behavior as never);
    }
  }

  updatePosition() {
    const [prop, val] = this.directionUpdate[this.direction];

    this[prop] += val;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      // finished the walk...
      this.intentPosition = null;
      globalEvents.emit("PersonWalkingComplete", { whoId: this.id });
    }
  }

  updateSprite(): void;
  updateSprite(_state: PersonStateUpdate): void;
  updateSprite(_state?: any) {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(`walk-${this.direction}`);
      return;
    }
    this.sprite.setAnimation(`idle-${this.direction}`);
  }

  override isBehaviorReady() {
    return !this.isStanding;
  }
}
