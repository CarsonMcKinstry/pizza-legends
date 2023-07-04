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
    if (scene.isCutscenePlaying || !this.behaviorLoop.length) {
      return;
    }

    const behavior = this.behaviorLoop[this.behaviorLoopIndex];

    const eventConfig: SceneBehaviorType = {
      ...behavior,
      payload: {
        ...behavior.payload,
        who: this.id,
      },
    };

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
