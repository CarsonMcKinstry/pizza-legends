import { Behavior, behavior } from "./Behaviors";
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

  update(state: GameObjectStateUpdate) {}

  mount(scene: SceneController) {
    this.isMounted = true;
    scene.addWall(this.x, this.y);

    setTimeout(() => {
      this.doBehaviorEvent(scene);
    }, 0);
  }

  async doBehaviorEvent(scene: SceneController) {
    // Don't do anything...
    if (scene.isCutscenePlaying || !this.behaviorLoop.length) {
      return;
    }

    // Setting up our event with relevant info
    const eventConfig: Behavior = {
      ...(this.behaviorLoop[this.behaviorLoopIndex] ?? {}),
      who: this.id,
    };

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

  startBehavior(...args: any[]) {}
}
