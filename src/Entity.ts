import { Sprite, SpriteConfig } from "@/Sprite";
import { Direction } from "@/types";
import { DirectionInput } from "@/Inputs/DirectionInput";
import { SceneController } from "@/SceneController";
import { SceneBehaviorType } from "./Behaviors/SceneBehaviors";
import { SceneEvent } from "./SceneEvent";

export type EntityConfig = Omit<SpriteConfig, "src" | "entity"> & {
  x: number;
  y: number;
  src?: string;
  direction?: Direction;

  behaviorLoop?: SceneBehaviorType[];
};

export type EntityStateUpdate = {
  directionInput?: DirectionInput;
  scene: SceneController;
  camera?: Entity;
};

export class Entity {
  private _id?: string;
  x = 0;
  y = 0;
  sprite: Sprite;
  direction: Direction = "down";
  isMounted = false;
  isStanding = false;

  behaviorLoop: SceneBehaviorType[] = [];
  behaviorLoopIndex = 0;

  retryTimeout?: number;

  constructor({
    x,
    y,
    src,
    direction,
    behaviorLoop,
    ...spriteConfig
  }: EntityConfig) {
    this.x = x;
    this.y = y;
    this.direction = direction ?? this.direction;
    this.behaviorLoop = behaviorLoop ?? this.behaviorLoop;

    this.sprite = new Sprite({
      entity: this,
      src: src ?? "/images/characters/people/hero.png",
      ...spriteConfig,
    });
  }

  set id(id: string) {
    this._id = id;
  }

  get id(): string | undefined {
    return this._id;
  }

  update(_state: EntityStateUpdate) {}

  mount(scene: SceneController, id: string) {
    this.id = id;
    this.isMounted = true;

    setTimeout(() => {
      this.doBehaviorEvent(scene);
    }, 0);
  }

  async doBehaviorEvent(scene: SceneController) {
    if (!this.behaviorLoop.length) {
      return;
    }

    if (scene.isCutscenePlaying) {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }

      this.retryTimeout = setTimeout(() => {
        this.doBehaviorEvent(scene);
      }, 1000);

      return;
    }

    const behavior = this.behaviorLoop[this.behaviorLoopIndex];

    const eventConfig = {
      ...behavior,
      payload: {
        ...behavior.payload,
        who: this.id,
      },
    } as SceneBehaviorType;

    const eventHandler = new SceneEvent({
      scene,
      event: eventConfig,
    });
    await eventHandler.init();

    this.behaviorLoopIndex =
      (this.behaviorLoopIndex + 1) % this.behaviorLoop.length;

    this.doBehaviorEvent(scene);
  }

  isBehaviorReady() {
    return true;
  }
}
