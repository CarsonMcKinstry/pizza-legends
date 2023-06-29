import { SceneController } from "./SceneController";
import { Sprite, SpriteConfig } from "./Sprite";
import { Direction } from "./types";

export interface GameObjectConfig
  extends Omit<SpriteConfig, "src" | "gameObject"> {
  x: number;
  y: number;
  src?: string;
  direction?: Direction;
}

export interface GameObjectStateUpdate {
  arrow?: Direction;
  scene: SceneController;
}

export class GameObject {
  x = 0;
  y = 0;
  sprite: Sprite;
  direction: Direction = "down";
  isMounted = false;

  constructor(config: GameObjectConfig) {
    this.x = config.x;
    this.y = config.y;
    this.direction = config.direction ?? this.direction;
    this.sprite = new Sprite({
      ...config,
      gameObject: this,
      src: config.src ?? "/images/characters/people/hero.png",
    });
  }

  update(state: GameObjectStateUpdate) {}

  mount(scene: SceneController) {
    this.isMounted = true;
    scene.addWall(this.x, this.y);
  }
}
