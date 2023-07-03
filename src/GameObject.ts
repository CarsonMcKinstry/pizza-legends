import { Behavior } from "./Behaviors";
import { SceneController } from "./SceneController";
import { SceneEvent } from "./SceneEvent";
import { Sprite, SpriteConfig } from "./Sprite";
import { Direction } from "./types";

export interface GameObjectConfig
  extends Omit<SpriteConfig, "src" | "gameObject"> {
  x: number;
  y: number;
  src?: string;
  direction?: Direction;
  behaviorLoop?: Behavior[];
}

export interface GameObjectStateUpdate {
  arrow?: Direction;
  scene: SceneController;
}

export class GameObject {
  id?: string;
  x = 0;
  y = 0;
  sprite: Sprite;
  direction: Direction = "down";
  isMounted = false;
  behaviorLoop: Behavior[] = [];

  behaviorLoopIndex = 0;
  isStanding = false;

  constructor(config: GameObjectConfig) {
    this.x = config.x;
    this.y = config.y;
    this.direction = config.direction ?? this.direction;
    this.sprite = new Sprite({
      ...config,
      gameObject: this,
      src: config.src ?? "/images/characters/people/hero.png",
    });
    this.behaviorLoop = config.behaviorLoop ?? this.behaviorLoop;
  }

  update(_state: GameObjectStateUpdate) {}

  mount(scene: SceneController, id?: string) {
    this.isMounted = true;
    this.id = id;

    setTimeout(() => {
      this.doBehaviorEvent(scene);
    }, 0);
  }

  unmount() {
    this.isMounted = false;
  }

  async doBehaviorEvent(scene: SceneController) {
    // Don't do anything...
    if (
      scene.isCutscenePlaying ||
      this.behaviorLoop.length === 0 ||
      !this.isBehaviorReady
    ) {
      return;
    }

    // Setting up our event with relevant info
    const eventConfig = {
      ...(this.behaviorLoop[this.behaviorLoopIndex] ?? {}),
      who: this.id,
    } as Behavior;

    // create an event instance out of our next event config
    const eventHandler = new SceneEvent({
      scene,
      event: eventConfig,
    });
    await eventHandler.init();

    // Setting the next event to fire
    this.behaviorLoopIndex =
      (this.behaviorLoopIndex + 1) % this.behaviorLoop.length;

    this.doBehaviorEvent(scene);
  }

  isBehaviorReady() {
    return true;
  }

  startBehavior(..._args: any[]) {}
}
