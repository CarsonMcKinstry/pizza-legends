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
  lastPressed?: Direction;
}

export class GameObject {
  x = 0;
  y = 0;
  sprite: Sprite;
  direction: Direction = "down";

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
}
